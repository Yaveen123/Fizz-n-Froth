<?php
include "./all_items.php";

define('DATABASE', '../../fizz.db'); // CHANGE THIS

$db = new SQLite3(DATABASE);
$items = allItems($db);
$db->close();

header('Content-Type: application/json');

echo json_encode($items);