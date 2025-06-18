// components/app-cart/app-cart.js

class AppCartComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.cartItems = [];

    this._initialRender();
  }

  connectedCallback() {
    // Aguardar o próximo frame para garantir que o DOM esteja pronto
    requestAnimationFrame(() => {
      this._initializeElements();
      this._setupEventListeners();
      this._setupDocumentListeners();
      this.updateCartDisplay();
    });
  }

  disconnectedCallback() {
    // Remover event listeners do document
    if (this._openCartListener) {
      document.removeEventListener('openCart', this._openCartListener);
    }
    if (this._handleAddToCartEvent) {
      document.removeEventListener('addToCart', this._handleAddToCartEvent);
    }
  }

  _initialRender() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../components/app-cart/app-cart.css">
      <div class="cart-overlay">
        <div class="cart-sidebar">
          <div class="cart-header">
            <div class="header-content">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
              </svg>
              <h2>carrinho</h2>
            </div>
            <button class="close-btn">&times;</button>
          </div>

          <div class="cart-items">
          </div>

          <button class="checkout-btn">FINALIZAR COMPRA</button>
        </div>
      </div>
    `;
  }

  _initializeElements() {
    this.overlay = this.shadowRoot.querySelector('.cart-overlay');
    this.sidebar = this.shadowRoot.querySelector('.cart-sidebar');
    this.closeBtn = this.shadowRoot.querySelector('.close-btn');
    this.checkoutBtn = this.shadowRoot.querySelector('.checkout-btn');
    this.cartItemsContainer = this.shadowRoot.querySelector('.cart-items');

    // Verificar se todos os elementos foram encontrados
    if (!this.overlay || !this.sidebar || !this.cartItemsContainer) {
      console.error('Elementos do carrinho não encontrados:', {
        overlay: !!this.overlay,
        sidebar: !!this.sidebar,
        cartItemsContainer: !!this.cartItemsContainer
      });
    }
  }

  _setupEventListeners() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', this.closeCart.bind(this));
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.closeCart();
        }
      });
    }

    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        console.log('Finalizando compra...');
        this.dispatchEvent(new CustomEvent('checkout', { 
          bubbles: true, 
          composed: true,
          detail: { items: this.cartItems }
        }));
      });
    }

    if (this.cartItemsContainer) {
      this.cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const itemId = parseInt(target.dataset.id);
        
        if (target.classList.contains('increase-btn')) {
          this.increaseQuantity(itemId);
        } else if (target.classList.contains('decrease-btn')) {
          this.decreaseQuantity(itemId);
        } else if (target.classList.contains('remove-btn')) {
          this.removeItem(itemId);
        }
      });
    }
  }

  _setupDocumentListeners() {
    // Event listener para abrir o carrinho
    this._openCartListener = (event) => {
      console.log('Evento openCart recebido:', event);
      this.openCart();
    };
    document.addEventListener('openCart', this._openCartListener);

    // Event listener para adicionar item ao carrinho
    this._handleAddToCartEvent = (event) => {
      console.log('Evento addToCart recebido no carrinho!', event.detail);
      this.addItem(event.detail);
      this.openCart(); // Abre o carrinho automaticamente ao adicionar
    };
    document.addEventListener('addToCart', this._handleAddToCartEvent);
  }

  renderCartItems() {
    if (this.cartItems.length === 0) {
        return '<p class="empty-cart-message">Seu carrinho está vazio.</p>';
    }
    return this.cartItems.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/90x120/e6b3cc/000000?text=Produto'">
        <div class="item-info">
          <p class="item-name">${item.name} ${item.size ? `(${item.size})` : ''}</p>
          <p class="item-price">R$${item.price.toFixed(2).replace('.', ',')}</p>
          <div class="item-controls">
            <button class="decrease-btn" data-id="${item.id}">-</button>
            <span>${String(item.quantity).padStart(2, '0')} un.</span>
            <button class="increase-btn" data-id="${item.id}">+</button>
            <button class="remove-btn" data-id="${item.id}">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  openCart() {
    console.log('Tentando abrir carrinho...');
    
    if (!this.overlay || !this.sidebar) {
      console.error('Elementos do carrinho não disponíveis para abertura');
      return;
    }

    this.isOpen = true;
    this.overlay.classList.add('active');
    this.sidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.updateCartDisplay();
    console.log('Carrinho aberto com sucesso!');
  }

  closeCart() {
    console.log('Fechando carrinho...');
    
    if (!this.overlay || !this.sidebar) {
      console.error('Elementos do carrinho não disponíveis para fechamento');
      return;
    }

    this.isOpen = false;
    this.overlay.classList.remove('active');
    this.sidebar.classList.remove('active');
    document.body.style.overflow = 'auto';
    console.log('Carrinho fechado!');
  }

  increaseQuantity(itemId) {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item) {
      item.quantity++;
      this.updateCartDisplay();
      this.dispatchEvent(new CustomEvent('cartUpdated', { 
        bubbles: true, 
        composed: true,
        detail: { action: 'increase', itemId, newQuantity: item.quantity }
      }));
    }
  }

  decreaseQuantity(itemId) {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.updateCartDisplay();
      this.dispatchEvent(new CustomEvent('cartUpdated', { 
        bubbles: true, 
        composed: true,
        detail: { action: 'decrease', itemId, newQuantity: item.quantity }
      }));
    }
  }

  removeItem(itemId) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateCartDisplay();
    this.dispatchEvent(new CustomEvent('cartUpdated', { 
      bubbles: true, 
      composed: true,
      detail: { action: 'remove', itemId }
    }));
  }

  updateCartDisplay() {
    if (this.cartItemsContainer) {
      this.cartItemsContainer.innerHTML = this.renderCartItems();
    }
  }

  addItem(item) {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ ...item, quantity: 1 });
    }
    this.updateCartDisplay();
  }

  getCartTotal() {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemCount() {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}

customElements.define('app-cart', AppCartComponent);