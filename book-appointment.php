<?php include "includes/header.php"; ?>
<link rel="stylesheet" href="assets/css/book-appointment.css">

<section class="appt-hero">
  <div class="container">
    <h1>Book an Appointment</h1>
    <p>
      Schedule a grooming session for your beloved pet. Fill out the form below and we will confirm your appointment.
    </p>
  </div>
</section>

<section class="appt-section">
  <div class="container">
    <div class="appt-grid">

      <div class="appt-form-card">
        <div class="appt-card-title">Booking Details</div>

        <?php if(isset($_GET['success'])): ?>
          <div class="appt-msg success">Appointment request submitted successfully.</div>
        <?php endif; ?>

        <?php if(isset($_GET['full'])): ?>
          <div class="appt-msg error">Sorry, this date already has 10 appointments. Please choose another date.</div>
        <?php endif; ?>

        <?php if(isset($_GET['error'])): ?>
          <div class="appt-msg error">Something went wrong. Please try again.</div>
        <?php endif; ?>

        <form action="submit-appointment.php" method="POST" class="appt-form">

          <h2>Owner Information</h2>

          <div class="form-group">
            <label>Owner Name *</label>
            <input type="text" name="owner_name" placeholder="Owner full name" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email *</label>
              <input type="email" name="email" placeholder="your@email.com" required>
            </div>

            <div class="form-group">
              <label>Phone Number *</label>
              <input type="text" name="phone" placeholder="+91 98765 43210" required>
            </div>
          </div>

          <h2>Pet Information</h2>

          <div class="form-group">
            <label>Pet Name *</label>
            <input type="text" name="pet_name" placeholder="Pet name" required>
          </div>

          <div class="form-group">
            <label>Pet Category *</label>

            <div class="pet-type-pills">
              <label class="pet-pill">
                <input type="radio" name="pet_category" value="Dog" required>
                <span>Dog</span>
              </label>

              <label class="pet-pill">
                <input type="radio" name="pet_category" value="Cat" required>
                <span>Cat</span>
              </label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Breed</label>
              <input type="text" name="breed" placeholder="Pet breed">
            </div>

            <div class="form-group">
              <label>Pet Size / Type *</label>
              <select name="pet_size" id="pet_size" required>
                <option value="">First select Dog or Cat</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Number of Pets *</label>
              <select name="pet_count" required>
                <option value="">Select</option>
                <option value="1">1 Pet</option>
                <option value="2">2 Pets</option>
                <option value="3">3 Pets</option>
                <option value="4">4 Pets</option>
                <option value="5">5 Pets</option>
              </select>
            </div>

            <div class="form-group">
              <label>Special Note About Multiple Pets</label>
              <input type="text" name="multi_pet_note" placeholder="Same breed / different pets / siblings etc.">
            </div>
          </div>

          <h2>Service & Date</h2>

          <div class="form-group">
            <label>Main Service *</label>
            <select name="main_service" id="main_service" required>
              <option value="">First select Dog or Cat</option>
            </select>
          </div>

          <div class="form-group">
            <label>Add-On Services</label>
            <div class="checkbox-grid">
              <label><input type="checkbox" name="addons[]" value="Ear Cleaning"> Ear Cleaning</label>
              <label><input type="checkbox" name="addons[]" value="Nail Clipping & Grinding"> Nail Clipping & Grinding</label>
              <label><input type="checkbox" name="addons[]" value="Sanitary Trimming"> Sanitary Trimming</label>
              <label><input type="checkbox" name="addons[]" value="Teeth Brushing"> Teeth Brushing</label>
              <label><input type="checkbox" name="addons[]" value="Face Trimming"> Face Trimming</label>
              <label><input type="checkbox" name="addons[]" value="Medicated Bath"> Medicated Bath</label>
              <label><input type="checkbox" name="addons[]" value="Deshedding"> Deshedding</label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Preferred Date *</label>
              <input type="date" name="appointment_date" required>
            </div>

            <div class="form-group">
              <label>Preferred Time *</label>
              <input type="time" name="appointment_time" min="10:30" max="19:00" step="1800" required>
            </div>
          </div>

          <div class="form-group">
            <label>Additional Notes</label>
            <textarea name="notes" rows="5" placeholder="Any special requests or concerns about your pet..."></textarea>
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


          <button type="submit" class="appt-btn">Book Appointment</button>
        </form>
      </div>

      <div class="appt-sidebar">
        <div class="side-card lavender">
          <h3>Booking Info</h3>
          <p><strong>Operating Hours</strong><br>Monday - Saturday<br>10:30 AM - 7:00 PM</p>
          <p><strong>Daily Slot Limit</strong><br>Maximum 10 appointments per day</p>
        </div>

        <div class="side-card pink">
          <h3>Service Duration</h3>
          <p>Full Bath & Groom: 1.5 - 2 hours</p>
          <p>Haircut & Styling: 1 - 1.5 hours</p>
          <p>Nail Trimming: 15 - 30 minutes</p>
          <p>Ear Cleaning: 15 - 20 minutes</p>
          <p>De-shedding: 1 - 1.5 hours</p>
          <p>Puppy Grooming: 1 hour</p>
        </div>

        <div class="side-card white">
          <h3>Cancellation Policy</h3>
          <p>We require 24 hours notice for cancellations. Cancellations made within 24 hours may incur a cancellation fee.</p>
        </div>
      </div>

    </div>
  </div>
</section>

<section class="appt-faq">
  <div class="container">
    <h2>Appointment FAQs</h2>

    <div class="faq-grid">
      <div class="faq-item">
        <h4>How will I be notified about my appointment?</h4>
        <p>We will contact you on your phone number or email after checking availability.</p>
      </div>

      <div class="faq-item">
        <h4>Can I reschedule my appointment?</h4>
        <p>Yes, you can reschedule with 24 hours notice. Contact us directly for changes.</p>
      </div>

      <div class="faq-item">
        <h4>Can I book for more than one pet?</h4>
        <p>Yes, you can select the number of pets in the form and mention details in the notes.</p>
      </div>

      <div class="faq-item">
        <h4>Can I add extra services?</h4>
        <p>Yes, add-on services like ear cleaning, nail clipping, sanitary trim and others can be selected.</p>
      </div>
    </div>
  </div>
</section>


<script src="assets/js/book-appointment.js"></script>
<?php include "includes/footer.php"; ?>
