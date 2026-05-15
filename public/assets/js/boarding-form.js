(function(){
  const checkin = document.getElementById("checkinDate");
  const checkout = document.getElementById("checkoutDate");
  const formMsg = document.getElementById("formMsg");
  const tabs = document.querySelectorAll(".boarding-tab");
  const forms = document.querySelectorAll(".boarding-form-wrap");


  if(!checkin || !checkout) return;

  const today = new Date();
  const pad = (n) => String(n).padStart(2,'0');
  const y = today.getFullYear();
  const m = pad(today.getMonth() + 1);
  const d = pad(today.getDate());
  const minDate = `${y}-${m}-${d}`;

  checkin.min = minDate;
  checkout.min = minDate;

  checkin.addEventListener("change", () => {
    if(checkin.value){
      checkout.min = checkin.value;
      if(checkout.value && checkout.value < checkin.value){
        checkout.value = "";
        if(formMsg) formMsg.textContent = "Checkout date cannot be before check-in date.";
      } else {
        if(formMsg) formMsg.textContent = "";
      }
    }
  });

  checkout.addEventListener("change", () => {
    if(checkin.value && checkout.value && checkout.value < checkin.value){
      checkout.value = "";
      if(formMsg) formMsg.textContent = "Checkout date cannot be before check-in date.";
    } else {
      if(formMsg) formMsg.textContent = "";
    }
  });
})();

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    forms.forEach(f => f.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
  <script src="assets/js/boarding-form.js"></script>
});

