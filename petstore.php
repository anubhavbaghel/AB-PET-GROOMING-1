<?php include 'includes/header.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pet Store</title>

<style>

/* ===== BODY ===== */
body{
  margin:0;
  font-family:'Poppins', sans-serif;
  background: linear-gradient(180deg, #f7f2fc, #ffffff);
}

/* ===== CONTAINER ===== */
.container{
  width:90%;
  max-width:1200px;
  margin:auto;
}

/* ===== TITLE ===== */
.storeTitle{
  text-align:center;
  font-size:42px;
  font-weight:900;
  color:#2a1443;
  margin-top:60px;
}

.storeSub{
  text-align:center;
  margin-bottom:40px;
  color:#6b5c84;
}

/* ===== GRID (4 IN ONE LINE) ===== */
.petGrid{
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap:25px;
  margin-bottom:50px;
}

/* RESPONSIVE */
@media(max-width:1000px){
  .petGrid{
    grid-template-columns: repeat(2,1fr);
  }
}

@media(max-width:600px){
  .petGrid{
    grid-template-columns: 1fr;
  }
}

/* ===== CARD ===== */
.petCard{
  background:#fff;
  border-radius:20px;
  overflow:hidden;
  box-shadow:0 15px 40px rgba(0,0,0,0.1);
  transition:0.3s ease;
  text-align:center;
}

.petCard:hover{
  transform:translateY(-10px);
}

/* IMAGE */
.petCard img{
  width:100%;
  height:200px;
  object-fit:cover;
}

/* INFO */
.petInfo{
  padding:15px;
}

.petInfo h3{
  margin:10px 0;
  color:#7158a6;
}

/* ===== CONTACT SECTION ===== */
.petContact{
  text-align:center;
  margin: 40px 0 80px;
}

.contactText{
  font-size:20px;
  font-weight:600;
  color:#2a1443;
  margin-bottom:20px;
}

/* BUTTONS CENTER */
.contactBtns{
  display:flex;
  justify-content:center;
  gap:20px;
}

/* WHATSAPP */
.whatsappBtn{
  background:#25D366;
  color:#fff;
  padding:14px 26px;
  border-radius:30px;
  text-decoration:none;
  font-weight:700;
  transition:0.3s;
}

/* CALL */
.callBtn{
  background:#7158a6;
  color:#fff;
  padding:14px 26px;
  border-radius:30px;
  text-decoration:none;
  font-weight:700;
  transition:0.3s;
}

.whatsappBtn:hover,
.callBtn:hover{
  transform:translateY(-3px);
}

</style>
</head>

<body>

<div class="container">

  <h2 class="storeTitle">Our Pets</h2>
  <p class="storeSub">Healthy, happy and adorable companions waiting for a loving home.</p>

  <!-- PET GRID -->
  <div class="petGrid">

    <div class="petCard">
      <img src="assets/images/pets/pet2.avif">
      <div class="petInfo">
        <h3>Puppies</h3>
      </div>
    </div>

    <div class="petCard">
      <img src="assets/images/pets/pet1.avif">
      <div class="petInfo">
        <h3>Kittens</h3>
      </div>
    </div>

    <div class="petCard">
      <img src="assets/images/pets/pet6.avif">
      <div class="petInfo">
        <h3>Birds</h3>
      </div>
    </div>

    <div class="petCard">
      <img src="assets/images/pets/pet7.avif">
      <div class="petInfo">
        <h3>Fish</h3>
      </div>
    </div>

  </div>

  <!-- CONTACT SECTION -->
  <div class="petContact">
    <p class="contactText">
      Are you interested to adopt a pet?
    </p>

    <div class="contactBtns">
      <a href="https://wa.me/8828719786" target="_blank" class="whatsappBtn">
        Chat on WhatsApp
      </a>

      <a href="tel:+918828719786" class="callBtn">
        Call Now
      </a>
    </div>
  </div>

</div>
<?php include "includes/footer.php"; ?>
</body>
</html>