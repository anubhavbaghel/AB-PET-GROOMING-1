// main.js
(function () {
  const heroBg = document.getElementById("heroBg");
  const blob1 = document.getElementById("blob1");
  const blob2 = document.getElementById("blob2");
  const blob3 = document.getElementById("blob3");

  const heroImage = document.getElementById("heroImage");
  const heroBig = document.getElementById("heroBig");
  const heroSub = document.getElementById("heroSub");
  const heroDesc = document.getElementById("heroDesc");

  const navBookBtn = document.getElementById("navBookBtn");
  const heroBookBtn = document.getElementById("heroBookBtn");

  if (!heroBg || !heroImage) return;

  const slides = [
    {
      big: "pawsome",
      sub: "place for your pet",
      desc: "Premium grooming, safe boarding and pet care for dogs and cats. Clean, gentle and stress-free service.",
      image: "assets/images/hero/dog-hero.avif",
      bg: "linear-gradient(110deg, #eadcff, #f9f6ff)", // ✅ purple theme
      b1: "#d6c6ff",
      b2: "#ffe0ea",
      b3: "#fff4c8",
      btn: "#4a1fb8" // ✅ darker than bg
    },
    {
      big: "purrfect",
      sub: "place for your pet",
      desc: "Gentle grooming & loving care for cats too. Soft handling, safe products and premium comfort.",
      image: "assets/images/hero/cat-hero.avif",
      bg: "linear-gradient(110deg, #ffd9e6, #fff7fb)", // ✅ pink theme
      b1: "#ffc2d6",
      b2: "#d6c6ff",
      b3: "#fff4c8",
      btn: "#b32558" // ✅ darker than bg
    }
  ];

  let current = 0;

  function applySlide(i, animate = true) {
    const s = slides[i];

    if (animate) {
      heroImage.classList.remove("fade-in");
      heroImage.classList.add("fade-out");
    }

    // background colors
    heroBg.style.background = s.bg;
    blob1.style.background = s.b1;
    blob2.style.background = s.b2;
    blob3.style.background = s.b3;

    // button color
    if (navBookBtn) navBookBtn.style.background = s.btn;
    if (heroBookBtn) heroBookBtn.style.background = s.btn;

    // text
    heroBig.textContent = s.big;
    heroSub.textContent = s.sub;
    heroDesc.textContent = s.desc;

    // image switch with animation
    setTimeout(() => {
      heroImage.src = s.image;

      heroImage.classList.remove("fade-out");
      heroImage.classList.add("fade-in");
    }, animate ? 450 : 0);
  }

  // initial
  applySlide(current, false);

  // auto slider
  setInterval(() => {
    current = (current + 1) % slides.length;
    applySlide(current, true);
  }, 4000);
})();