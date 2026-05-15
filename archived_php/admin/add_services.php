<?php include "../config/db.php"; ?>

<?php
if($_POST){
  $title=$_POST['title'];
  $price=$_POST['price'];
  $desc=$_POST['description'];
  $cat=$_POST['category'];

  mysqli_query($conn,"INSERT INTO services (title,price,description,category)
  VALUES ('$title','$price','$desc','$cat')");

  header("Location: services.php");
}
?>

<form method="POST">

<input name="title" placeholder="Service Title" required><br><br>
<input name="price" placeholder="Price"><br><br>

<select name="category">
<option value="Grooming">Grooming</option>
<option value="Boarding">Boarding</option>
</select><br><br>

<textarea name="description" placeholder="Description"></textarea><br><br>

<button>Add Service</button>

</form>