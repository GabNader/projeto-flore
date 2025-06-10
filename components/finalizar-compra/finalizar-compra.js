class AppCheckoutComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.cartItems = [];
    this.selectedPayment = 'card';

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../components/app-checkout/app-checkout.css">
      
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
              <div class="success-message" id="successMessage">
                Pedido realizado com sucesso! Você receberá um e-mail de confirmação em breve.
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
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="PR">Paraná</option>
                        <option value="RS">Rio Grande do Sul</option>
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
              </form>
            </div>

            <div class="order-summary">
              <h3>Resumo do Pedido</h3>
              
              <div class="products-list" id="productsList">
                <!-- Produtos serão inseridos dinamicamente -->
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

              <button class="btn-primary" id="finalizePurchaseBtn">
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
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.setupEventListeners();
    this.setupFormFormatting();
    this.renderProducts();
    this.updateSummary();
  }

  setupEventListeners() {
    // Botão voltar
    const backBtn = this.shadowRoot.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('backToCart', { 
          bubbles: true, 
          composed: true 
        }));
      });
    }

    // Botão fechar
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('closeCheckout', { 
          bubbles: true, 
          composed: true 
        }));
      });
    }

    // Métodos de pagamento
    const paymentMethods = this.shadowRoot.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
      method.addEventListener('click', (e) => {
        this.selectPaymentMethod(e.currentTarget.dataset.payment);
      });
    });

    // Finalizar compra
    const finalizePurchaseBtn = this.shadowRoot.querySelector('#finalizePurchaseBtn');
    if (finalizePurchaseBtn) {
      finalizePurchaseBtn.addEventListener('click', () => {
        this.finalizePurchase();
      });
    }
  }

  setupFormFormatting() {
    // Formatação do CEP
    const cepField = this.shadowRoot.querySelector('#cep');
    if (cepField) {
      cepField.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
      });
    }

    // Formatação do telefone
    const phoneField = this.shadowRoot.querySelector('#phone');
    if (phoneField) {
      phoneField.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        e.target.value = value;
      });
    }

    // Formatação do cartão
    const cardNumberField = this.shadowRoot.querySelector('#cardNumber');
    if (cardNumberField) {
      cardNumberField.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
      });
    }

    // Formatação da validade
    const cardExpiryField = this.shadowRoot.querySelector('#cardExpiry');
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
    
    // Atualizar visual
    this.shadowRoot.querySelectorAll('.payment-method').forEach(pm => {
      pm.classList.remove('active');
    });
    this.shadowRoot.querySelector(`[data-payment="${method}"]`).classList.add('active');

    // Mostrar/esconder detalhes do cartão
    const cardDetails = this.shadowRoot.querySelector('#cardDetails');
    if (cardDetails) {
      cardDetails.style.display = method === 'card' ? 'block' : 'none';
    }
  }

  setCartItems(items) {
    this.cartItems = items || [];
    this.renderProducts();
    this.updateSummary();
  }

  renderProducts() {
    const productsList = this.shadowRoot.querySelector('#productsList');
    if (!productsList) return;

    if (this.cartItems.length === 0) {
      productsList.innerHTML = '<div class="empty-cart">Nenhum produto no carrinho</div>';
      return;
    }

    productsList.innerHTML = this.cartItems.map(item => `
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
  }

  updateSummary() {
    const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = 15.90;
    const discount = subtotal > 200 ? 10.00 : 0;
    const total = subtotal + shipping - discount;

    const subtotalEl = this.shadowRoot.querySelector('#subtotal');
    const shippingEl = this.shadowRoot.querySelector('#shipping');
    const discountEl = this.shadowRoot.querySelector('#discount');
    const totalEl = this.shadowRoot.querySelector('#total');

    if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (shippingEl) shippingEl.textContent = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
    if (discountEl) discountEl.textContent = `-R$ ${discount.toFixed(2).replace('.', ',')}`;
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  finalizePurchase() {
    const form = this.shadowRoot.querySelector('#checkoutForm');
    const formData = new FormData(form);
    
    // Validação dos campos obrigatórios
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'cep', 'address', 'number', 'city', 'state'];
    let isValid = true;

    requiredFields.forEach(field => {
      const input = this.shadowRoot.querySelector(`#${field}`);
      if (!input.value.trim()) {
        input.style.borderColor = '#dc3545';
        isValid = false;
      } else {
        input.style.borderColor = '#e0e0e0';
      }
    });

    // Validação específica para cartão
    if (this.selectedPayment === 'card') {
      const cardFields = ['cardNumber', 'cardExpiry', 'cardCvv', 'cardName'];
      cardFields.forEach(field => {
        const input = this.shadowRoot.querySelector(`#${field}`);
        if (!input.value.trim()) {
          input.style.borderColor = '#dc3545';
          isValid = false;
        } else {
          input.style.borderColor = '#e0e0e0';
        }
      });
    }

    if (isValid) {
      // Simular processamento
      const button = this.shadowRoot.querySelector('#finalizePurchaseBtn');
      button.textContent = 'PROCESSANDO...';
      button.disabled = true;

      setTimeout(() => {
        const successMessage = this.shadowRoot.querySelector('#successMessage');
        successMessage.style.display = 'block';
        
        // Scroll para o topo
        const container = this.shadowRoot.querySelector('.checkout-container');
        container.scrollTop = 0;
        
        button.textContent = 'FINALIZAR COMPRA';
        button.disabled = false;

        // Disparar evento de compra finalizada
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
      // Mostrar erro
      const errorMessage = this.shadowRoot.querySelector('#errorMessage') || 
        this.createErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      errorMessage.style.display = 'block';
      
      setTimeout(() => {
        errorMessage.style.display = 'none';
      }, 5000);
    }
  }

  createErrorMessage(text) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'errorMessage';
    errorDiv.className = 'error-message';
    errorDiv.textContent = text;
    errorDiv.style.display = 'none';
    
    const successMessage = this.shadowRoot.querySelector('#successMessage');
    successMessage.parentNode.insertBefore(errorDiv, successMessage.nextSibling);
    
    return errorDiv;
  }

  // Método público para ser chamado quando o componente for exibido
  show(cartItems = []) {
    this.setCartItems(cartItems);
    this.style.display = 'block';
  }

  // Método público para esconder o componente
  hide() {
    this.style.display = 'none';
  }
}

customElements.define('app-checkout', AppCheckoutComponent);