<?php

define('DATABASE', '../../fizz.db');

$success = false;

function finish($db = null, $status = null, $order_id = null) {
    global $success;

    if ($db) {
        $db->close();
    }

    $result = array(
        "success" => $success,
    );

    if (isset($status)) {
        $result["status"] = $status;
    }

    if (isset($order_id)) {
        $result["order_id"] = $order_id;
    }

    header('Content-Type: application/json');
    die(json_encode($result));
}

$order_key = filter_input(INPUT_GET, "order_key", FILTER_SANITIZE_SPECIAL_CHARS);

if (!empty($order_key)) {
    $db = new SQLite3(DATABASE);

    $sql = $db->prepare('SELECT status, id FROM orders WHERE order_key = :order_key LIMIT 1');
    $sql->bindValue(':order_key', $order_key, SQLITE3_TEXT);
    $result = $sql->execute();
    $row = $result->fetchArray();

    if ($row) {
        $status = $row[0];
        $id = $row[1];

        $success = true;

        if ($status === 2) {
            finish($db, $status, $id);
        }

        finish($db, $status);
    }

    finish($db);
}

finish();