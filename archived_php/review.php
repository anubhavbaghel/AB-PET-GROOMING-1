<!DOCTYPE html>
<html>
<head>
<title>Review</title>
</head>

<body>

<h2>Share Your Experience</h2>

<form action="submit_review.php" method="POST" onsubmit="return validateReview()">

<input type="text" id="rname" name="name" placeholder="Your Name" required><br><br>

<select name="rating" required>
<option value="">Select Rating</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
</select><br><br>

<textarea id="review" name="review" placeholder="Write review" required></textarea><br><br>

<button type="submit">Submit</button>

</form>

<script>
function validateReview() {

let name = document.getElementById("rname").value.trim();
let review = document.getElementById("review").value.trim();

let nameRegex = /^[A-Za-z ]+$/;

if (!nameRegex.test(name) || name.length > 20) {
alert("Name only letters max 20");
return false;
}

if (review.length > 40) {
alert("Review max 40 characters");
return false;
}

return true;
}
</script>

</body>
</html>