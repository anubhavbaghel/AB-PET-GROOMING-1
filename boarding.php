<?php 
include 'config/db.php';
include "includes/header.php"; 
?>

<style>
:root{
  --royal-robes:#7158a6;
  --royal-robes-dark:#5b4588;
  --royal-robes-light:#8e79bf;
  --page-bg-1:#f7f1ff;
  --page-bg-2:#fff2f8;
  --text-dark:#2a1443;
  --text-soft:rgba(42,20,67,0.72);
  --white:#ffffff;
  --glass:rgba(255,255,255,0.72);
  --border:rgba(113,88,166,0.12);
  --shadow:0 18px 50px rgba(30,10,60,0.12);
  --radius-xl:28px;
  --radius-lg:22px;
  --radius-md:16px;
}

*{
  box-sizing:border-box;
}

.boarding-page{
  min-height:100vh;
  background:
    radial-gradient(900px 500px at 12% 10%, rgba(113,88,166,0.16), transparent 55%),
    radial-gradient(900px 500px at 88% 12%, rgba(142,121,191,0.14), transparent 55%),
    linear-gradient(180deg, var(--page-bg-1) 0%, var(--page-bg-2) 55%, #ffffff 100%);
  padding:36px 0 80px;
}

.boarding-container{
  width:min(1180px, calc(100% - 40px));
  margin:0 auto;
}

/* ===== TOP HERO ===== */
.boarding-hero{
  border-radius:var(--radius-xl);
  background:linear-gradient(135deg, #7158a6, #b783d3);
  color:#fff;
  padding:40px 34px;
  box-shadow:var(--shadow);
  margin-bottom:26px;
  position:relative;
  overflow:hidden;
}

.boarding-hero::before{
  content:"";
  position:absolute;
  inset:0;
  background:
    radial-gradient(circle at 15% 20%, rgba(255,255,255,0.18), transparent 28%),
    radial-gradient(circle at 80% 30%, rgba(255,255,255,0.12), transparent 30%);
  pointer-events:none;
}

.boarding-hero-content{
  position:relative;
  z-index:1;
  display:grid;
  grid-template-columns:1.15fr 0.85fr;
  gap:26px;
  align-items:center;
}

.boarding-hero h1{
  margin:0 0 12px;
  font-size:clamp(30px, 4vw, 52px);
  font-weight:950;
  line-height:1.05;
  letter-spacing:-0.8px;
}

.boarding-hero p{
  margin:0;
  font-size:16px;
  line-height:1.8;
  max-width:720px;
  font-weight:700;
  color:rgba(255,255,255,0.94);
}

.hero-badges{
  margin-top:18px;
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}

.hero-badge{
  padding:10px 14px;
  border-radius:999px;
  background:rgba(255,255,255,0.18);
  border:1px solid rgba(255,255,255,0.28);
  color:#fff;
  font-size:13px;
  font-weight:900;
  backdrop-filter:blur(8px);
}

.hero-actions{
  margin-top:18px;
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}

.board-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:12px 20px;
  border-radius:999px;
  text-decoration:none;
  font-weight:900;
  transition:0.22s ease;
}

.board-btn:hover{
  transform:translateY(-2px);
}

.board-btn-primary{
  background:#fff;
  color:var(--royal-robes);
  box-shadow:0 12px 24px rgba(0,0,0,0.10);
}

.board-btn-secondary{
  background:rgba(255,255,255,0.16);
  color:#fff;
  border:1px solid rgba(255,255,255,0.28);
}

.hero-note{
  background:rgba(255,255,255,0.12);
  border:1px solid rgba(255,255,255,0.22);
  border-radius:24px;
  padding:22px;
  backdrop-filter:blur(10px);
}

.hero-note h3{
  margin:0 0 8px;
  font-size:22px;
  font-weight:900;
}

.hero-note p{
  margin:0 0 14px;
  font-size:15px;
  line-height:1.7;
}

.hero-note-pills{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}

.hero-note-pills span{
  padding:9px 12px;
  border-radius:999px;
  background:rgba(255,255,255,0.16);
  border:1px solid rgba(255,255,255,0.22);
  font-size:13px;
  font-weight:900;
}

/* ===== BOARDING INFO CARDS ===== */
.boarding-info-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:22px;
  margin-bottom:28px;
}

.info-card{
  background:rgba(255,255,255,0.72);
  border:1px solid rgba(113,88,166,0.12);
  border-radius:var(--radius-xl);
  box-shadow:var(--shadow);
  overflow:hidden;
}

.info-card-top{
  background:linear-gradient(135deg, rgba(113,88,166,0.12), rgba(183,131,211,0.16));
  padding:22px 24px 16px;
  border-bottom:1px solid rgba(113,88,166,0.08);
}

.info-card-tag{
  display:inline-block;
  padding:8px 12px;
  border-radius:999px;
  background:var(--royal-robes);
  color:#fff;
  font-size:12px;
  font-weight:900;
  margin-bottom:12px;
}

.info-card h2{
  margin:0 0 8px;
  font-size:28px;
  font-weight:950;
  color:var(--text-dark);
}

.info-card p{
  margin:0;
  color:var(--text-soft);
  line-height:1.7;
  font-weight:700;
}

.info-card-body{
  padding:22px 24px 24px;
}

.info-section-title{
  margin:0 0 12px;
  font-size:18px;
  font-weight:900;
  color:var(--text-dark);
}

.price-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
  margin-bottom:18px;
}

.price-box{
  background:#fff;
  border:1px solid rgba(113,88,166,0.10);
  border-radius:18px;
  padding:14px;
}

.price-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  padding:10px 0;
  font-size:14px;
  font-weight:800;
  color:#4c3d63;
}

.price-row + .price-row{
  border-top:1px dashed rgba(113,88,166,0.18);
}

.price-row b{
  font-size:18px;
  color:var(--text-dark);
}

.feature-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-bottom:18px;
}

.feature-item{
  background:#fff;
  border:1px solid rgba(113,88,166,0.10);
  border-radius:16px;
  padding:12px 14px;
  font-size:14px;
  font-weight:800;
  color:#4a3a61;
}

.criteria-box{
  background:#fff;
  border:1px solid rgba(113,88,166,0.10);
  border-radius:18px;
  padding:14px;
}

.criteria-box h4{
  margin:0 0 8px;
  font-size:16px;
  font-weight:900;
  color:var(--text-dark);
}

.criteria-box ul{
  margin:0;
  padding-left:18px;
  color:var(--text-soft);
  line-height:1.7;
  font-weight:700;
}

.info-card-actions{
  margin-top:16px;
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}

.soft-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:11px 18px;
  border-radius:999px;
  background:var(--royal-robes);
  color:#fff;
  text-decoration:none;
  font-weight:900;
  box-shadow:0 12px 24px rgba(113,88,166,0.18);
}

.ghost-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:11px 18px;
  border-radius:999px;
  background:#fff;
  color:var(--text-dark);
  text-decoration:none;
  font-weight:900;
  border:1px solid rgba(113,88,166,0.12);
  height:48px;
}

/* ===== FORM + SIDE ===== */
.form-layout{
  display:grid;
  grid-template-columns:1.45fr 0.55fr;
  gap:22px;
  align-items:start;
}

.boarding-form-card,
.boarding-side-card{
  background:rgba(255,255,255,0.72);
  border:1px solid rgba(113,88,166,0.12);
  border-radius:var(--radius-xl);
  box-shadow:var(--shadow);
}

.boarding-form-card{
  overflow:hidden;
}

.form-head{
  padding:24px 26px 12px;
  border-bottom:1px solid rgba(113,88,166,0.08);
  background:linear-gradient(135deg, rgba(113,88,166,0.08), rgba(183,131,211,0.10));
}

.form-head h2{
  margin:0 0 6px;
  font-size:30px;
  font-weight:950;
  color:var(--text-dark);
}

.form-head p{
  margin:0;
  color:var(--text-soft);
  line-height:1.7;
  font-weight:700;
}

.boarding-form{
  padding:22px 26px 26px;
}

.form-block{
  background:#fff;
  border:1px solid rgba(113,88,166,0.10);
  border-radius:22px;
  padding:18px;
  margin-bottom:16px;
}

.form-block h3{
  margin:0 0 14px;
  font-size:17px;
  font-weight:950;
  color:var(--text-dark);
}

.form-row{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:14px;
  margin-bottom:14px;
}

.form-row:last-child{
  margin-bottom:0;
}

.form-field{
  display:flex;
  flex-direction:column;
}

.form-field label{
  margin-bottom:7px;
  font-size:13px;
  font-weight:900;
  color:rgba(42,20,67,0.86);
}

.form-field input,
.form-field select,
.form-field textarea{
  width:100%;
  padding:13px 14px;
  border-radius:14px;
  border:1px solid rgba(113,88,166,0.16);
  outline:none;
  background:#fff;
  color:var(--text-dark);
  font-size:14px;
  font-weight:700;
  transition:0.18s ease;
}

.form-field textarea{
  resize:vertical;
  min-height:110px;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus{
  border-color:rgba(113,88,166,0.34);
  box-shadow:0 0 0 4px rgba(113,88,166,0.08);
}

.form-check{
  display:flex;
  gap:10px;
  align-items:flex-start;
  margin-top:4px;
}

.form-check input{
  margin-top:4px;
  transform:scale(1.08);
}

.form-check label{
  font-size:13px;
  font-weight:800;
  color:rgba(42,20,67,0.82);
  line-height:1.6;
}

.form-note{
  margin-top:10px;
  background:rgba(113,88,166,0.08);
  border:1px solid rgba(113,88,166,0.12);
  border-radius:14px;
  padding:12px 14px;
  font-size:13px;
  font-weight:800;
  color:rgba(42,20,67,0.76);
  line-height:1.6;
}

.form-actions{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:6px;
  align-items:center;
}

.submit-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:13px 22px;
  border:none;
  border-radius:999px;
  background:linear-gradient(135deg, var(--royal-robes), var(--royal-robes-light));
  color:#fff;
  font-weight:900;
  cursor:pointer;
  box-shadow:0 12px 24px rgba(113,88,166,0.18);
}

.form-msg{
  min-height:20px;
  margin-top:10px;
  font-size:13px;
  font-weight:900;
  color:var(--text-dark);
}

/* ===== SIDE CARD ===== */
.boarding-side-card{
  padding:22px;
  position:sticky;
  top:92px;
}

.boarding-side-card h3{
  margin:0 0 10px;
  font-size:24px;
  font-weight:950;
  color:var(--text-dark);
}

.boarding-side-card ul{
  margin:0;
  padding-left:18px;
  color:var(--text-soft);
  line-height:1.9;
  font-weight:800;
}

.side-mini{
  display:grid;
  gap:10px;
  margin-top:16px;
}

.side-mini-box{
  background:#fff;
  border:1px solid rgba(113,88,166,0.10);
  border-radius:18px;
  padding:14px;
}

.side-mini-box strong{
  display:block;
  margin-bottom:4px;
  color:var(--text-dark);
  font-size:14px;
  font-weight:950;
}

.side-mini-box span{
  display:block;
  color:var(--text-soft);
  font-size:13px;
  font-weight:800;
}

/* =========================
   PAYMENT SECTION
========================= */

.payment-method-section{
    margin-top:25px;
}

.payment-title{
    display:block;
    margin-bottom:14px;
    font-size:17px;
    font-weight:700;
    color:#1f1f1f;
}

.payment-options{
    display:flex;
    gap:18px;
}

.payment-card{
    flex:1;
    position:relative;
    cursor:pointer;
}

.payment-card input{
    display:none;
}

.payment-content{
    height:95px;
    border-radius:22px;
    border:2px solid #ececec;
    background:#fff;
    display:flex;
    align-items:center;
    justify-content:center;
    transition:0.25s ease;
}

.payment-content h4{
    font-size:20px;
    font-weight:700;
    color:#1f1f1f;
}

.payment-card input:checked + .payment-content{
    border-color:#7c5cff;
    background:#f7f4ff;
    box-shadow:
    0 10px 25px rgba(124,92,255,0.18);
}



/* =========================
   QR POPUP
========================= */

.qr-popup-overlay{
    position:fixed;
    inset:0;
    background:rgba(10,10,25,0.72);
    backdrop-filter:blur(8px);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:99999;

    opacity:0;
    visibility:hidden;

    transition:0.28s ease;
}

.qr-popup-overlay.active{
    opacity:1;
    visibility:visible;
}

.qr-popup-box{
    position:relative;
    width:340px;

    border-radius:28px;
    overflow:hidden;

    animation:popupAnim 0.28s ease;
}

.qr-popup-image{
    width:100%;
    display:block;
    border-radius:28px;
}



/* CLOSE BUTTON */

.close-qr-btn{
    position:absolute;
    top:10px;
    right:10px;

    width:34px;
    height:34px;

    border:none;
    border-radius:50%;

    background:#fff;
    color:#111;

    font-size:20px;
    font-weight:700;

    cursor:pointer;

    z-index:10;

    box-shadow:
    0 6px 18px rgba(0,0,0,0.15);

    transition:0.2s ease;
}

.close-qr-btn:hover{
    transform:scale(1.08);
}



/* ANIMATION */

@keyframes popupAnim{

    from{
        transform:scale(0.88);
        opacity:0;
    }

    to{
        transform:scale(1);
        opacity:1;
    }

}



/* MOBILE */

@media(max-width:600px){

    .payment-options{
        flex-direction:column;
    }

    .qr-popup-box{
        width:88%;
        max-width:320px;
    }

}

/* ===== RESPONSIVE ===== */
@media (max-width: 980px){
  .boarding-hero-content,
  .boarding-info-grid,
  .form-layout{
    grid-template-columns:1fr;
  }

  .boarding-side-card{
    position:static;
  }
}

@media (max-width: 700px){
  .form-row,
  .price-grid,
  .feature-grid{
    grid-template-columns:1fr;
  }

  .boarding-hero,
  .boarding-form,
  .info-card-body,
  .info-card-top,
  .boarding-side-card{
    padding-left:18px;
    padding-right:18px;
  }

  .boarding-hero{
    padding:28px 18px;
  }
}
</style>

<section class="boarding-page">
  <div class="boarding-container">

    <!-- HERO -->
    <section class="boarding-hero">
      <div class="boarding-hero-content">
        <div>
          <h1>Pet Boarding</h1>
          <p>
            Safe, loving and hygienic boarding for dogs and cats with comfort-first care, personal attention and daily support.
          </p>

          <div class="hero-badges">
            <span class="hero-badge">Comfort First</span>
            <span class="hero-badge">Daily Updates</span>
          </div>

          <div class="hero-actions">
            <a href="#boardingForm" class="board-btn board-btn-primary">Book Boarding</a>
            <a href="https://wa.me/918828719786" target="_blank" class="board-btn board-btn-secondary">WhatsApp Us</a>
          </div>
        </div>

        <div class="hero-note">
          <h3>Quick Note</h3>
          <p>Vaccinated and tick-free pets only. We maintain a calm, clean and caring environment for every pet.</p>
          <div class="hero-note-pills">
          </div>
        </div>
      </div>
    </section>

    <!-- DOG + CAT INFO -->
    <section class="boarding-info-grid">

      <div class="info-card">
        <div class="info-card-top">
          <h2>AB Dog Boarding & Day Care Center</h2>
          <p>Big on love. Big on savings. Choose the plan that fits your routine and your pet’s comfort.</p>
        </div>

        <div class="info-card-body">
          <h3 class="info-section-title">Pricing</h3>
<?php
$dogPricing = mysqli_query($conn,"
    SELECT * FROM pet_boarding
    WHERE type='dog'
    ORDER BY id ASC
");

$dogItems = [];

while($row = mysqli_fetch_assoc($dogPricing)){
    $dogItems[] = $row;
}

$leftItems = [];
$rightItems = [];

foreach($dogItems as $index => $item){

    if($index % 2 == 0){
        $leftItems[] = $item;
    } else {
        $rightItems[] = $item;
    }
}
?>

<div class="price-grid">

    <!-- LEFT BOX -->
    <div class="price-box">

        <?php foreach($leftItems as $dog): ?>

        <div class="price-row">
            <span><?php echo $dog['name']; ?></span>
            <b>₹<?php echo number_format($dog['price'], 0); ?></b>
        </div>

        <?php endforeach; ?>

    </div>

    <!-- RIGHT BOX -->
    <div class="price-box">

        <?php foreach($rightItems as $dog): ?>

        <div class="price-row">
            <span><?php echo $dog['name']; ?></span>
            <b>₹<?php echo number_format($dog['price'], 0); ?></b>
        </div>

        <?php endforeach; ?>

    </div>

</div>

          <h3 class="info-section-title">Included</h3>
          <div class="feature-grid">
            <div class="feature-item">Daily Video Updates</div>
            <div class="feature-item">Freshly Cooked Food</div>
            <div class="feature-item">Custom Feeding</div>
            <div class="feature-item">3 Times Daily Walk</div>
          </div>

          
         <div class="info-card-actions">
            <a href="#boardingForm" class="soft-btn">Book Boarding</a>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-top">
          <h2>AB Cat Boarding Center</h2>
          <p>Calm, cozy and hygienic cat boarding with gentle handling and comfort-first care.</p>
        </div>

        <div class="info-card-body">
          <h3 class="info-section-title">Pricing</h3>

        <div class="price-box" style="margin-bottom:18px;">

<?php
$catPricing = mysqli_query($conn,"
SELECT * FROM pet_boarding
WHERE type='cat'
ORDER BY id ASC
");

while($cat = mysqli_fetch_assoc($catPricing)):
?>

<div class="price-row">
<span><?php echo $cat['name']; ?></span>
<b>₹<?php echo $cat['price']; ?></b>
</div>

<?php endwhile; ?>

</div>

          <h3 class="info-section-title">Included</h3>
          <div class="feature-grid">
            <div class="feature-item">Quiet & Stress-Free Space</div>
            <div class="feature-item">Clean Bedding</div>
            <div class="feature-item">Gentle Handling</div>
            <div class="feature-item">Regular Updates</div>
          </div>

          
          <div class="info-card-actions">
            <a href="#boardingForm" class="soft-btn">Book Boarding</a>
          </div>
        </div>
      </div>

    </section>

    <!-- FORM + SIDE -->
    <section class="form-layout">

      <div class="boarding-form-card">
        <div class="form-head">
          <h2>Book Boarding</h2>
          <p>Fill only the important details below. Our team will confirm your request after checking availability.</p>
        </div>

        <form id="boardingForm" class="boarding-form" method="POST" action="submit_boarding.php">

          <div class="form-block">
            <h3>Owner Details</h3>

            <div class="form-row">
              <div class="form-field">
                <label>Owner Name *</label>
                <input
                  type="text"
                  name="owner_name"
                  id="owner_name"
                  maxlength="30"
                  pattern="[A-Za-z ]{1,30}"
                  placeholder="Enter owner name"
                  required>
              </div>

              <div class="form-field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  maxlength="10"
                  pattern="[0-9]{10}"
                  inputmode="numeric"
                  placeholder="10-digit number"
                  required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label>Email</label>
                <input type="email" name="email" id="email" placeholder="example@gmail.com">
              </div>

              <div class="form-field">
                <label>City / Area</label>
                <input type="text" name="city" id="city" maxlength="30" placeholder="Chembur, Mumbai">
              </div>
            </div>
          </div>

          <div class="form-block">
            <h3>Pet Details</h3>

            <div class="form-row">
              <div class="form-field">
                <label>Pet Name *</label>
                <input
                  type="text"
                  name="pet_name"
                  id="pet_name"
                  maxlength="30"
                  pattern="[A-Za-z ]{1,30}"
                  placeholder="Enter pet name"
                  required>
              </div>

              <div class="form-field">
                <label>Pet Type *</label>
                <select name="pet_type" id="pet_type" required>
                  <option value="">Select Pet Type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>
            </div>

            <div class="form-field">
  <label>Select Plan *</label>
  <select name="plan" id="plan" required>
    <option value="">First select pet type</option>
  </select>
</div>


            <div class="form-row">
              <div class="form-field">
                <label>Breed *</label>
                <input
                  type="text"
                  name="breed"
                  id="breed"
                  maxlength="30"
                  pattern="[A-Za-z ]{1,30}"
                  placeholder="Eg. Shih Tzu / Persian"
                  required>
              </div>

              <div class="form-field">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  min="0"
                  max="30"
                  step="0.5"
                  placeholder="Eg. 2"
                  required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label>Gender *</label>
                <select name="gender" id="gender" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div class="form-field">
                <label>Special Notes</label>
                <textarea name="notes" id="notes" maxlength="150" placeholder="Medicine / allergy / food notes"></textarea>
              </div>
            </div>
          </div>

          <div class="form-block">
            <h3>Boarding Details</h3>

            <div class="form-row">
              <div class="form-field">
                <label>Boarding Type *</label>
                <select name="boarding_type" id="boarding_type" required>
                  <option value="">Select Boarding Type</option>
                  <option value="Day Boarding">Day Boarding</option>
                  <option value="Overnight Boarding">Overnight Boarding</option>
                </select>
              </div>

              <div class="form-field">
                <label>Emergency Contact *</label>
                <input
                  type="tel"
                  name="emergency_contact"
                  id="emergency_contact"
                  maxlength="10"
                  pattern="[0-9]{10}"
                  inputmode="numeric"
                  placeholder="10-digit number"
                  required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label>Check-in Date *</label>
                <input type="date" name="checkin_date" id="checkinDate" required>
              </div>

              <div class="form-field">
                <label>Check-out Date *</label>
                <input type="date" name="checkout_date" id="checkoutDate" required>
              </div>
            </div>

            <div class="form-check">
              <input type="checkbox" id="vaccinated" name="vaccinated_confirm" value="Yes" required>
              <label for="vaccinated">I confirm my pet is vaccinated and tick / parasite-free. *</label>
</div>
</div>

            <!-- PAYMENT SECTION -->

<div class="payment-method-section">

    <label class="payment-title">
        Select Payment Method
    </label>

    <div class="payment-options">

        <!-- CASH -->

        <label class="payment-card">

            <input
                type="radio"
                name="payment_method"
                value="cash"
                checked
            >

            <div class="payment-content">
                <h4>Cash</h4>
            </div>

        </label>


        <!-- ONLINE -->

        <label class="payment-card">

            <input
                type="radio"
                name="payment_method"
                value="online"
                id="onlinePayment"
            >

            <div class="payment-content">
                <h4>Online</h4>
            </div>

        </label>

    </div>

</div>



<!-- QR POPUP -->

<div class="qr-popup-overlay" id="qrPopup">

    <div class="qr-popup-box">

        <button
            type="button"
            class="close-qr-btn"
            id="closeQrBtn"
        >
            ×
        </button>

        <img
            src="assets/images/qr.avif"
            alt="QR Code"
            class="qr-popup-image"
        >

    </div>

</div>

          <div class="form-actions">
    <button type="submit" class="submit-btn">Submit Booking Request</button>
            <a href="https://wa.me/918828719786" target="_blank" class="ghost-btn">WhatsApp Us</a>
          </div>

          <div class="form-msg" id="formMsg"></div>
        </form>
      </div>

      <aside class="boarding-side-card">
        <h3>What happens next?</h3>
        <ul>
          <li>You submit your request</li>
          <li>We call or WhatsApp to confirm the slot</li>
          <li>Final details are checked at check-in</li>
          <li>Your pet stays in a safe and loving environment</li>
        </ul>

      <div class="criteria-box">
            <h4>Basic Boarding Criteria</h4>
            <ul>
              <li>Pet should be vaccinated</li>
              <li>Pet should be tick and parasite-free</li>
            </ul>
          </div>
</aside>


    </section>

  </div>
</section>

<script>
(function(){
  const checkin = document.getElementById("checkinDate");
  const checkout = document.getElementById("checkoutDate");
  const formMsg = document.getElementById("formMsg");

  const ownerName = document.getElementById("owner_name");
  const petName = document.getElementById("pet_name");
  const breed = document.getElementById("breed");
  const phone = document.getElementById("phone");
  const emergencyContact = document.getElementById("emergency_contact");
  const age = document.getElementById("age");
  const petType = document.getElementById("pet_type");
const planSelect = document.getElementById("plan");


  function onlyLetters(value){
    return value.replace(/[^A-Za-z ]/g, '');
  }

  function onlyNumbers(value){
    return value.replace(/[^0-9]/g, '');
  }

  if(ownerName){
    ownerName.addEventListener("input", function(){
      this.value = onlyLetters(this.value).slice(0,30);
    });
  }

  if(petName){
    petName.addEventListener("input", function(){
      this.value = onlyLetters(this.value).slice(0,30);
    });
  }

  if(breed){
    breed.addEventListener("input", function(){
      this.value = onlyLetters(this.value).slice(0,30);
    });
  }

  if(phone){
    phone.addEventListener("input", function(){
      this.value = onlyNumbers(this.value).slice(0,10);
    });
  }

  if(emergencyContact){
    emergencyContact.addEventListener("input", function(){
      this.value = onlyNumbers(this.value).slice(0,10);
    });
  }

  if(age){
    age.addEventListener("input", function(){
      if(parseFloat(this.value) < 0){
        this.value = "";
      }
    });
  }
  const dogPlans = [
  "Day Boarding",
  "24 Hours Boarding",
  "Luxury Room",
  "Playing",
  "Giant Breed",
  "Silver Plan",
  "Gold Plan",
  "Diamond Plan",
  "Platinum Plan",
  "Annual Plan"
];

const catPlans = [
  "Per Day (Without Food)"
];

function updatePlans(type){
  planSelect.innerHTML = "";

  let plans = [];

  if(type === "Dog"){
    plans = dogPlans;
  } else if(type === "Cat"){
    plans = catPlans;
  }

  // default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Plan";
  planSelect.appendChild(defaultOption);

  plans.forEach(plan => {
    const option = document.createElement("option");
    option.value = plan;
    option.textContent = plan;
    planSelect.appendChild(option);
  });
}

// change event
petType.addEventListener("change", function(){
  updatePlans(this.value);
});
function selectPet(type){
  const petType = document.getElementById("pet_type");

  if(petType){
    petType.value = type;
    updatePlans(type); // 🔥 important line
    document.getElementById("boardingForm").scrollIntoView({
      behavior: "smooth"
    });
  }
}

  if(checkin && checkout){
    const today = new Date();
    const pad = (n) => String(n).padStart(2,'0');
    const minDate = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;

    checkin.min = minDate;
    checkout.min = minDate;

    checkin.addEventListener("change", () => {
      if(checkin.value){
        checkout.min = checkin.value;
        if(checkout.value && checkout.value < checkin.value){
          checkout.value = "";
          if(formMsg) formMsg.textContent = "Check-out date cannot be before check-in date.";
        } else {
          if(formMsg) formMsg.textContent = "";
        }
      }
    });

    checkout.addEventListener("change", () => {
      if(checkin.value && checkout.value && checkout.value < checkin.value){
        checkout.value = "";
        if(formMsg) formMsg.textContent = "Check-out date cannot be before check-in date.";
      } else {
        if(formMsg) formMsg.textContent = "";
      }
    });
  }
})();
</script>

<script>
document.addEventListener("DOMContentLoaded", function () {

    const onlinePayment =
    document.getElementById("onlinePayment");

    const qrPopup =
    document.getElementById("qrPopup");

    const closeQrBtn =
    document.getElementById("closeQrBtn");

    if(onlinePayment){

        onlinePayment.addEventListener("click", function () {

            qrPopup.classList.add("active");

        });

    }

    if(closeQrBtn){

        closeQrBtn.addEventListener("click", function () {

            qrPopup.classList.remove("active");

        });

    }

    if(qrPopup){

        qrPopup.addEventListener("click", function (e) {

            if(e.target === qrPopup){

                qrPopup.classList.remove("active");

            }

        });

    }

});
</script>

<?php include "includes/footer.php"; ?>