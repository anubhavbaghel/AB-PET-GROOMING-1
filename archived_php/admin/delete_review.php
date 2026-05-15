<?php
include "../config/db.php";

$id = (int)$_GET['id'];

$conn->query("DELETE FROM reviews WHERE id=$id");

header("Location: reviews.php");
?>