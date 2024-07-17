<?php
// Probably doesn't work.

define("ORDER_KEY", "order_key");

if (isset($_COOKIE[ORDER_KEY])) {
    unset($_COOKIE[ORDER_KEY]);
    setcookie('key', '', time() - 3600, '/'); // empty value and old timestamp
}