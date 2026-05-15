<?php
include "../config/db.php";

$id=$_GET['id'];

mysqli_query($conn,"DELETE FROM services WHERE id=$id");

header("Location: services.php");
?>