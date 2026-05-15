const tabs = document.querySelectorAll(".svc-tab");
const panels = document.querySelectorAll(".svc-panel");
const indicator = document.querySelector(".svc-indicator");
const wrap = document.querySelector(".svc-wrap");

function moveIndicator(activeBtn) {
  const left = activeBtn.offsetLeft;
  const width = activeBtn.offsetWidth;
  indicator.style.left = left + "px";
  indicator.style.width = width + "px";
}

function smoothScrollToServicesTop() {
  if (!wrap) return;
  const y = wrap.getBoundingClientRect().top + window.scrollY - 90; // sticky navbar
  window.scrollTo({ top: y, behavior: "smooth" });
}

tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    tabs.forEach(b => b.setAttribute("aria-selected", "false"));
    btn.setAttribute("aria-selected", "true");

    const target = btn.dataset.target;
    panels.forEach(p => p.classList.remove("active"));
    const activePanel = document.getElementById(target);
    if (activePanel) activePanel.classList.add("active");

    moveIndicator(btn);
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