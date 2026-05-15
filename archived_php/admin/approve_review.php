<?php
include "../config/db.php";

$id = (int)$_GET['id'];

// approve
$conn->query("UPDATE reviews SET status='approved' WHERE id=$id");

// max 10 reviews only
$conn->query("
DELETE FROM reviews 
WHERE status='approved' 
AND id NOT IN (
  SELECT id FROM (
    SELECT id FROM reviews 
    WHERE status='approved' 
    ORDER BY id DESC 
    LIMIT 10
  ) temp
)");

header("Location: reviews.php");
?>