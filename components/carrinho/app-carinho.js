class AppCartComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;

    // Dados dos produtos (pode vir de uma API ou estado global)
    this.cartItems = [
      {
        id: 1,
        name: 'Vestido Cropped Floral Tati',
        price: 498.00,
        quantity: 1,
        image: '../../assets/imagens/produtos/vestido-longo/VESTIDO-CROPPED-FLORAL-TATI.webp'
      },
      {
        id: 2,
        name: 'Vestido Estampado Floral Tropical',
        price: 549.00,
        quantity: 1,
        image: '../../assets/imagens/produtos/vestido-longo/VESTIDO-ESTAMPADO-FLORAL-TROPICAL.webp'
      },
      {
        id: 3,
        name: 'Vestido Longo Sonho De Mar',
        price: 649.00,
        quantity: 1,
        image: '../../assets/imagens/produtos/vestido-longo/VESTIDO-LONGO-MG-BEATRICE-FLORAL.webp'
      }
    ];

    this.render();
  }

  connectedCallback() {
    this.setupEventListeners();
    
    // Escuta o evento openCart do header
    document.addEventListener('openCart', () => {
      console.log('Evento openCart recebido no componente cart!');
      this.openCart();
    });
  }

  disconnectedCallback() {
    document.removeEventListener('openCart', this.openCart.bind(this));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../components/app-cart/app-cart.css">
      <div class="cart-overlay ${this.isOpen ? 'active' : ''}">
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
            ${this.renderCartItems()}
          </div>

          <button class="checkout-btn">FINALIZAR COMPRA</button>
        </div>
      </div>
    `;
  }

  renderCartItems() {
    return this.cartItems.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/90x120/e6b3cc/000000?text=Produto'">
        <div class="item-info">
          <p class="item-name">${item.name}</p>
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

    // Fechar carrinho
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeCart();
      });
    }

    // Fechar ao clicar no overlay
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeCart();
        }
      });
    }

    // Finalizar compra
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

    // Event delegation para botões dos itens
    const cartItems = this.shadowRoot.querySelector('.cart-items');
    if (cartItems) {
      cartItems.addEventListener('click', (e) => {
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

  openCart() {
    this.isOpen = true;
    this.render();
    this.setupEventListeners();
    document.body.style.overflow = 'hidden'; // Previne scroll da página
    console.log('Carrinho aberto!');
  }

  closeCart() {
    this.isOpen = false;
    this.render();
    this.setupEventListeners();
    document.body.style.overflow = 'auto'; // Restaura scroll da página
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
    const cartItemsContainer = this.shadowRoot.querySelector('.cart-items');
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = this.renderCartItems();
    }
  }

  // Métodos públicos para interação externa
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