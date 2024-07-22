<?php

include "api/all_items.php";
include "settings.php";

define('DATABASE', '../fizz.db'); // CHANGE THIS

$user = $_SERVER['PHP_AUTH_USER'];
$pass = $_SERVER['PHP_AUTH_PW'];

$validated = (in_array($user, $valid_users)) && ($pass == $valid_passwords[$user]);

if (!$validated) {
    header('WWW-Authenticate: Basic realm="My Realm"');
    header('HTTP/1.0 401 Unauthorized');
    die(not_authorised_page); // fake page (lmao)
}

$success = false;

function finish($db = null, $data = null) {
    global $success;

    if ($db) {
        $db->close();
    }

    $response = array(
        "success" => $success
    );

    if (isset($data)) {
        $response["data"] = $data;
    }
    
    $response = json_encode($response);

    header('Content-Type: application/json');
    die($response);
}

function drinks($db, $items) {
    $results = $db->query("SELECT * FROM orders WHERE status = 2 ORDER BY approved_on");

    // Package everything up into an array of associative arrays.
    $drinks = array();

    while ($row = $results->fetchArray()) {
        $drink = array(
            "id" => $row[0],
            "name" => $row[3],
            "approved_on" => $row[5],
            "details" => array()
        );

        // get order details for this order
        $results2 = $db->query("SELECT * FROM order_details WHERE order_id = " . $row[0]);

        while ($row2 = $results2->fetchArray()) {
            $detail = array(
                "item_id" => $row2[1],
                "item_name" => $items[$row2[1]]["name"],
                "quantity" => $row2[2]
            );
            array_push($drink["details"], $detail);
        }

        array_push($drinks, $drink);
    }

    return $drinks;
}

$db = new SQLite3(DATABASE);
$drinks = drinks($db, allItems($db));

// If arrives here, is a valid user.
switch ($_GET["mode"]) {
    case "update": // For page updates
        $success = true;
        finish($db, $drinks);
        break;
    case "complete": // Complete order
        if (!isset($_GET["order_id"])) {
            finish($db);
        }

        $order_id = $_GET["order_id"];

        // Validate order ID.
        if (!(filter_var($order_id, FILTER_VALIDATE_INT, array('options' => array('min_range' => 1))))) {
            finish($db);
        }

        // Check if there actually is something to update.
        $sql = $db->prepare("SELECT COUNT(*) FROM orders WHERE status = 2 AND id = :id LIMIT 1");
        $sql->bindValue(":id", $order_id, SQLITE3_INTEGER);
        $result = $sql->execute();

        if ($result->fetchArray()[0]) { // COUNT(*) returns 1 if there's something, so we can do this here.
            $sql = $db->prepare("UPDATE orders SET status = 3 WHERE id = :id");
            $sql->bindValue(":id", $order_id, SQLITE3_INTEGER);
            $sql->execute();
            $success = true;
        }

        finish($db);
        break;
    default:
        echo $_GET["mode"];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Item View</title>
    <link rel="stylesheet" href="/styles/itemview.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
</head>
<body>
    <div class="grid-container"></div> 
    <script src="/js/itemRender.js"></script>
    <p>Finished showing <span id="itemCount">0</span> item(s).</p>
    <p>This server is running Wynyard <?= VERSION ?>.</p>
    <!-- provide enough spacing so that the bar isn't covering everything -->
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <div class="navigation">
        <a href="/mchistory.php"><button class="historyButton"><img class="clock" src="images/history-clock-button.png">&nbsp;History</button></a>
    </div>
</body>
</html>