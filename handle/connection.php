<?php
define('PG_DB', "DB_Bus");
define('PG_HOST', "localhost");
define('PG_USER', "postgres");
define('PG_PORT', "5432");
define('PG_PASS', "huyphan2002");

#extension = pgsql
#bat config trong apache php.ini

$conn = pg_connect("dbname=" . PG_DB . " password=" . PG_PASS . " host=" . PG_HOST . " user=" . PG_USER . " port=" . PG_PORT);

if (!$conn) {
    echo "conectj xit";
}

//var_dump($conn)
// $conn = pg_connect("dbname = password= host= port =)