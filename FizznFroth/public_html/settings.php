<?php

define('VERSION', 'v0.11');

// staff authentication page

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
