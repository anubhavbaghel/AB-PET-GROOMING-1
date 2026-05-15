document.addEventListener("DOMContentLoaded", () => {

  const blocks = document.querySelectorAll(".story-block");

  function reveal(){
    const trigger = window.innerHeight * 0.85;

    blocks.forEach(block => {
      const top = block.getBoundingClientRect().top;

      if(top < trigger){
        block.classList.add("show");
      }
    });
  }

  window.addEventListener("scroll", reveal);

  // run once on load
  reveal();

});

document.addEventListener("DOMContentLoaded", function () {

  const track = document.querySelector(".stackTrack");
  let slides = Array.from(document.querySelectorAll(".stackItem"));

  const cloneCount = 4;

  // LEFT CLONE
  for (let i = slides.length - cloneCount; i < slides.length; i++) {
    const clone = slides[i].cloneNode(true);
    track.insertBefore(clone, track.firstChild);
  }

  // RIGHT CLONE
  for (let i = 0; i < cloneCount; i++) {
    const clone = slides[i].cloneNode(true);
    track.appendChild(clone);
  }

  slides = Array.from(document.querySelectorAll(".stackItem"));

  let index = cloneCount;

  function updateSlider(animate = true) {
    const slideWidth = slides[0].offsetWidth + 30;
    const offset = (track.parentElement.offsetWidth / 2) - (slideWidth / 2);

    track.style.transition = animate ? "transform 0.8s ease" : "none";
    track.style.transform = `translateX(${offset - index * slideWidth}px)`;

    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
  }

  function autoSlide() {
    index++;
    updateSlider(true);

    if (index >= slides.length - cloneCount) {
      setTimeout(() => {
        index = cloneCount;
        updateSlider(false);
      }, 800);
    }
  }

  updateSlider(false);
  setInterval(autoSlide, 4000);
});


function scrollLeft(){
  document.getElementById("testimonialContainer").scrollBy({
    left: -300,
    behavior: "smooth"
  });
}

function scrollRight(){
  document.getElementById("testimonialContainer").scrollBy({
    left: 300,
    behavior: "smooth"
  });
}
