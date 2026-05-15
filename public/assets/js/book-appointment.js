document.addEventListener("DOMContentLoaded", function () {
  const petRadios = document.querySelectorAll('input[name="pet_category"]');
  const serviceSelect = document.getElementById("main_service");
  const sizeSelect = document.getElementById("pet_size");

  const dogServices = [
    "Dog Essential Package",
    "Dog Classic Package",
    "Dog Ab's Special Package",
    "Dog Haircut Only",
    "Dog Puppy Bath & Blow Dry",
    "Dog Puppy Full Basic Puppy Package",
    "Dog Puppy Hair Cut"
  ];

  const catServices = [
    "Cat Essentials Package",
    "Cat Classic Package",
    "Cat Ab's Special Package",
    "Cat Haircut Only"
  ];

  const dogSizes = ["Small", "Large", "Giant", "Puppy"];
  const catSizes = ["Adult Cat", "Kitten"];

  function fillSelect(select, values, firstText) {
    select.innerHTML = "";

    const firstOption = document.createElement("option");
    firstOption.value = "";
    firstOption.textContent = firstText;
    select.appendChild(firstOption);

    values.forEach(function (item) {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      select.appendChild(option);
    });
  }

  function updateFields(type) {
    if (type === "Dog") {
      fillSelect(serviceSelect, dogServices, "Select a dog service");
      fillSelect(sizeSelect, dogSizes, "Select dog size/type");
    } else if (type === "Cat") {
      fillSelect(serviceSelect, catServices, "Select a cat service");
      fillSelect(sizeSelect, catSizes, "Select cat size/type");
    }
  }

  petRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      updateFields(this.value);
    });
  });
});
// ===== AUTO PET TYPE BASED ON SERVICE =====
window.addEventListener("load", function () {
  const serviceInput = document.querySelector("[name='main_service']");

  if (serviceInput) {
    const service = serviceInput.value;

    if (service.includes("Dog")) {
      document.querySelector("input[value='Dog']").checked = true;
    }

    if (service.includes("Cat")) {
      document.querySelector("input[value='Cat']").checked = true;
    }
  }
});


// ===== INPUT RESTRICTIONS =====
function onlyLetters(input, max) {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-z ]/g, '').slice(0, max);
  });
}

function onlyNumbers(input, max) {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, max);
  });
}

// APPLY
onlyLetters(document.querySelector("[name='owner_name']"), 15);
onlyLetters(document.querySelector("[name='pet_name']"), 15);
onlyLetters(document.querySelector("[name='breed']"), 20);

onlyNumbers(document.querySelector("[name='phone']"), 10);


// ===== DATE VALIDATION =====
const dateInput = document.querySelector("[name='appointment_date']");
if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);
}


// ===== TIME VALIDATION =====
const timeInput = document.querySelector("[name='appointment_time']");
if (timeInput) {
  timeInput.addEventListener("change", function () {
    if (this.value < "10:00" || this.value > "19:00") {
      alert("Select time between 10:30 AM to 7:00 PM");
      this.value = "";
    }
  });
}


// ===== WORD LIMIT =====
function wordLimit(input, maxWords) {
  input.addEventListener("input", function () {
    let words = this.value.trim().split(/\s+/);
    if (words.length > maxWords) {
      this.value = words.slice(0, maxWords).join(" ");
    }
  });
}

wordLimit(document.querySelector("[name='multi_pet_note']"), 40);
wordLimit(document.querySelector("[name='notes']"), 40);


// ===== FINAL FORM VALIDATION =====
document.querySelector("form").addEventListener("submit", function (e) {

  const owner = document.querySelector("[name='owner_name']").value.trim();
  const email = document.querySelector("[name='email']").value.trim();
  const phone = document.querySelector("[name='phone']").value.trim();
  const pet = document.querySelector("[name='pet_name']").value.trim();
  const breed = document.querySelector("[name='breed']").value.trim();

  if (!/^[A-Za-z ]{1,15}$/.test(owner)) {
    alert("Owner name only letters max 15");
    e.preventDefault(); return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Invalid email");
    e.preventDefault(); return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Phone must be 10 digits");
    e.preventDefault(); return;
  }

  if (!/^[A-Za-z ]{1,15}$/.test(pet)) {
    alert("Pet name only letters max 15");
    e.preventDefault(); return;
  }

  if (breed && !/^[A-Za-z ]+$/.test(breed)) {
    alert("Breed only letters");
    e.preventDefault(); return;
  }

});


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




