<?php
include('connection.php');
$searchName = $_GET['name'];

$query = "SELECT ST_X(geom) AS longitude, ST_Y(geom) AS latitude, name FROM bus_point WHERE name LIKE '%$searchName%'";

$result = pg_query($conn, $query);

if (!$result) {
    echo json_encode(['error' => 'Lỗi khi tìm kiếm']);
    exit();
}

$results = [];
while ($row = pg_fetch_assoc($result)) {
    $results[] = $row;
}
echo json_encode($results);
