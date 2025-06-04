// components/app-header/app-header.js

class AppHeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../components/app-header/app-header.css">
      <header class="header">
        <div class="logo-menu">
          <button class="hamburger-btn">
            <img class="hamburger" src="../assets/imagens/svg/menu.svg" alt="Menu">
          </button>
          <a href="index.html" class="logo-link">
            <h1 class="logo">Floré</h1>
          </a>
        </div>
        <div class="icons"> 
          <button class="fav-btn">
            <img class="icon" src="../assets/imagens/svg/heart.svg" alt="Favoritos">
          </button>
          <button class="cart-btn">
            <img class="icon" src="../assets/imagens/svg/shopping-cart.svg" alt="Carrinho">
          </button>
        </div>
      </header>
    `;
  }

  connectedCallback() { // ESTA FUNÇÃO PRECISA TER ESTE CONTEÚDO AGORA
    const hamburgerBtn = this.shadowRoot.querySelector('.hamburger-btn');
    const cartBtn = this.shadowRoot.querySelector('.cart-btn');

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => {
        console.log('Botão de hambúrguer clicado no header! Disparando openMenu.'); // Adicione este console.log para depuração
        this.dispatchEvent(new CustomEvent('openMenu', { bubbles: true, composed: true }));
      });
    }

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            console.log('Botão de carrinho clicado no header! Disparando openCart.'); // Adicione este console.log para depuração
            this.dispatchEvent(new CustomEvent('openCart', { bubbles: true, composed: true }));
        });
    }
  }
}

customElements.define('app-header', AppHeaderComponent);