class AppProductDetail extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../components/app-product-detail/app-product-detail.css">
            <div class="product-detail-container">
                <div class="product-main-content">
                    <div class="product-media">
                        <div class="main-product-image">
                            <img src="" alt=""> 
                        </div>
                        <div class="thumbnail-gallery">
                        </div>
                    </div>

                    <div class="product-info-panel">
                        <h1 class="product-title"></h1> 
                        <span class="product-price"></span> 

                        <div class="product-options">
                            <div class="option-group">
                                <label for="size-select">Tamanho:</label>
                                <select id="size-select">
                                    <option value="">Selecione</option>
                                </select>
                            </div>
                            
                            <div class="option-group">
                                <label for="quantity-input">Quantidade:</label>
                                <input type="number" id="quantity-input" value="1" min="1">
                            </div>
                        </div>

                        <button class="add-to-cart-btn">ADICIONAR AO CARRINHO</button>
                        
                        <div class="product-description">
                            <h3>Descrição</h3>
                            <p></p>
                        </div>

                        <div class="product-shipping-info">
                            <h3>Frete e Entrega</h3>
                            <p>Calcule o frete para o seu CEP:</p>
                            <input type="text" placeholder="Digite seu CEP">
                            <button>Calcular</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.loadProductData();
        const addToCartBtn = this.shadowRoot.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', this._handleAddToCart.bind(this));
        }
    }

    loadProductData() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            console.error('ID do produto não encontrado na URL.');
            this.shadowRoot.innerHTML = `<p style="text-align: center; margin-top: 50px;">Produto não encontrado. Verifique a URL.</p>`;
            return;
        }

        const product = window.productsData.find(p => p.id === productId);

        if (!product) {
            console.error(`Produto com ID '${productId}' não encontrado.`);
            this.shadowRoot.innerHTML = `<p style="text-align: center; margin-top: 50px;">Produto '${productId}' não encontrado na base de dados.</p>`;
            return;
        }

        this._renderProduct(product);
        this.currentProduct = product; 
    }

    _renderProduct(product) {
        if (!product) return;

        const mainImageEl = this.shadowRoot.querySelector('.main-product-image img');
        const titleEl = this.shadowRoot.querySelector('.product-title');
        const priceEl = this.shadowRoot.querySelector('.product-price');
        const descriptionEl = this.shadowRoot.querySelector('.product-description p');
        const thumbnailGalleryEl = this.shadowRoot.querySelector('.thumbnail-gallery');
        const sizeSelectEl = this.shadowRoot.querySelector('#size-select');
        const quantityInputEl = this.shadowRoot.querySelector('#quantity-input');


        
        if (mainImageEl && product.images && product.images.length > 0) {
            mainImageEl.src = product.images[0];
            mainImageEl.alt = product.name;
        } else if (mainImageEl) {
            mainImageEl.src = ''; 
            mainImageEl.alt = 'Imagem não disponível';
        }

        if (titleEl) titleEl.textContent = product.name;
        if (priceEl) {
            priceEl.textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
            if (product.installments) {
                priceEl.textContent += ` ou ${product.installments}`;
            }
        }
        if (descriptionEl) descriptionEl.textContent = product.description;

        if (thumbnailGalleryEl && product.images && product.images.length > 0) {
            thumbnailGalleryEl.innerHTML = product.images.map((imgSrc, index) => `
                <img src="${imgSrc}" alt="${product.name} - Vista ${index + 1}" data-index="${index}">
            `).join('');

            const thumbnails = this.shadowRoot.querySelectorAll('.thumbnail-gallery img');
            thumbnails.forEach((thumb, index) => {
                thumb.addEventListener('click', () => {
                    mainImageEl.src = thumb.src;
                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
                if (index === 0) {
                    thumb.classList.add('active');
                }
            });
        } else if (thumbnailGalleryEl) {
            thumbnailGalleryEl.innerHTML = '';
        }

        if (sizeSelectEl && product.sizes && product.sizes.length > 0) {
            sizeSelectEl.innerHTML = '<option value="">Selecione</option>' + 
                product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
        } else if (sizeSelectEl) {
            sizeSelectEl.innerHTML = '<option value="">Não disponível</option>';
            sizeSelectEl.disabled = true;
        }
        
        if (quantityInputEl && !quantityInputEl.value) {
            quantityInputEl.value = 1;
        }
    }

    _handleAddToCart() {
        if (!this.currentProduct) {
            console.error('Nenhum produto selecionado para adicionar ao carrinho.');
            return;
        }

        const sizeSelectEl = this.shadowRoot.querySelector('#size-select');
        const quantityInputEl = this.shadowRoot.querySelector('#quantity-input');

        const selectedSize = sizeSelectEl ? sizeSelectEl.value : null;
        const selectedQuantity = quantityInputEl ? parseInt(quantityInputEl.value) : 1;

        if (sizeSelectEl && !selectedSize) {
            alert('Por favor, selecione um tamanho.');
            sizeSelectEl.focus();
            return;
        }
        if (selectedQuantity < 1) {
            alert('A quantidade deve ser pelo menos 1.');
            if (quantityInputEl) quantityInputEl.focus();
            return;
        }

        const itemToAdd = {
            id: this.currentProduct.id,
            name: this.currentProduct.name,
            price: this.currentProduct.price,
            image: this.currentProduct.images[0], 
            size: selectedSize,
            quantity: selectedQuantity
        };

        this.dispatchEvent(new CustomEvent('addToCart', {
            detail: itemToAdd,
            bubbles: true,
            composed: true
        }));

        alert(`"${itemToAdd.name}" (${itemToAdd.size || 'Tamanho Único'}) adicionado ao carrinho!`);
    }
}

customElements.define('app-product-detail', AppProductDetail);