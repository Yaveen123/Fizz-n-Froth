<?php

include "api/all_items.php";

define('DATABASE', '../fizz.db');
define('ORDER_STATUS', 3);

$valid_passwords = array("admin" => "fizz2024");
$valid_users = array_keys($valid_passwords);

const not_authorised_page = <<<END
<html>
<head><title>401 Authorization Required</title></head>
<body bgcolor="white">
<center><h1>401 Authorization Required</h1></center>
<hr><center>nginx</center>
</body>
</html>
END;

$user = $_SERVER['PHP_AUTH_USER'];
$pass = $_SERVER['PHP_AUTH_PW'];

$validated = (in_array($user, $valid_users)) && ($pass == $valid_passwords[$user]);

if (!$validated) {
    header('WWW-Authenticate: Basic realm="My Realm"');
    header('HTTP/1.0 401 Unauthorized');
    die(not_authorised_page); // fake page (lmao)
}

function drinks($db, $items) {
    $results = $db->query("SELECT * FROM orders WHERE status = " . ORDER_STATUS);

    // Package everything up into an array of associative arrays.
    $drinks = array();

    while ($row = $results->fetchArray()) {
        $drink = array(
            "id" => $row[0],
            "name" => $row[3],
            "approved_on" => $row[5],
            "total" => 0,
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

            $drink["total"] += $items[$row2[1]]["price"] * $row2[2];

            array_push($drink["details"], $detail);
        }

        array_push($drinks, $drink);
    }

    return $drinks;
}

$db = new SQLite3(DATABASE);

$orders = drinks($db, allItems($db));

// If an order ID exists, validate it.
if (isset($_GET["order_id"]) && !(filter_var($_GET["order_id"], FILTER_VALIDATE_INT, array('options' => array('min_range' => 1))))) {
    die("Provide a valid order ID.");
}

switch ($_GET["mode"]) {
    case "undo":
        $db->query("UPDATE orders SET status = 2 WHERE id = " . $_GET["order_id"]);
        die("Order unmarked as completed! You can now find it on the Item View page.<br><br><a href='/mcdonalds.php'>Back to Item View</a>");
        break;
    case "delete":
        $db->query("DELETE FROM orders WHERE id = " . $_GET["order_id"]);
        die("Order deleted.<br><br><a href='/mcdonalds.php'>Back to Item View</a><br><br><a href='/mchistory.php'>Back to History</a>");
        break;
}

$db->close();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order History</title>
    <link rel="stylesheet" href="/styles/historystyle.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <script src="js/history.js"></script>
</head>
<body>
    <div class="container">
        <?php foreach ($orders as $order): ?>
            <div class="order">
                <div class="orderID"><?= $order["id"] ?></div>
                <div class="name"><?= htmlspecialchars($order["name"]) ?></div>
                <div class="separator"></div>
                <div class="details">
                    <?php for ($i = 0; $i < count($order["details"]); $i++): ?>
                        <b><?= $order["details"][$i]["quantity"] ?>x</b>&nbsp;<?= $order["details"][$i]["item_name"] ?><?php if ($i !== count($order["details"]) - 1): ?>,&nbsp;<?php endif; ?>
                    <?php endfor; ?>
                </div>
                <div class="price">$<?= $order["total"] ?></div>
                <div class="actionButtons">
                    <button onclick="undo(<?= $order["id"] ?>);" class="undo">Undo</button>
                    <button onclick="del(<?= $order["id"] ?>);" class="delete">Delete</button>
                </div>
            </div>
        <?php endforeach; ?>
        <p>Finished showing <?= count($orders) ?> item(s).</p>
    </div>
</body>
</html>