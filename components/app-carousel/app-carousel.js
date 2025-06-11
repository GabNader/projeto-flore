// components/app-carousel/app-carousel.js

class AppCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // HTML do carrossel com os product-cards embutidos
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../components/app-carousel/app-carousel.css">
      <div class="carousel-container">
        <h1 class="carousel-title">Mais vendidos</h1>
        
        <button class="carousel-button carousel-button-prev">
            <img src="../assets/imagens/svg/chevron-left.svg" alt="Anterior">
        </button>
        <button class="carousel-button carousel-button-next">
            <img src="../assets/imagens/svg/chevron-right.svg" alt="Próximo">
        </button>
        
        <ul class="carousel-track">
          <li class="product-card">
              <div class="product-image">
                  <img src="../assets/imagens/produtos/vestidos-curtos/VESTIDO-OMBRO-SO-ROSALIA-LENCO-S.webp" alt="Produto1">
              </div>
              <div class="product-info">
                  <h2 class="product-title">Vestido Ombro Rosalia</h2>
                  <span class="product-price">R$ 449,00 ou 4x de R$112,25</span>
              </div>
          </li>
          
          <li class="product-card">
              <div class="product-image">
                  <img src="../assets/imagens/produtos/vestidos-curtos/VESTIDO-CURTO-JARDIM-FLORIDO.webp" alt="Produto2">
              </div>
              <div class="product-info">
                  <h2 class="product-title">Vestido Curto Jardim Florido</h2>
                  <span class="product-price">R$ 398,00 ou 4x de R$99,50</span>
              </div>
          </li>

          <li class="product-card">
              <div class="product-image">
                  <img src="../assets/imagens/produtos/vestidos-curtos/VESTIDO-CURTO-TRANSPASSE-FLORAL-BELLE.webp" alt="Produto3">
              </div>
              <div class="product-info">
                  <h2 class="product-title">Vestido Curto Transpasse Floral Belle</h2>
                  <span class="product-price">R$ 498,00 ou 4x de R$99,60</span>
              </div>
          </li>

          <li class="product-card">
              <div class="product-image">
                  <img src="../assets/imagens/produtos/vestido-longo/VESTIDO-LANGUIDO-FLORAL-ARABASQUE.webp" alt="Produto4">
              </div>
              <div class="product-info">
                  <h2 class="product-title">Vestido Longo Languido Floral Arabasque</h2>
                  <span class="product-price">R$ 498,00 ou 5x de R$99,50</span>
              </div>
          </li>

          <li class="product-card">
              <div class="product-image">
                  <img src="../assets/imagens/produtos/vestido-longo/VESTIDO-CROPPED-BALONE-COGU.webp" alt="Produto5">
              </div>
              <div class="product-info">
                  <h2 class="product-title">Vestido Longo Cropped Balonê Cogul</h2>
                  <span class="product-price">R$ 549,00 ou 5x de R$109,80</span>
              </div>
          </li>

          <li class="product-card">
              <div class="product-image">
                  <img src="../assets/imagens/produtos/vestidos-curtos/VESTIDO-ALCA-LENCO-JARDIM-REAL.webp" alt="Produto6">
              </div>
              <div class="product-info">
                  <h2 class="product-title">Vestido Curto Jardim Real</h2>
                  <span class="product-price">R$ 298,00 ou 3x de R$99,33</span>
              </div>
          </li>

          <li class="product-card">
              <div class="product-image">
                  <img src="../assets/imagens/produtos/vestidos-curtos/VESTIDO-CURTO-TROPICALIA.webp" alt="Produto7">
              </div>
              <div class="product-info">
                  <h2 class="product-title">Vestido Curto Tropicália</h2>
                  <span class="product-price">R$ 449,00 ou 5x de R$112,25</span>
              </div>
          </li>

          <li class="product-card">
              <div class="product-image">
                  <img src="../assets/imagens/produtos/vestido-longo/VESTIDO-CROPPED-JARDIM-MARAVILHOSO.webp" alt="Produto8">
              </div>
              <div class="product-info">
                  <h2 class="product-title">Vestido Longo Cropped Jardim Maravilhoso</h2>
                  <span class="product-price">R$ 449,00 ou 5x de R$112,25</span>
              </div>
          </li>

          <li class="product-card">
              <div class="product-image">
                  <img src="../assets/imagens/produtos/vestidos-curtos/VESTIDO-CURTO-JARDIM-CHINTZ.webp" alt="Produto9">
              </div>
              <div class="product-info">
                  <h2 class="product-title">Vestido Curto Jardim Chintz</h2>
                  <span class="product-price">R$ 398,00 ou 4x de R$99,50</span>
              </div>
          </li>

          <li class="product-card">
              <div class="product-image">
                  <img src="../assets/imagens/produtos/vestidos-curtos/VESTIDO-OMBRO-SO-ROSALIA-LENCO-S.webp" alt="Produto1">
              </div>
              <div class="product-info">
                  <h2 class="product-title">Vestido Ombro Rosalia</h2>
                  <span class="product-price">R$ 449,00 ou 4x de R$112,25</span>
              </div>
          </li>

          <li class="product-card">
              <div class="product-image">
                  <img src="../assets/imagens/produtos/vestidos-curtos/VESTIDO-CURTO-JARDIM-FLORIDO.webp" alt="Produto2">
              </div>
              <div class="product-info">
                  <h2 class="product-title">Vestido Curto Jardim Florido</h2>
                  <span class="product-price">R$ 398,00 ou 4x de R$99,50</span>
              </div>
          </li>
        </ul>
      </div>
    `;
  }

  connectedCallback() {
    const track = this.shadowRoot.querySelector('.carousel-track');
    const nextButton = this.shadowRoot.querySelector('.carousel-button-next');
    const prevButton = this.shadowRoot.querySelector('.carousel-button-prev');

    const cards = Array.from(track.children); 

    let cardsToShow;
    let cardWidth;
    let totalScrollableWidth;
    let scrollAmount;
    let currentPosition = 0;

    const calculateCarouselDimensions = () => {
        // Determina quantos cards mostrar baseado na largura da tela
        if (window.innerWidth >= 1920) {
            cardsToShow = 8;
        } else if (window.innerWidth >= 1400) {
            cardsToShow = 6;
        } else if (window.innerWidth >= 1024) {
            cardsToShow = 5;
        } else if (window.innerWidth >= 768) {
            cardsToShow = 4;
        } else if (window.innerWidth >= 580) {
            cardsToShow = 3;
        } else {
            cardsToShow = 2;
        }

        // Se não há cards suficientes para scroll, ajusta a quantidade
        const cardsAvailableForScroll = cards.length - cardsToShow;
        if (cardsAvailableForScroll < 2) {
            // Se sobram menos de 2 cards para scroll, reduz a quantidade mostrada
            cardsToShow = Math.max(cards.length - 3, 2);
        }

        // Calcula as dimensões reais dos elementos
        if (cards.length > 0) {
            const firstCard = cards[0];
            const cardRect = firstCard.getBoundingClientRect();
            cardWidth = cardRect.width;
        } else {
            cardWidth = 0;
            return;
        }
        
        // Obtém o gap real entre os elementos
        const trackStyles = window.getComputedStyle(track);
        const itemSpacing = parseFloat(trackStyles.gap) || 0;
        
        // Para poucos cards disponíveis para scroll, move de 2 em 2 ao invés de uma "página" completa
        const remainingCards = cards.length - cardsToShow;
        if (remainingCards <= 4) {
            scrollAmount = 2 * cardWidth + itemSpacing; // Move apenas 2 cards por vez
        } else {
            scrollAmount = cardsToShow * cardWidth + (cardsToShow - 1) * itemSpacing;
        }
        
        // Calcula o espaço total que todos os cards ocupam
        const totalCardsWidth = cards.length * cardWidth + (cards.length - 1) * itemSpacing;
        
        // Calcula o espaço visível do container
        const containerWidth = track.parentElement.getBoundingClientRect().width;
        
        // Se todos os cards cabem na tela, não precisa de scroll
        if (totalCardsWidth <= containerWidth || remainingCards <= 0) {
            totalScrollableWidth = 0;
        } else {
            // Calcula quanto pode ser scrollado
            totalScrollableWidth = totalCardsWidth - containerWidth;
        }
        
        console.log('Debug melhorado:', {
            cardsToShow,
            remainingCards,
            cardWidth,
            itemSpacing,
            scrollAmount,
            totalCards: cards.length,
            screenWidth: window.innerWidth,
            totalScrollableWidth
        });
        
        // Reset da posição
        track.style.transform = 'translateX(0)';
        currentPosition = 0;

        // Controla a visibilidade dos botões
        if (prevButton && nextButton) {
            if (totalScrollableWidth <= 0) {
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
            } else {
                prevButton.style.display = 'flex';
                nextButton.style.display = 'flex';
            }
        }
    };

    const moveNext = () => {
        if (totalScrollableWidth <= 0) return;
        
        const maxScrollPosition = -totalScrollableWidth;
        
        console.log('moveNext:', {
            currentPosition,
            scrollAmount,
            maxScrollPosition,
            wouldBePosition: currentPosition - scrollAmount
        });
        
        if (currentPosition > maxScrollPosition) {
            // Move uma "página" de cards ou até o final
            const newPosition = Math.max(currentPosition - scrollAmount, maxScrollPosition);
            currentPosition = newPosition;
            track.style.transform = `translateX(${currentPosition}px)`;
            
            console.log('Moved to:', currentPosition);
        }
    };

    const movePrev = () => {
        if (totalScrollableWidth <= 0) return;
        
        console.log('movePrev:', {
            currentPosition,
            scrollAmount,
            wouldBePosition: currentPosition + scrollAmount
        });
        
        if (currentPosition < 0) {
            const newPosition = Math.min(currentPosition + scrollAmount, 0);
            currentPosition = newPosition;
            track.style.transform = `translateX(${currentPosition}px)`;
            
            console.log('Moved to:', currentPosition);
        }
    };

    if (nextButton) nextButton.addEventListener('click', moveNext);
    if (prevButton) prevButton.addEventListener('click', movePrev);
    
    window.addEventListener('resize', calculateCarouselDimensions);

    setTimeout(() => {
        calculateCarouselDimensions();
    }, 100);

    const images = this.shadowRoot.querySelectorAll('img');
    let imagesLoaded = 0;
    
    const checkAllImagesLoaded = () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
            calculateCarouselDimensions();
        }
    };

    images.forEach(img => {
        if (img.complete) {
            checkAllImagesLoaded();
        } else {
            img.addEventListener('load', checkAllImagesLoaded);
            img.addEventListener('error', checkAllImagesLoaded);
        }
    }); 
  }
}

customElements.define('app-carousel', AppCarousel);