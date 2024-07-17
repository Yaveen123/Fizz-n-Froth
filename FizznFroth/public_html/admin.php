<?php
include "api/all_items.php";

define('DATABASE', '../fizz.db'); // CHANGE THIS

$valid_passwords = array ("admin" => "fizz2024");
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

const default_page = <<<END
    <html>
    <head>
       <title>Logged in</title>
    </head>
    <body>
        You've logged in successfully!
        <br>
        You can now scan QR codes with your camera app.
        <br>
        <h3>Need to enter an order code?</h3>
        <form action="/admin.php" method="get">
            <label>Enter order code: </label>
            <input type="text" name="order_key" placeholder="Order code" minlength="13" maxlength="13">
            <input type="submit" value="go">
        </form>
        <h3>Drink View</h3>
        <a href="/mcdonalds.php">Go to Drink View</a>
    </body>
    </html>
END;

function setOrderMode($db, $id, $status) {
    $db->query("UPDATE orders SET status = " . $status . " WHERE id = " . $id);
}

$user = $_SERVER['PHP_AUTH_USER'];
$pass = $_SERVER['PHP_AUTH_PW'];

$validated = (in_array($user, $valid_users)) && ($pass == $valid_passwords[$user]);

if (!$validated) {
  header('WWW-Authenticate: Basic realm="My Realm"');
  header('HTTP/1.0 401 Unauthorized');
  die(not_authorised_page); // fake page (lmao)
}

$order_key = filter_input(INPUT_GET, "order_key", FILTER_SANITIZE_SPECIAL_CHARS);

if (!isset($order_key)) {
    $order_key = filter_input(INPUT_POST, "order_key", FILTER_SANITIZE_SPECIAL_CHARS);
}

if (!isset($order_key)) {
    die(default_page);
}

if (strlen($order_key) === 13) {
    $db = new SQLite3(DATABASE);

    $sql = $db->prepare('SELECT * FROM orders WHERE order_key = :order_key LIMIT 1');
    $sql->bindValue(":order_key", $order_key, SQLITE3_TEXT);
    $result = $sql->execute();
    $row = $result->fetchArray();

    if (!empty($row)) {
        $id = $row[0];
        $order_key = $row[1];
        $ip = $row[2];
        $name = $row[3];
        $status = $row[4];

        if ($status === 2) {
            $db->close();
            die("Order was already approved!");
        }

        if (isset($_POST["unlock"])) {
            setOrderMode($db, $id, 0);
            $db->close();
            die("Unlocked order. (tell the customer to refresh the page)");
        } elseif (isset($_POST["approve"])) {
            $db->query("UPDATE orders SET approved_on = " . time() . " WHERE id = " . $id);
            setOrderMode($db, $id, 2);
            $db->close();
            die("Order approved. You should see the order pop up on the staff display soon.<br>Feel free to close this tab.");
        } else {
            // Lock the order so changes cannot be made during the approval process.
            setOrderMode($db, $id, 1);

            $order_details = $db->query("SELECT * FROM order_details WHERE order_id = " . $id);

            $items = allItems($db);
            $total = 0;
        }
    } else {
        echo "Couldn't find the order.<br><br>";
        echo "If you got here by scanning a QR code, ask the customer to refresh the page and scan the code again. <br>";
        echo "If you typed in the order code, press the back button on your web browser and try typing it again. Make sure you type it in correctly. <br><br>";
        echo "DM me on Discord if you need support.";
        $db->close();
        die;
    }
} else {
    die("Invalid order key format.");
}
?>
<!DOCTYPE html>
<html lang="en-US">

<head>
    <!--Stuff that you should include in every html page-->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width-device-width, initial-scale=1" />

    <!--Font-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lexend+Mega&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">

    <!--heading and style sheet reference-->
    <title>STAFF VIEW</title>
    <link href="styles/orderstyle.css" rel="stylesheet" />
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">

    <style>
        body, .header {
            background-color: #B5D2AD;
        }

        .header {
            font-family: "Lexend";
            text-align: center;
        }

        .order1_details {
            font-family: "Lexend";
            text-align: left;
        }

        .order1container {
            max-width: 500px;
            margin: auto;
        }
    </style>
</head>



<body>
    <div class="header">
        <!-- Stuff here -->
    </div>

    <div class="order1container">
        <p class="order1_header">STAFF VIEW</p>
        <p class="order1_details">
            Order number: <b><?= $id ?></b><br>
            Name: <b><?= htmlspecialchars($name) ?></b><br>
            User IP: <b><?= $ip ?></b><br>
        </p>
        <div class="order1_list">
            <?php while ($row = $order_details->fetchArray()): ?>
                <div class="order1_list_itemqty">
                    <table>
                        <tr>
                            <td>
                                <div class="order1_name"><?= $items[$row[1]]["name"] ?></div>
                                <div class="order1_quantity">Qty: <?= $row[2] ?></div>
                            </td>
                            <td>
                                <div class="order1_price">
                                    $<?php
                                        $price = $row[2] * $items[$row[1]]["price"]; 
                                        $total += $price;
                                        echo $price;
                                    ?>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endwhile; ?>
            <div class="order1_list_total">
                <table>
                    <tr>
                        <td>
                            <div class="order1_total">Total</div>
                        </td>
                        <td>
                            <div class="order1_total_price">$<?= $total ?></div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <br>
        <!-- These forms have to be separated here to make it work on Samsung Internet. Thank you, Samsung!!! <3 -->
        <form action="/admin.php" method="post">
            <input type="hidden" name="order_key" value="<?= $order_key ?>">
            <input type="submit" name="approve" value="Approve order">
        </form>
        <br>
        <br>
        <form action="/admin.php" method="post">
            <input type="hidden" name="order_key" value="<?= $order_key ?>">
            <input type="submit" name="unlock" value="Unlock order">
        </form>
    </div>

</body>
</html>
<?php
    $db->close();
?>