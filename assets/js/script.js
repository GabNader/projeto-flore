document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const sideMenu = document.querySelector('.sideMenu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const voltarBtn = document.querySelector('.voltar');
    
    hamburgerBtn.addEventListener('click', function() {
      sideMenu.classList.add('active');
      menuOverlay.classList.add('active');
    });

    voltarBtn.addEventListener('click', function() {
      closeMenu();
    });
    
    menuOverlay.addEventListener('click', function() {
      closeMenu();
    });
    
    function closeMenu() {
      document.querySelector('.sideMenu').classList.remove('active');
      document.querySelector('.menu-overlay').classList.remove('active');
    }
  });
