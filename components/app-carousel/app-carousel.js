// components/app-carousel/app-carousel.js

class AppCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/projeto-flore/components/app-carousel/app-carousel.css">
      <div class="carousel-container">
        <h1 class="carousel-title">Mais vendidos</h1>
        
        <button class="carousel-button carousel-button-prev">
            <img src="/projeto-flore/assets/imagens/svg/chevron-left.svg" alt="Anterior">
        </button>
        <button class="carousel-button carousel-button-next">
            <img src="/projeto-flore/assets/imagens/svg/chevron-right.svg" alt="Próximo">
        </button>
        
        <ul class="carousel-track">
          <slot></slot>
        </ul>
      </div>
    `;
  }

  connectedCallback() {
    const track = this.shadowRoot.querySelector('.carousel-track');
    const nextButton = this.shadowRoot.querySelector('.carousel-button-next');
    const prevButton = this.shadowRoot.querySelector('.carousel-button-prev');

    const slot = this.shadowRoot.querySelector('slot');
    let cards = [];

    const updateCardsAndDimensions = () => {
        cards = Array.from(slot.assignedElements());
        calculateCarouselDimensions();
    };

    if (slot) {
        slot.addEventListener('slotchange', updateCardsAndDimensions);
    }

    let cardsToShow;
    let cardWidth;
    let totalScrollableWidth;
    let scrollAmount;
    let currentPosition = 0;

    const calculateCarouselDimensions = () => {
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

        if (cards.length > 0) {
            cardWidth = cards[0].getBoundingClientRect().width; 
        } else {
            cardWidth = 0;
        }
        
        const itemSpacing = parseFloat(window.getComputedStyle(track).gap) || 0; 
        
        totalScrollableWidth = (cardWidth + itemSpacing) * cards.length - (cardsToShow * (cardWidth + itemSpacing));
        scrollAmount = cardsToShow * (cardWidth + itemSpacing);
        
        totalScrollableWidth = Math.max(0, totalScrollableWidth);
        
        track.style.transform = 'translateX(0)';
        currentPosition = 0;

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
        const maxScrollPosition = -(totalScrollableWidth);
        if (currentPosition > maxScrollPosition) {
            currentPosition = Math.max(currentPosition - scrollAmount, maxScrollPosition);
            track.style.transform = `translateX(${currentPosition}px)`;
        }
    };

    const movePrev = () => {
        if (currentPosition < 0) {
            currentPosition = Math.min(currentPosition + scrollAmount, 0);
            track.style.transform = `translateX(${currentPosition}px)`;
        }
    };

    if (nextButton) nextButton.addEventListener('click', moveNext);
    if (prevButton) prevButton.addEventListener('click', movePrev);
    
    window.addEventListener('resize', calculateCarouselDimensions);

    updateCardsAndDimensions();
  }
}

customElements.define('app-carousel', AppCarousel);