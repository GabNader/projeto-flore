// components/app-menu/app-menu.js

class AppMenuComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../components/app-menu/app-menu.css">
      <div class="menu-overlay"></div>
      <div class="sideMenu">
        <div class="voltar">
          <img class="icone-voltar" src="../assets/imagens/svg/arrow-ios-back.svg" alt="Voltar">
          VOLTAR
        </div>
        <div class="search-container">
          <input class="input-busca" type="text" id="buscar" placeholder="Buscar...">
          <button class="btn-busca">
            <img class="icone-lupa" src="../assets/imagens/svg/search.svg" alt="Buscar">
          </button>
        </div>

        <ul class="sideMenuItem">
          <li><a href="vestido-longo.html">VESTIDO LONGO</a></li>
          <li><a href="vestido-curto.html">VESTIDO CURTO</a></li>
          <li><a href="vestido-midi.html">VESTIDO MIDI</a></li>
          <li><a href="mais-vendidos.html">MAIS VENDIDOS</a></li>
          <li><a href="#">SOBRE</a></li>
        </ul>
      </div>
    `;
  }

  connectedCallback() {
    const sideMenu = this.shadowRoot.querySelector('.sideMenu');
    const menuOverlay = this.shadowRoot.querySelector('.menu-overlay');
    const voltarBtn = this.shadowRoot.querySelector('.voltar');

    // Funções para abrir e fechar o menu (agora dentro do componente de menu)
    const openMenu = () => {
      sideMenu.classList.add('active');
      menuOverlay.classList.add('active');
    };

    const closeMenu = () => {
      sideMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
    };

    if (voltarBtn) {
      voltarBtn.addEventListener('click', closeMenu);
    }

    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }

    // Ouve o evento 'openMenu' que é disparado pelo app-header (ou por qualquer lugar que o chame)
    // Usamos 'window' porque o evento borbulha até lá.
    window.addEventListener('openMenu', openMenu);
    // Também ouve o evento 'openCart' para fechar o menu se o carrinho for aberto
    window.addEventListener('openCart', closeMenu); // Fechar o menu quando o carrinho abre
  }
}

customElements.define('app-menu', AppMenuComponent);