<?php

use chillerlan\QRCode\{QRCode, QROptions};

require_once __DIR__ . '/qr/vendor/autoload.php';

$order_key = $_GET['order_key'];

if (!empty($order_key) && filter_var($order_key, FILTER_SANITIZE_SPECIAL_CHARS)) {
    $data   = "http://{$_SERVER['HTTP_HOST']}/admin.php?order_key={$order_key}";

    $qrcode = (new QRCode)->render($data);

    // default output is a base64 encoded data URI
    echo $qrcode;
}
