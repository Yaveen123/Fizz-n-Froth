<?php
define('DATABASE', '../../fizz.db'); // CHANGE THIS
define('ORDER_KEY', 'order_key'); // Name of order key cookie.
// define('ADMINISTRATORS', array('127.0.0.1')); // IPs that can place more than one order.

$success = false;

function finish($db = null, $order_key = null, $status = null) {
    global $success;

    if ($db) {
        $db->close();
    }

    $response = array(
        "success" => $success
    );

    if (isset($order_key)) {
        $response["order_key"] = $order_key;
    }

    if (isset($status)) {
        $response["status"] = $status;
    }
    
    $response = json_encode($response);

    header('Content-Type: application/json');
    die($response);
}

function build_order_details($db, $order_id, $order) {
    foreach ($order as $id => $quantity) {
        $sql = $db->prepare('INSERT INTO order_details (order_id, item_id, quantity) VALUES (:order_id, :item_id, :quantity)');

        $sql->bindValue(":order_id", $order_id, SQLITE3_INTEGER);
        $sql->bindValue(":item_id", $id, SQLITE3_INTEGER);
        $sql->bindValue(":quantity", $quantity, SQLITE3_INTEGER);

        $sql->execute();
    }
}

if (empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);
}

if (isset($_POST['name']) && isset($_POST['order'])) {
    $name = $_POST['name'];
    $order = $_POST['order'];

    // Validate everything

    // Check that the name is not above a certain length.
    if (strlen($name) >= 15) {
        finish();
    }

    // See if order IDs and quantities are indeed integers.
    foreach ($order as $id => $quantity) {
        if (!(is_int($id) || is_int($quantity))) {
            finish();
        }
    }

    $db = new SQLite3(DATABASE);

    if (isset($_COOKIE[ORDER_KEY])) {
        $order_key = $_COOKIE[ORDER_KEY]; // Order key if the user has already ordered (looked at checkout once).
        // Get ID from order key.
        $sql = $db->prepare('SELECT id, status FROM orders WHERE order_key = :order_key LIMIT 1');
        $sql->bindValue(":order_key", $order_key, SQLITE3_TEXT);
        $result = $sql->execute();
        $row = $result->fetchArray();

        if (!$row) {
            finish($db);
        }

        $id = $row[0];
        $status = $row[1];

        // Make sure that the order is not locked, approved, or completed.
        if ($status === 0) {
            // Update the user's name.
            $sql = $db->prepare('UPDATE orders SET name = :name WHERE id = :id');
            $sql->bindValue(':name', $name, SQLITE3_TEXT);
            $sql->bindValue(':id', $id, SQLITE3_INTEGER);
            $sql->execute();

            // Completely remove the user's order details so they can be rebuilt.
            $db->query('DELETE FROM order_details WHERE order_id = ' . $id); // This should be fine...right?

            build_order_details($db, $id, $order);
        } else {
            finish($db, $order_key, $order);
        }
    } else {
        // Create the order in the database.
        $order_key = uniqid();

        $sql = $db->prepare('INSERT INTO orders (ip, order_key, name, status) VALUES (:ip, :order_key, :name, :status)');
        $sql->bindValue(":ip", $_SERVER['REMOTE_ADDR'], SQLITE3_TEXT);
        $sql->bindValue(":order_key", $order_key, SQLITE3_TEXT);
        $sql->bindValue(":name", $name, SQLITE3_TEXT);
        $sql->bindValue(":status", 0, SQLITE3_INTEGER);
        $sql->execute();

        $order_id = $db->lastInsertRowId();

        build_order_details($db, $order_id, $order);

        setcookie(ORDER_KEY, $order_key, time() + 3600);
    }

    $success = true;
    finish($db, $order_key, 0);
}

finish();