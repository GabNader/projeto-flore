document.addEventListener('DOMContentLoaded', function() {
  // Elementos do menu
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const sideMenu = document.querySelector('.sideMenu');
  const menuOverlay = document.querySelector('.menu-overlay');
  const voltarBtn = document.querySelector('.voltar');
  
  // Funções do menu
  function closeMenu() {
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
  }
  
  // Event listeners do menu (apenas se os elementos existirem)
  if (hamburgerBtn && sideMenu && menuOverlay) {
    hamburgerBtn.addEventListener('click', function() {
      sideMenu.classList.add('active');
      menuOverlay.classList.add('active');
    });
  }
  
  if (voltarBtn) {
    voltarBtn.addEventListener('click', closeMenu);
  }
  
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }
  
  // Elementos do carrossel
  const track = document.querySelector('.carousel-track');
  const nextButton = document.querySelector('.carousel-button-next');
  const prevButton = document.querySelector('.carousel-button-prev');
  
  // Apenas inicializa o carrossel se todos os elementos necessários existirem
  if (track && nextButton && prevButton) {
    const cards = Array.from(track.children);
    
    // Variáveis de configuração do carrossel
    let cardsToShow;
    let cardWidth;
    let totalScrollableWidth;
    let scrollAmount;
    let currentPosition = 0;
    
    // Funções do carrossel
    function calculateCarouselDimensions() {
      // Define quantos cards mostrar baseado na largura da tela
      if (window.innerWidth >= 1920) {
        cardsToShow = 8; // 8 produtos para desktop full HD
      } else if (window.innerWidth >= 1400) {
        cardsToShow = 6; // 6 produtos para desktop normal
      } else if (window.innerWidth >= 1024) {
        cardsToShow = 5; // 5 produtos para laptops
      } else if (window.innerWidth >= 768) {
        cardsToShow = 4; // 4 produtos para tablets
      } else if (window.innerWidth >= 580) {
        cardsToShow = 3; // 3 produtos para mobile landscape
      } else {
        cardsToShow = 2; // 2 produtos para mobile portrait
      }
      
      // Calcula largura do card (considerando gap de 10px)
      cardWidth = cards[0].getBoundingClientRect().width + 10;
      
      // Calcula largura total scrollável
      totalScrollableWidth = cardWidth * cards.length - (cardsToShow * cardWidth);
      
      // Quantidade para scroll (avança pelo número de cards visíveis)
      scrollAmount = cardsToShow * cardWidth;
      
      // Reset para posição inicial
      track.style.transform = 'translateX(0)';
      currentPosition = 0;
    }
    
    function moveNext() {
      // Se não chegou ao final, move
      if (currentPosition > -totalScrollableWidth) {
        currentPosition = Math.max(currentPosition - scrollAmount, -totalScrollableWidth);
        track.style.transform = `translateX(${currentPosition}px)`;
      }
    }
    
    function movePrev() {
      // Se não está no início, move
      if (currentPosition < 0) {
        currentPosition = Math.min(currentPosition + scrollAmount, 0);
        track.style.transform = `translateX(${currentPosition}px)`;
      }
    }
    
    // Event listeners do carrossel
    nextButton.addEventListener('click', moveNext);
    prevButton.addEventListener('click', movePrev);
    window.addEventListener('resize', calculateCarouselDimensions);
    
    // Inicialização do carrossel
    calculateCarouselDimensions();
  }
});