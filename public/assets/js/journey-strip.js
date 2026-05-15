/* ===== Awards Stacked Carousel (Webflow style) ===== */
(function(){
  const track = document.getElementById("stackTrack");
  const prevBtn = document.getElementById("stackPrev");
  const nextBtn = document.getElementById("stackNext");
  const dotsWrap = document.getElementById("stackDots");

  if(!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const items = Array.from(track.querySelectorAll(".stackItem"));
  const total = items.length;
  let index = 0;

  // dots
  for(let i=0;i<total;i++){
    const d = document.createElement("div");
    d.className = "dot" + (i===0 ? " active" : "");
    d.addEventListener("click", ()=> goTo(i));
    dotsWrap.appendChild(d);
  }

  function setDots(){
    Array.from(dotsWrap.children).forEach((d,i)=> d.classList.toggle("active", i===index));
  }

  function layout(){
    const isSmall = window.innerWidth < 900;
    const s1 = isSmall ? 150 : 230;
    const s2 = isSmall ? 260 : 380;

    items.forEach((item, i) => {
      let offset = i - index;

      // wrap to show closest neighbours
      if(offset > total/2) offset -= total;
      if(offset < -total/2) offset += total;

      item.style.opacity = "0";
      item.style.filter = "blur(1px)";
      item.style.transform = "translateX(0px) scale(0.9)";
      item.style.zIndex = "1";

      if(offset === 0){
        item.style.opacity = "1";
        item.style.filter = "none";
        item.style.transform = "translateX(0px) scale(1)";
        item.style.zIndex = "10";
      }
      if(offset === -1){
        item.style.opacity = "1";
        item.style.filter = "blur(0.4px)";
        item.style.transform = `translateX(-${s1}px) scale(0.92)`;
        item.style.zIndex = "7";
      }
      if(offset === 1){
        item.style.opacity = "1";
        item.style.filter = "blur(0.4px)";
        item.style.transform = `translateX(${s1}px) scale(0.92)`;
        item.style.zIndex = "7";
      }
      if(offset === -2){
        item.style.opacity = "0.55";
        item.style.filter = "blur(1px)";
        item.style.transform = `translateX(-${s2}px) scale(0.88)`;
        item.style.zIndex = "4";
      }
      if(offset === 2){
        item.style.opacity = "0.55";
        item.style.filter = "blur(1px)";
        item.style.transform = `translateX(${s2}px) scale(0.88)`;
        item.style.zIndex = "4";
      }
    });

    setDots();
  }

  function goTo(i){
    index = (i + total) % total;
    layout();
  }

  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  window.addEventListener("resize", layout);
  layout();
})();