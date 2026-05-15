<?php
include "config/db.php";

$date = $_GET['date'];

$q = "SELECT COUNT(*) as total FROM appointments WHERE appointment_date='$date'";
$res = mysqli_query($conn, $q);
$row = mysqli_fetch_assoc($res);

echo $row['total'];
?>