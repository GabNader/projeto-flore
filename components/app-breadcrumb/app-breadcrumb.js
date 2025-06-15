// components/app-breadcrumb/app-breadcrumb.js

class AppBreadcrumb extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../components/app-breadcrumb/app-breadcrumb.css">
            <nav class="breadcrumb-nav">
                <ol class="breadcrumb-list">
                </ol>
            </nav>
        `;
    }

    connectedCallback() {
        this.renderBreadcrumb();
        // Opcional: Renderizar novamente se a URL mudar (para SPAs, mas não necessário aqui)
        // window.addEventListener('popstate', this.renderBreadcrumb.bind(this));
    }

    renderBreadcrumb() {
        const breadcrumbList = this.shadowRoot.querySelector('.breadcrumb-list');
        if (!breadcrumbList) return;

        let path = [];
        const currentPath = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        // Sempre começa com Home
        path.push({ name: 'Home', href: '../pages/index.html' }); // Ajuste para index.html em pages

        // Lógica para páginas de categoria (vestido-longo, vestido-curto, etc.)
        if (currentPath.includes('/pages/vestido-longo.html')) {
            path.push({ name: 'Vestido Longo', href: '../pages/vestido-longo.html' });
        } else if (currentPath.includes('/pages/vestido-curto.html')) {
            path.push({ name: 'Vestido Curto', href: '../pages/vestido-curto.html' });
        } else if (currentPath.includes('/pages/vestido-midi.html')) {
            path.push({ name: 'Vestido Midi', href: '../pages/vestido-midi.html' });
        } else if (currentPath.includes('/pages/mais-vendidos.html')) {
            path.push({ name: 'Mais Vendidos', href: '../pages/mais-vendidos.html' });
        }
        
        // Lógica para página de produto
        if (currentPath.includes('/pages/produto.html') && productId && window.productsData) {
            const product = window.productsData.find(p => p.id === productId);
            if (product) {
                // Adiciona a categoria do produto (se houver e não for já o item anterior)
                if (product.category && !path.some(item => item.name.toLowerCase().includes(product.category.replace('vestido-', '')))) {
                    // Cuidado: aqui precisamos do link correto para a categoria.
                    // Podemos inferir o link da categoria a partir do nome.
                    const categoryLink = `../pages/${product.category}.html`;
                    path.push({ name: this._capitalizeWords(product.category.replace('-', ' ')), href: categoryLink });
                }
                path.push({ name: product.name, href: window.location.href }); // Link para a própria página de produto
            }
        }

        // Constrói o HTML do breadcrumb
        breadcrumbList.innerHTML = path.map((item, index) => {
            const isLast = index === path.length - 1;
            return `
                <li class="breadcrumb-item ${isLast ? 'active' : ''}">
                    ${isLast ? 
                        `<span>${item.name}</span>` : 
                        `<a href="${item.href}">${item.name}</a>`
                    }
                    ${!isLast ? '<span class="separator">&gt;</span>' : ''}
                </li>
            `;
        }).join('');
    }

    // Função auxiliar para capitalizar palavras (ex: "vestido longo" -> "Vestido Longo")
    _capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }
}

customElements.define('app-breadcrumb', AppBreadcrumb);