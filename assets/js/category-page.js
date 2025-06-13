// assets/js/category-page.js

document.addEventListener('DOMContentLoaded', function() {
    const productGridElement = document.getElementById('product-list-grid');
    const categoryTitleElement = document.querySelector('.section-title');

    // Verifica se productsData está disponível no momento da execução
    if (!window.productsData) {
        console.error('productsData não encontrado. Verifique se assets/js/products.js foi carregado ANTES de category-page.js.');
        // Tenta recarregar a página após um delay para dar chance ao products.js de carregar
        setTimeout(() => window.location.reload(), 500); 
        return;
    }

    if (!productGridElement || !categoryTitleElement) {
        console.warn('Página de categoria não possui #product-list-grid ou .section-title. Pulando renderização de categoria.');
        return;
    }

    // Determina a categoria da página a partir do atributo data-category do h2
    // Ex: 'vestido-longo', 'vestido-curto', 'best-sellers'
    const pageCategory = categoryTitleElement.dataset.category;

    // Função para renderizar produtos na grid
    const renderProducts = (productsToDisplay) => {
        productGridElement.innerHTML = ''; // Limpa a grid atual

        if (productsToDisplay.length === 0) {
            productGridElement.innerHTML = '<p style="text-align: center; margin-top: 50px;">Nenhum produto encontrado com os filtros selecionados.</p>';
            return;
        }

        productsToDisplay.forEach(product => {
            // Este HTML DEVE SER IDÊNTICO ao que você tinha hardcoded nas suas páginas de categoria,
            // mas agora com os valores do produto dinâmicos e o link correto.
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
            // Usa insertAdjacentHTML para melhor performance ao adicionar múltiplos elementos
            productGridElement.insertAdjacentHTML('beforeend', cardHtml);
        });
    };

    // Função principal para aplicar os filtros
    const applyFilters = (selectedFilters = {}) => { // selectedFilters pode ser vazio se nenhum filtro for aplicado
        let filtered = window.productsData;

        // 1. FILTRAGEM POR CATEGORIA DA PÁGINA (OU MAIS VENDIDOS)
        if (pageCategory === 'best-sellers') {
            filtered = filtered.filter(product => product.isBestSeller === true);
        } else if (pageCategory) { // Se há uma categoria definida para a página
            filtered = filtered.filter(product => product.category === pageCategory);
        }
        // Se não há pageCategory, assume que é uma página que lista TODOS os produtos (mas não é o seu caso aqui)


        // 2. APLICA FILTROS SELECIONADOS PELO USUÁRIO (do app-filter)

        // Filtro por Tamanho
        if (selectedFilters.sizes && selectedFilters.sizes.length > 0) {
            filtered = filtered.filter(product => 
                selectedFilters.sizes.some(size => product.sizes.includes(size))
            );
        }

        // Filtro por Cor
        if (selectedFilters.colors && selectedFilters.colors.length > 0) {
            filtered = filtered.filter(product => 
                selectedFilters.colors.some(color => product.colors.includes(color))
            );
        }

        // Filtro por Preço
        if (selectedFilters.price && selectedFilters.price.length > 0) {
            filtered = filtered.filter(product => {
                const productPrice = product.price; 
                return selectedFilters.price.some(range => {
                    return productPrice >= range.min && productPrice <= range.max;
                });
            });
        }
        
        renderProducts(filtered); // Renderiza os produtos filtrados
    };

    // 3. Ouve os eventos do componente app-filter
    window.addEventListener('filtersApplied', (event) => {
        console.log('Filtros aplicados:', event.detail);
        applyFilters(event.detail);
    });

    window.addEventListener('filtersCleared', () => {
        console.log('Filtros limpos.');
        applyFilters({}); // Re-renderiza tudo sem filtros
    });

    // 4. Chamada inicial para renderizar os produtos ao carregar a página
    // Damos um pequeno delay para garantir que productsData e o DOM estejam prontos
    setTimeout(() => {
        if (window.productsData) { // Apenas garante que productsData está lá
            applyFilters({}); // Renderiza os produtos inicialmente (da categoria da página)
        } else {
            console.error('productsData não carregado após delay. Falha na renderização inicial.');
        }
    }, 300); // 300ms de delay
});