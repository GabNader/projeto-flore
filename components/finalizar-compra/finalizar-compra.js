// components/finalizar-compra/finalizar-compra.js

class AppCheckoutComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.cartItems = [];
    this.selectedPayment = 'card';

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../components/finalizar-compra/finalizar-compra.css">
      
      <div class="checkout-overlay">
        <div class="checkout-container">
          <header class="checkout-header">
            <button class="back-btn">
              <img src="../assets/imagens/svg/arrow-left.svg" alt="Voltar">
              VOLTAR
            </button>
            <h2>Finalizar Compra</h2>
            <button class="close-btn">
              <img src="../assets/imagens/svg/x.svg" alt="Fechar">
            </button>
          </header>

          <div class="checkout-content">
            <div class="checkout-form-section">
              <div class="success-message" id="successMessage" style="display: none;">
                Pedido realizado com sucesso! Você receberá um e-mail de confirmação em breve.
              </div>
              <div class="error-message" id="errorMessage" style="display: none;">
                Por favor, preencha todos os campos obrigatórios.
              </div>

              <form class="checkout-form" id="checkoutForm">
                <div class="form-section">
                  <h3>Informações Pessoais</h3>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="firstName">Nome *</label>
                      <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                      <label for="lastName">Sobrenome *</label>
                      <input type="text" id="lastName" name="lastName" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="email">E-mail *</label>
                    <input type="email" id="email" name="email" required>
                  </div>
                  <div class="form-group">
                    <label for="phone">Telefone *</label>
                    <input type="tel" id="phone" name="phone" required>
                  </div>
                </div>

                <div class="form-section">
                  <h3>Endereço de Entrega</h3>
                  <div class="form-group">
                    <label for="cep">CEP *</label>
                    <input type="text" id="cep" name="cep" placeholder="00000-000" required>
                  </div>
                  <div class="form-group">
                    <label for="address">Endereço *</label>
                    <input type="text" id="address" name="address" required>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="number">Número *</label>
                      <input type="text" id="number" name="number" required>
                    </div>
                    <div class="form-group">
                      <label for="complement">Complemento</label>
                      <input type="text" id="complement" name="complement">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="city">Cidade *</label>
                      <input type="text" id="city" name="city" required>
                    </div>
                    <div class="form-group">
                      <label for="state">Estado *</label>
                      <select id="state" name="state" required>
                        <option value="">Selecione</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="form-section">
                  <h3>Forma de Pagamento</h3>
                  <div class="payment-methods">
                    <div class="payment-method active" data-payment="card">
                      <div class="payment-icon">💳</div>
                      <div>Cartão</div>
                    </div>
                    <div class="payment-method" data-payment="pix">
                      <div class="payment-icon">📱</div>
                      <div>PIX</div>
                    </div>
                    <div class="payment-method" data-payment="boleto">
                      <div class="payment-icon">🧾</div>
                      <div>Boleto</div>
                    </div>
                  </div>

                  <div class="card-details" id="cardDetails">
                    <div class="form-group">
                      <label for="cardNumber">Número do Cartão *</label>
                      <input type="text" id="cardNumber" name="cardNumber" placeholder="0000 0000 0000 0000">
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label for="cardExpiry">Validade *</label>
                        <input type="text" id="cardExpiry" name="cardExpiry" placeholder="MM/AA">
                      </div>
                      <div class="form-group">
                        <label for="cardCvv">CVV *</label>
                        <input type="text" id="cardCvv" name="cardCvv" placeholder="000">
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="cardName">Nome no Cartão *</label>
                      <input type="text" id="cardName" name="cardName">
                    </div>
                  </div>
                </div>

                <div class="form-section order-summary-form-section">
                    <h3>Resumo do Pedido</h3>
                    
                    <div class="products-list" id="productsList">
                        </div>

                    <div class="summary-details">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span id="subtotal">R$ 0,00</span>
                        </div>
                        <div class="summary-row">
                            <span>Frete:</span>
                            <span id="shipping">R$ 15,90</span>
                        </div>
                        <div class="summary-row discount-row">
                            <span>Desconto:</span>
                            <span id="discount">-R$ 0,00</span>
                        </div>
                        <div class="summary-total">
                            <span>Total:</span>
                            <span id="total">R$ 0,00</span>
                        </div>
                    </div>

                    <button class="btn-primary" id="finalizePurchaseBtnForm">
                        FINALIZAR COMPRA
                    </button>

                    <div class="security-info">
                        <div>Compra 100% segura</div>
                        <div class="security-icons">
                            <div class="security-icon">🔒 SSL</div>
                            <div class="security-icon">💳 VISA</div>
                            <div class="security-icon">💳 MASTER</div>
                        </div>
                    </div>
                </div>
              </form>
            </div>

            <div class="order-summary-column">
              <div class="order-summary">
                <h3>Resumo do Pedido</h3>
                <div class="products-list" id="productsListColumn">
                    </div>
                <div class="summary-details">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span id="subtotalColumn">R$ 0,00</span>
                    </div>
                    <div class="summary-row">
                        <span>Frete:</span>
                        <span id="shippingColumn">R$ 15,90</span>
                    </div>
                    <div class="summary-row discount-row">
                        <span>Desconto:</span>
                        <span id="discountColumn">-R$ 0,00</span>
                    </div>
                    <div class="summary-total">
                        <span>Total:</span>
                        <span id="totalColumn">R$ 0,00</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    console.log('AppCheckoutComponent: connectedCallback - Checkout conectado ao DOM.');
    this.setupEventListeners();
    this.setupFormFormatting();
    
    this._boundHandleCheckoutEvent = (event) => {
        console.log('AppCheckoutComponent: Evento checkout recebido!', event.detail);
        this.show(event.detail.items);
    };
    document.addEventListener('checkout', this._boundHandleCheckoutEvent);
    console.log('AppCheckoutComponent: Listener "checkout" adicionado ao document.');
  }

  disconnectedCallback() {
    console.log('AppCheckoutComponent: disconnectedCallback - Checkout desconectado do DOM.');
    if (this._boundHandleCheckoutEvent) {
        document.removeEventListener('checkout', this._boundHandleCheckoutEvent);
    }
  }

  setupEventListeners() {
    console.log('AppCheckoutComponent: setupEventListeners() chamado.');
    const backBtn = this.shadowRoot.querySelector('.back-btn');
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    const paymentMethods = this.shadowRoot.querySelectorAll('.payment-method');
    this.finalizePurchaseBtnColumn = this.shadowRoot.querySelector('.order-summary-column .btn-primary'); 
    this.finalizePurchaseBtnForm = this.shadowRoot.querySelector('#finalizePurchaseBtnForm'); 

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.hide();
        this.dispatchEvent(new CustomEvent('backToCart', { 
          bubbles: true, 
          composed: true 
        }));
      });
      console.log('AppCheckoutComponent: Listener "backBtn" adicionado.');
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hide();
        this.dispatchEvent(new CustomEvent('closeCheckout', { 
          bubbles: true, 
          composed: true 
        }));
        console.log('AppCheckoutComponent: Evento closeCheckout disparado.');
      });
      console.log('AppCheckoutComponent: Listener "closeBtn" adicionado.');
    }

    paymentMethods.forEach(method => {
      method.addEventListener('click', (e) => {
        this.selectPaymentMethod(e.currentTarget.dataset.payment);
        console.log('AppCheckoutComponent: Método de pagamento selecionado:', e.currentTarget.dataset.payment);
      });
    });

    if (this.finalizePurchaseBtnForm) {
      this.finalizePurchaseBtnForm.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('AppCheckoutComponent: Botão FINALIZAR COMPRA (formulário) clicado!');
        this.finalizePurchase();
      });
      console.log('AppCheckoutComponent: Listener "finalizePurchaseBtnForm" adicionado.');
    }

    if (this.finalizePurchaseBtnColumn) {
        this.finalizePurchaseBtnColumn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('AppCheckoutComponent: Botão FINALIZAR COMPRA (coluna lateral) clicado!');
            this.finalizePurchase();
        });
        console.log('AppCheckoutComponent: Listener "finalizePurchaseBtnColumn" adicionado.');
    }
  }

  setupFormFormatting() {
    console.log('AppCheckoutComponent: Formatação de formulário configurada.');
    const cepField = this.shadowRoot.querySelector('#cep');
    const phoneField = this.shadowRoot.querySelector('#phone');
    const cardNumberField = this.shadowRoot.querySelector('#cardNumber');
    const cardExpiryField = this.shadowRoot.querySelector('#cardExpiry');

    if (cepField) {
        cepField.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }
    if (phoneField) {
        phoneField.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });
    }
    if (cardNumberField) {
        cardNumberField.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    }
    if (cardExpiryField) {
        cardExpiryField.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/, '$1/$2');
            e.target.value = value;
        });
    }
  }

  selectPaymentMethod(method) {
    this.selectedPayment = method;
    
    this.shadowRoot.querySelectorAll('.payment-method').forEach(pm => {
      pm.classList.remove('active');
    });
    this.shadowRoot.querySelector(`[data-payment="${method}"]`).classList.add('active');

    const cardDetails = this.shadowRoot.querySelector('#cardDetails');
    if (cardDetails) {
      cardDetails.style.display = method === 'card' ? 'block' : 'none';
    }
  }

  setCartItems(items) {
    console.log('AppCheckoutComponent: setCartItems() chamado com itens:', items);
    this.cartItems = items || [];
    this.renderProducts();
    this.updateSummary();
  }

  renderProducts() {
    console.log('AppCheckoutComponent: renderProducts() chamado. Itens no carrinho:', this.cartItems.length);
    const productsListForm = this.shadowRoot.querySelector('#productsList');
    const productsListColumn = this.shadowRoot.querySelector('#productsListColumn');

    if (!productsListForm) {
      console.error('AppCheckoutComponent: Elemento #productsList (formulário) não encontrado.');
      return;
    }

    const productsHtml = this.cartItems.length === 0 
        ? '<div class="empty-cart">Nenhum produto no carrinho</div>'
        : this.cartItems.map(item => `
            <div class="product-item">
                <div class="product-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<div class="placeholder-image">V</div>'}
                </div>
                <div class="product-info">
                    <div class="product-name">${item.name}</div>
                    <div class="product-details">
                        ${item.size ? `Tamanho: ${item.size}` : ''} 
                        ${item.color ? `| Cor: ${item.color}` : ''}
                        ${item.quantity ? `| Qtd: ${item.quantity}` : ''}
                    </div>
                </div>
                <div class="product-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
            </div>
        `).join('');
    
    productsListForm.innerHTML = productsHtml;
    if (productsListColumn) {
        productsListColumn.innerHTML = productsHtml;
    }
    console.log('AppCheckoutComponent: Produtos do carrinho renderizados nas seções (se encontradas).');
  }

  updateSummary() {
    console.log('AppCheckoutComponent: updateSummary() chamado.');
    const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = 15.90;
    const discount = subtotal > 200 ? 10.00 : 0;
    const total = subtotal + shipping - discount;

    const formatPrice = (price) => `R$ ${price.toFixed(2).replace('.', ',')}`;

    const subtotalEl = this.shadowRoot.querySelector('#subtotal');
    const shippingEl = this.shadowRoot.querySelector('#shipping');
    const discountEl = this.shadowRoot.querySelector('#discount');
    const totalEl = this.shadowRoot.querySelector('#total');

    const subtotalElColumn = this.shadowRoot.querySelector('#subtotalColumn');
    const shippingElColumn = this.shadowRoot.querySelector('#shippingColumn');
    const discountElColumn = this.shadowRoot.querySelector('#discountColumn');
    const totalElColumn = this.shadowRoot.querySelector('#totalColumn');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = formatPrice(shipping);
    if (discountEl) discountEl.textContent = `-${formatPrice(discount)}`;
    if (totalEl) totalEl.textContent = formatPrice(total);

    if (subtotalElColumn) subtotalElColumn.textContent = formatPrice(subtotal);
    if (shippingElColumn) shippingElColumn.textContent = formatPrice(shipping);
    if (discountElColumn) discountElColumn.textContent = `-${formatPrice(discount)}`;
    if (totalElColumn) totalElColumn.textContent = formatPrice(total);
    
    console.log('AppCheckoutComponent: Resumo atualizado em ambas as seções.');
  }

  finalizePurchase() {
    console.log('AppCheckoutComponent: Iniciando finalizePurchase().');
    const form = this.shadowRoot.querySelector('#checkoutForm');
    if (!form) {
        console.error('AppCheckoutComponent: ERRO! Formulário #checkoutForm não encontrado.');
        return;
    }
    const formData = new FormData(form);
    
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'cep', 'address', 'number', 'city', 'state'];
    let isValid = true;

    const successMessage = this.shadowRoot.querySelector('#successMessage');
    const errorMessageEl = this.shadowRoot.querySelector('#errorMessage');
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessageEl) errorMessageEl.style.display = 'none';

    requiredFields.forEach(field => {
      const input = this.shadowRoot.querySelector(`#${field}`);
      if (input) {
          if (!input.value.trim()) {
              input.classList.add('error-field');
              isValid = false;
          } else {
              input.classList.remove('error-field');
          }
      }
    });

    if (this.selectedPayment === 'card') {
      const cardFields = ['cardNumber', 'cardExpiry', 'cardCvv', 'cardName'];
      cardFields.forEach(field => {
        const input = this.shadowRoot.querySelector(`#${field}`);
        if (input) {
            if (!input.value.trim()) {
                input.classList.add('error-field');
                isValid = false;
            } else {
                input.classList.remove('error-field');
            }
        }
      });
    }

    if (isValid) {
      console.log('AppCheckoutComponent: Validação de formulário: válida.');
      const button = this.shadowRoot.querySelector('#finalizePurchaseBtnForm') || this.shadowRoot.querySelector('.order-summary-column .btn-primary'); 
      if (button) {
          button.textContent = 'PROCESSANDO...';
          button.disabled = true;
      }

      setTimeout(() => {
        if (successMessage) successMessage.style.display = 'block';
        
        const container = this.shadowRoot.querySelector('.checkout-container');
        if (container) container.scrollTop = 0;
        
        if (button) {
            button.textContent = 'FINALIZAR COMPRA';
            button.disabled = false;
        }

        console.log('AppCheckoutComponent: Compra simulada finalizada. Disparando purchaseCompleted.');
        this.dispatchEvent(new CustomEvent('purchaseCompleted', { 
          bubbles: true, 
          composed: true,
          detail: {
            formData: Object.fromEntries(formData),
            paymentMethod: this.selectedPayment,
            items: this.cartItems
          }
        }));
      }, 2000);
    } else {
      console.warn('AppCheckoutComponent: Validação de formulário: inválida. Mostrando erro.');
      if (errorMessageEl) errorMessageEl.style.display = 'block';
      
      setTimeout(() => {
        if (errorMessageEl) errorMessageEl.style.display = 'none';
      }, 5000);
    }
  }
  
  _getFormDataAsObject(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
  }

  // Método público para ser chamado quando o componente for exibido
  show(cartItems = []) {
    console.log('AppCheckoutComponent: Método show() CHAMADO. Itens recebidos:', cartItems.length);
    this.setCartItems(cartItems);

    const checkoutContainer = this.shadowRoot.querySelector('.checkout-container');
    const checkoutOverlay = this.shadowRoot.querySelector('.checkout-overlay');

    if (checkoutContainer && checkoutOverlay) {
        checkoutOverlay.classList.add('active');
        checkoutContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('AppCheckoutComponent: Classes "active" adicionadas para exibição.');
    } else {
        console.error('AppCheckoutComponent: ERRO! Elementos .checkout-container ou .checkout-overlay não encontrados para exibir.');
    }
    
    this.style.display = 'block'; 
    console.log('AppCheckoutComponent: style.display = "block" aplicado ao host.');

    const firstInputField = this.shadowRoot.querySelector('input[type="text"]');
    if (firstInputField) {
        firstInputField.focus();
    }
  }

  // Método público para esconder o componente
  hide() {
    console.log('AppCheckoutComponent: Método hide() CHAMADO.');
    const checkoutContainer = this.shadowRoot.querySelector('.checkout-container');
    const checkoutOverlay = this.shadowRoot.querySelector('.checkout-overlay');

    if (checkoutContainer && checkoutOverlay) {
        checkoutOverlay.classList.remove('active');
        checkoutContainer.classList.remove('active');
        document.body.style.overflow = 'auto';
        console.log('AppCheckoutComponent: Classes "active" removidas para ocultação.');
    } else {
        console.error('AppCheckoutComponent: ERRO! Elementos .checkout-container ou .checkout-overlay não encontrados para ocultar.');
    }
    
    setTimeout(() => {
        this.style.display = 'none';
        console.log('AppCheckoutComponent: style.display = "none" aplicado ao host.');
    }, 300);
  }
}

customElements.define('app-checkout', AppCheckoutComponent);