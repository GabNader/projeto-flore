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
    }

    renderBreadcrumb() {
        const breadcrumbList = this.shadowRoot.querySelector('.breadcrumb-list');
        if (!breadcrumbList) return;

        let path = [];
        const currentPath = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        path.push({ name: 'Home', href: '../pages/index.html' });

        if (currentPath.includes('/pages/vestido-longo.html')) {
            path.push({ name: 'Vestido Longo', href: '../pages/vestido-longo.html' });
        } else if (currentPath.includes('/pages/vestido-curto.html')) {
            path.push({ name: 'Vestido Curto', href: '../pages/vestido-curto.html' });
        } else if (currentPath.includes('/pages/vestido-midi.html')) {
            path.push({ name: 'Vestido Midi', href: '../pages/vestido-midi.html' });
        } else if (currentPath.includes('/pages/mais-vendidos.html')) {
            path.push({ name: 'Mais Vendidos', href: '../pages/mais-vendidos.html' });
        }
        
        if (currentPath.includes('/pages/produto.html') && productId && window.productsData) {
            const product = window.productsData.find(p => p.id === productId);
            if (product) {
                if (product.category && !path.some(item => item.name.toLowerCase().includes(product.category.replace('vestido-', '')))) {
                    const categoryLink = `../pages/${product.category}.html`;
                    path.push({ name: this._capitalizeWords(product.category.replace('-', ' ')), href: categoryLink });
                }
                path.push({ name: product.name, href: window.location.href });
            }
        }

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

    _capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }
}

customElements.define('app-breadcrumb', AppBreadcrumb);