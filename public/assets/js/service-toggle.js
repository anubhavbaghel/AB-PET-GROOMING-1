const tabs = document.querySelectorAll(".svc-tab");
const panels = document.querySelectorAll(".svc-panel");
const indicator = document.querySelector(".svc-indicator");
const wrap = document.querySelector(".svc-wrap"); // we will scroll here

function moveIndicator(activeBtn) {
  const left = activeBtn.offsetLeft;
  const width = activeBtn.offsetWidth;
  indicator.style.left = left + "px";
  indicator.style.width = width + "px";
}

function smoothScrollToServicesTop() {
  if (!wrap) return;
  const y = wrap.getBoundingClientRect().top + window.scrollY - 90; // 90px for sticky navbar
  window.scrollTo({ top: y, behavior: "smooth" });
}

tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    // active tab
    tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // aria
    tabs.forEach(b => b.setAttribute("aria-selected", "false"));
    btn.setAttribute("aria-selected", "true");

    // show panel
    const target = btn.dataset.target;
    panels.forEach(p => p.classList.remove("active"));
    const activePanel = document.getElementById(target);
    if (activePanel) activePanel.classList.add("active");

    // move underline
    moveIndicator(btn);

    // smooth scroll to top of services section (premium feel)
    smoothScrollToServicesTop();
  });
});

window.addEventListener("load", () => {
  const active = document.querySelector(".svc-tab.active");
  if (active) moveIndicator(active);
});

window.addEventListener("resize", () => {
  const active = document.querySelector(".svc-tab.active");
  if (active) moveIndicator(active);
});