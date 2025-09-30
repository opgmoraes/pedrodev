const text = "Hello, World!";
const typedEl = document.getElementById("typed");
let i = 0;

function digitar() {
  if (typedEl) {
    if (i < text.length) {
      typedEl.innerHTML += text.charAt(i);
      i++;
      setTimeout(digitar, 160);
    }
  }
}

window.addEventListener("DOMContentLoaded", digitar);
const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
const menuIcon = document.querySelector(".menu-icon");

if (menuToggle && navbar && menuIcon) {
  menuToggle.addEventListener("change", () => {
    if (menuToggle.checked) {
      navbar.classList.add("active");
      menuIcon.innerHTML = '<i class="fas fa-times"></i>';
    } else {
      navbar.classList.remove("active");
      menuIcon.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      menuToggle.checked = false;
      navbar.classList.remove("active");
      menuIcon.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
}
