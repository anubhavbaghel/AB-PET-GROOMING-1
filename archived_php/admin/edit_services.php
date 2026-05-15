<?php include "../config/db.php";

$id=$_GET['id'];
$data=mysqli_fetch_assoc(mysqli_query($conn,"SELECT * FROM services WHERE id=$id"));

if($_POST){
  $title=$_POST['title'];
  $price=$_POST['price'];
  $desc=$_POST['description'];
  $cat=$_POST['category'];

  mysqli_query($conn,"UPDATE services SET 
  title='$title',
  price='$price',
  description='$desc',
  category='$cat'
  WHERE id=$id");

  header("Location: services.php");
}
?>

<form method="POST">

<input name="title" value="<?= $data['title'] ?>"><br><br>
<input name="price" value="<?= $data['price'] ?>"><br><br>

<select name="category">
<option <?= $data['category']=="Grooming"?"selected":"" ?>>Grooming</option>
<option <?= $data['category']=="Boarding"?"selected":"" ?>>Boarding</option>
</select><br><br>

<textarea name="description"><?= $data['description'] ?></textarea><br><br>

<button>Update</button>

</form>