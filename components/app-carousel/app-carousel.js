// components/app-carousel/app-carousel.js

class AppCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

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
          </ul>
      </div>
    `;
  }

  connectedCallback() {
    this.track = this.shadowRoot.querySelector('.carousel-track');
    this.nextButton = this.shadowRoot.querySelector('.carousel-button-next');
    this.prevButton = this.shadowRoot.querySelector('.carousel-button-prev');

    this._renderBestSellers();

    if (this.nextButton) this.nextButton.addEventListener('click', this._moveNext.bind(this));
    if (this.prevButton) this.prevButton.addEventListener('click', this._movePrev.bind(this));
    
    window.addEventListener('resize', this._calculateCarouselDimensions.bind(this));

  }

  
  _renderBestSellers() {
    if (!window.productsData) {
      console.error('productsData não encontrado. Certifique-se de que assets/js/products.js foi carregado ANTES de app-carousel.js.');
      setTimeout(() => this._renderBestSellers(), 500); 
      return;
    }

    const bestSellers = window.productsData.filter(p => p.isBestSeller === true);
    const productsToDisplay = bestSellers.slice(0, 15);

    this.track.innerHTML = ''; 

    if (productsToDisplay.length === 0) {
      this.track.innerHTML = '<p style="text-align: center; width: 100%; margin: 20px 0;">Nenhum produto "Mais Vendido" encontrado.</p>';
      this._calculateCarouselDimensions();
      return;
    }

    productsToDisplay.forEach(product => {
      const cardHtml = `
        <li class="product-card">
          <a href="../pages/produto.html?id=${product.id}" class="product-card-link"> 
            <div class="product-image">
              <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="product-info">
              <h2 class="product-title">${product.name}</h2>
              <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')} ou ${product.installments}</span>
            </div>
          </a>
        </li>
      `;
      this.track.insertAdjacentHTML('beforeend', cardHtml);
    });

   
    const images = this.track.querySelectorAll('img');
    let imagesLoadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
        this._calculateCarouselDimensions();
        this._updateButtonVisibility();
        return;
    }

    images.forEach(img => {
        const imageLoadHandler = () => {
            imagesLoadedCount++;
         
            if (imagesLoadedCount === totalImages) {
           
                setTimeout(() => {
                    this._calculateCarouselDimensions();
                    this._updateButtonVisibility();
                }, 100); 
          
                images.forEach(i => {
                    i.removeEventListener('load', imageLoadHandler);
                    i.removeEventListener('error', imageLoadHandler);
                });
            }
        };

        if (img.complete) { 
            imageLoadHandler();
        } else {
            img.addEventListener('load', imageLoadHandler);
            img.addEventListener('error', imageLoadHandler); 
        }
    });
  }

  _calculateCarouselDimensions() {
    const cards = Array.from(this.track.children); 
    if (cards.length === 0) {
        this.cardWidth = 0;
        this.totalScrollableWidth = 0;
        this.scrollAmount = 0;
        this.currentPosition = 0;
        this._updateButtonVisibility();
        return;
    }

    if (window.innerWidth >= 1920) {
        this.cardsToShow = 8;
    } else if (window.innerWidth >= 1400) {
        this.cardsToShow = 6;
    } else if (window.innerWidth >= 1024) {
        this.cardsToShow = 5;
    } else if (window.innerWidth >= 768) {
        this.cardsToShow = 4;
    } else if (window.innerWidth >= 580) {
        this.cardsToShow = 3;
    } else {
        this.cardsToShow = 2;
    }

    const cardsAvailableForScroll = cards.length - this.cardsToShow;
    if (cardsAvailableForScroll < 2 && cardsAvailableForScroll >=0) {
        this.cardsToShow = Math.max(cards.length - 1, 1); 
    }

    const firstCard = cards[0];
    const cardRect = firstCard.getBoundingClientRect();
    this.cardWidth = cardRect.width;
    const trackStyles = window.getComputedStyle(this.track);
    const itemSpacing = parseFloat(trackStyles.gap) || 0;

    const remainingCards = cards.length - this.cardsToShow;
    if (remainingCards <= 4 && remainingCards > 0) {
        this.scrollAmount = 2 * this.cardWidth + itemSpacing;
        if (this.scrollAmount > (this.totalContentWidth - (this.currentPosition === 0 ? 0 : (-this.currentPosition))) && this.totalContentWidth > 0) {
             this.scrollAmount = this.totalContentWidth - (this.currentPosition === 0 ? 0 : (-this.currentPosition));
        }
    } else {
        this.scrollAmount = this.cardsToShow * this.cardWidth + (this.cardsToShow - 1) * itemSpacing;
    }
    
    this.totalContentWidth = cards.length * this.cardWidth + (cards.length - 1) * itemSpacing;
    const containerRect = this.track.parentElement.getBoundingClientRect();
    this.containerVisibleWidth = containerRect.width;

    this.totalScrollableWidth = Math.max(0, this.totalContentWidth - this.containerVisibleWidth);
    
    if (this.totalScrollableWidth > 0 && this.scrollAmount > this.totalScrollableWidth) {
        this.scrollAmount = this.totalScrollableWidth;
    }
    if (this.scrollAmount < (this.cardWidth / 2) && this.totalScrollableWidth > 0) { 
        this.scrollAmount = this.cardWidth + itemSpacing;
    }
    if (this.scrollAmount === 0 && this.totalScrollableWidth > 0) {
        this.scrollAmount = this.cardWidth + itemSpacing;
    }

    this.track.style.transform = 'translateX(0)';
    this.currentPosition = 0;
    this._updateButtonVisibility();

    console.log('--- calculateCarouselDimensions (Dynamic) ---');
    console.log('cardsToShow:', this.cardsToShow);
    console.log('remainingCards:', cards.length - this.cardsToShow);
    console.log('cardWidth:', this.cardWidth);
    console.log('itemSpacing:', itemSpacing);
    console.log('scrollAmount:', this.scrollAmount);
    console.log('totalCards:', cards.length);
    console.log('screenWidth:', window.innerWidth);
    console.log('totalContentWidth (track):', this.totalContentWidth);
    console.log('containerVisibleWidth (carousel-container):', this.containerVisibleWidth);
    console.log('totalScrollableWidth:', this.totalScrollableWidth);
    console.log('---------------------------------');
  }

  _moveNext() {
    if (this.totalScrollableWidth <= 0 || this.scrollAmount <= 0) return;
    
    const maxScrollPosition = -this.totalScrollableWidth;
    
    const newPosition = Math.max(this.currentPosition - this.scrollAmount, maxScrollPosition);
    this.currentPosition = newPosition;
    this.track.style.transform = `translateX(${this.currentPosition}px)`;
    
    this._updateButtonVisibility();
  }

  _movePrev() {
    if (this.totalScrollableWidth <= 0) return;
    
    const newPosition = Math.min(this.currentPosition + this.scrollAmount, 0);
    this.currentPosition = newPosition;
    this.track.style.transform = `translateX(${this.currentPosition}px)`;
    
    this._updateButtonVisibility();
  }

  _updateButtonVisibility() {
    if (this.prevButton && this.nextButton) {
        if (this.currentPosition >= 0) {
            this.prevButton.style.display = 'none';
        } else {
            this.prevButton.style.display = 'flex';
        }
        
        if (this.currentPosition <= -this.totalScrollableWidth) {
            this.nextButton.style.display = 'none';
        } else {
            this.nextButton.style.display = 'flex';
        }
    }
  }
}

customElements.define('app-carousel', AppCarousel);