class AppCartComponent extends HTMLElement {
  _loadCartFromLocalStorage() {
    try {
      const savedCart = localStorage.getItem('cartItems');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      console.log('AppCartComponent: Carrinho carregado do localStorage:', parsedCart);
      return parsedCart;
    } catch (e) {
      console.error("AppCartComponent: Erro ao carregar carrinho do localStorage:", e);
      return [];
    }
  }

  _saveCartToLocalStorage() {
    try {
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      console.log('AppCartComponent: Carrinho salvo no localStorage:', this.cartItems);
    } catch (e) {
      console.error("AppCartComponent: Erro ao salvar carrinho no localStorage:", e);
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;

    this.cartItems = this._loadCartFromLocalStorage(); 

    this._initialRender();
    console.log('AppCartComponent: 1. Constructor - Carrinho inicializado (HTML renderizado).');
  }

  connectedCallback() {
    console.log('AppCartComponent: 2. connectedCallback - Carrinho conectado ao DOM.');

    this.overlay = this.shadowRoot.querySelector('.cart-overlay');
    this.sidebar = this.shadowRoot.querySelector('.cart-sidebar');
    this.closeBtn = this.shadowRoot.querySelector('.close-btn');
    this.checkoutBtn = this.shadowRoot.querySelector('.checkout-btn');
    this.cartItemsContainer = this.shadowRoot.querySelector('.cart-items');
    this.totalPriceEl = this.shadowRoot.querySelector('.total-price');

    console.log('AppCartComponent: 2.1 Elementos visuais selecionados:', {
        overlay: !!this.overlay,
        sidebar: !!this.sidebar,
        cartItemsContainer: !!this.cartItemsContainer,
        closeBtn: !!this.closeBtn,
        checkoutBtn: !!this.checkoutBtn,
        totalPriceEl: !!this.totalPriceEl
    });

    this.setupEventListeners();
    console.log('AppCartComponent: 2.2 setupEventListeners() chamado.');
    
    this._boundOpenCart = this.openCart.bind(this);
    document.addEventListener('openCart', this._boundOpenCart);
    console.log('AppCartComponent: 2.3 Listener "openCart" adicionado ao document.');

    this._boundHandleAddToCartEvent = (event) => {
        console.log('AppCartComponent: 3. Evento addToCart recebido no document!', event.detail);
        this.addItem(event.detail); 
        this.openCart();
    };
    document.addEventListener('addToCart', this._boundHandleAddToCartEvent);
    console.log('AppCartComponent: 2.4 Listener "addToCart" adicionado ao document.');

    this.updateCartDisplay();
    console.log('AppCartComponent: 2.5 updateCartDisplay() chamado (conteúdo inicial).');
  }

  disconnectedCallback() {
    console.log('AppCartComponent: disconnectedCallback - Carrinho desconectado do DOM.');
    document.removeEventListener('openCart', this._boundOpenCart);
    document.removeEventListener('addToCart', this._boundHandleAddToCartEvent);
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
          <div class="cart-summary-footer">
            <div class="cart-total-display">
                <span>Total:</span>
                <span class="total-price">R$ 0,00</span>
            </div>
            <button class="checkout-btn">FINALIZAR COMPRA</button>
          </div>
        </div>
      </div>
    `;
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

  setupEventListeners() {
    const overlay = this.shadowRoot.querySelector('.cart-overlay');
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    const checkoutBtn = this.shadowRoot.querySelector('.checkout-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', this.closeCart.bind(this));
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeCart();
        }
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        console.log('Finalizando compra...');
        this.dispatchEvent(new CustomEvent('checkout', { 
          bubbles: true, 
          composed: true,
          detail: { items: this.cartItems }
        }));
      });
    }

    const cartItems = this.shadowRoot.querySelector('.cart-items');
    if (cartItems) {
      cartItems.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const itemId = target.dataset.id; 
        
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

  openCart() {
    console.log('AppCartComponent: MÉTODO openCart() CHAMADO.'); 
    
    if (!this.overlay || !this.sidebar) {
      console.error('AppCartComponent: ERRO! Elementos overlay ou sidebar não encontrados para abertura.');
      return;
    }

    this.isOpen = true;
    this.overlay.classList.add('active');
    this.sidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.updateCartDisplay(); 
    console.log('AppCartComponent: Carrinho aberto com sucesso! Classes "active" adicionadas.');
  }

  closeCart() {
    console.log('AppCartComponent: Fechando carrinho...');
    
    if (!this.overlay || !this.sidebar) {
      console.error('AppCartComponent: ERRO! Elementos do carrinho não disponíveis para fechamento.');
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
      this._saveCartToLocalStorage(); 
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
      this._saveCartToLocalStorage(); 
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
    this._saveCartToLocalStorage(); 
    this.dispatchEvent(new CustomEvent('cartUpdated', { 
      bubbles: true, 
      composed: true,
      detail: { action: 'remove', itemId }
    }));
  }

  updateCartDisplay() {
    if (this.cartItemsContainer) {
      this.cartItemsContainer.innerHTML = this.renderCartItems();
      this._updateCartSummary(); 
    }
  }

  addItem(item) {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id && cartItem.size === item.size); 
    if (existingItem) {
      existingItem.quantity += item.quantity; 
    } else {
      this.cartItems.push({ ...item }); 
    }
    this.updateCartDisplay();
    this._saveCartToLocalStorage(); 
  }

  _updateCartSummary() {
    const total = this.getCartTotal();
    const totalPriceEl = this.shadowRoot.querySelector('.total-price'); 
    if (totalPriceEl) {
        totalPriceEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
   
  }

  getCartTotal() {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemCount() {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}

customElements.define('app-cart', AppCartComponent);