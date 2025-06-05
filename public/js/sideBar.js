const burguerButton = document.querySelector(".mobile-modal-button");
const sideBar = document.querySelector(".side-bar");
const logo = document.querySelector("header .logo");
const sideBarNav = sideBar.querySelector('nav');
const navP = sideBarNav.querySelectorAll('nav p');

sideBar.addEventListener('mouseover', () => {
  sideBar.classList.add('expandida');
  sideBar.style.width = '15%';
  // navP.forEach((p) => {
  //   p.style.display = 'block';
  // })
});

sideBar.addEventListener('mouseout', () => {
  sideBar.classList.remove('expandida');
  sideBar.style.width = '90px';
  // navP.forEach((p) => {
  //   p.style.display = 'none';
  // })
});
