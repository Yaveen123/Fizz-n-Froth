<?php
    $order_key = filter_input(INPUT_GET, "order_key", FILTER_SANITIZE_SPECIAL_CHARS);

    if (strlen($order_key) !== 13) {
        $order_key = null;
    }
?>

<!DOCTYPE html>
<html lang="en-US">

<head>
    <!--Stuff that you should include in every html page-->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!--Font-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lexend+Mega&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">

    <!--heading and style sheet reference-->
    <title>Fizz&Froth - Checkout</title>
    <link href="styles/orderstyle.css" rel="stylesheet" />
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    <?php if ($order_key): ?>
        <script>
            var order_key = "<?= $order_key ?>";
        </script>
    <?php endif; ?>
</head>



<body style="background-color: #B5D2AD;">
    <div class="header">   
    </div>

    <div class="banner">
        <p class="p_banner_repeat">HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 HERITAGE DAY 2024 </p>
    </div>


    <div class="order1container">
        <p class="order1_header">PROCESSING...</p>
        <div class="order1container2">
            <p class="instruction">
                Your order is being processed!
                <br>
                <br>
                Please do not close this page, refresh or use the back button.
            </p>
        </div>
    </div>

    <script type="text/javascript" src="js/order4.js"></script>
</body>



</html>