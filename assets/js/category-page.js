document.addEventListener('DOMContentLoaded', function() {
    const productGridElement = document.getElementById('product-list-grid');
    const categoryTitleElement = document.querySelector('.section-title');

    if (!window.productsData) {
        console.error('productsData não encontrado. Verifique se assets/js/products.js foi carregado ANTES de category-page.js.');
        setTimeout(() => window.location.reload(), 500); 
        return;
    }

    if (!productGridElement || !categoryTitleElement) {
        console.warn('Página de categoria não possui #product-list-grid ou .section-title. Pulando renderização de categoria.');
        return;
    }

    const pageCategory = categoryTitleElement.dataset.category;

    const renderProducts = (productsToDisplay) => {
        productGridElement.innerHTML = '';

        if (productsToDisplay.length === 0) {
            productGridElement.innerHTML = '<p style="text-align: center; margin-top: 50px;">Nenhum produto encontrado com os filtros selecionados.</p>';
            return;
        }

        productsToDisplay.forEach(product => {
            const cardHtml = `
                <div class="product-card">
                    <a href="produto.html?id=${product.id}" class="product-card-link">
                        <div class="product-image">
                            <img src="${product.images[0]}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <h2 class="product-title">${product.name}</h2>
                            <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')} ou ${product.installments}</span>
                        </div>
                    </a>
                </div>
            `;
            productGridElement.insertAdjacentHTML('beforeend', cardHtml);
        });
    };

    const applyFilters = (selectedFilters = {}) => {
        let filtered = window.productsData;


        if (pageCategory === 'best-sellers') {
            filtered = filtered.filter(product => product.isBestSeller === true);
        } else if (pageCategory) {
            filtered = filtered.filter(product => product.category === pageCategory);
        }

        if (selectedFilters.sizes && selectedFilters.sizes.length > 0) {
            filtered = filtered.filter(product => 
                selectedFilters.sizes.some(size => product.sizes.includes(size))
            );
        }

        if (selectedFilters.colors && selectedFilters.colors.length > 0) {
            filtered = filtered.filter(product => 
                selectedFilters.colors.some(color => product.colors.includes(color))
            );
        }

        if (selectedFilters.price && selectedFilters.price.length > 0) {
            filtered = filtered.filter(product => {
                const productPrice = product.price; 
                return selectedFilters.price.some(range => {
                    return productPrice >= range.min && productPrice <= range.max;
                });
            });
        }
        
        renderProducts(filtered);
    };

    window.addEventListener('filtersApplied', (event) => {
        console.log('Filtros aplicados:', event.detail);
        applyFilters(event.detail);
    });

    window.addEventListener('filtersCleared', () => {
        console.log('Filtros limpos.');
        applyFilters({}); 
    });

    setTimeout(() => {
        if (window.productsData) { 
            applyFilters({}); 
        } else {
            console.error('productsData não carregado após delay. Falha na renderização inicial.');
        }
    }, 300); 
});