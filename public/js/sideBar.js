const burguerButton = document.querySelector(".mobile-modal-button");
const sideBar = document.querySelector(".side-bar");
const logo = document.querySelector("header .logo");

burguerButton.addEventListener("click", () => {
  sideBar.classList.toggle("visivel");
  logo.classList.toggle("invisivel");
});
