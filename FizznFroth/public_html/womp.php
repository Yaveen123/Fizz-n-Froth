<?php
include 'api/all_items.php';
include 'settings.php';

const DATABASE = '../fizz.db';

$user = $_SERVER['PHP_AUTH_USER'];
$pass = $_SERVER['PHP_AUTH_PW'];

$validated = (in_array($user, $valid_users)) && ($pass == $valid_passwords[$user]);

if (!$validated) {
  header('WWW-Authenticate: Basic realm="My Realm"');
  header('HTTP/1.0 401 Unauthorized');
  die(not_authorised_page);
}

$db = new SQLite3(DATABASE);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $db->query('UPDATE items SET womped_womped = 0');

    foreach ($_POST as $id => $sold_out) {
        $sold_out = $sold_out == 'on';

        $sql = $db->prepare('UPDATE items SET womped_womped = :sold_out WHERE id = :id');
        $sql->bindValue('sold_out', $sold_out, SQLITE3_INTEGER);
        $sql->bindValue('id', $id, SQLITE3_INTEGER);
        $sql->execute();
    }

    echo '<h1 style="background-color: yellow;">Successfully updated!</h1>';
}

$items = allItems($db);

$db->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Item Status</title>
</head>
<body>
    <p><b>Mark items as sold out here.</b></p>
    <form action="womp.php" method="post">
        <table border="1" style="text-align: center;">
            <tr>
                <th width="100">Sold Out</th>
                <th width="100">Name</th>
                <th width="100">Price</th>
            </tr>
            <?php foreach ($items as $item): ?>
                <tr>
                    <td><input type="checkbox" name="<?= $item['id'] ?>" id="<?= $item['id'] ?>"<?php if ($item['womped_womped']): ?> checked<?php endif; ?>></td>
                    <td><?= $item['name'] ?></td>
                    <td>$<?= $item['price'] ?></td>
                </tr>   
            <?php endforeach; ?>
        </table>
        <br>
        <input type="submit" value="Update">
    </form>
</body>
</html>