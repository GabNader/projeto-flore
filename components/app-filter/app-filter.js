// components/app-filter/app-filter.js

class AppFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../components/app-filter/app-filter.css">
            <div class="filter-overlay"></div>
            <aside class="filter-sidebar">
                <div class="filter-header">
                    <button class="close-filter-btn">
                        <img src="../assets/imagens/svg/close.svg" alt="Fechar Filtros">
                    </button>
                    <h2>FILTROS</h2>
                    <button class="clear-filters-btn">Limpar</button>
                </div>
                <div class="filter-sections">

                    <div class="filter-group" data-filter-type="sizes">
                        <h3>Tamanho</h3>
                        <div class="filter-options-grid">
                            <label><input type="checkbox" name="size" value="P"><span>P</span></label>
                            <label><input type="checkbox" name="size" value="M"><span>M</span></label>
                            <label><input type="checkbox" name="size" value="G"><span>G</span></label>
                            <label><input type="checkbox" name="size" value="GG"><span>GG</span></label>
                        </div>
                    </div>
                    
                    <div class="filter-group" data-filter-type="price">
                        <h3>Preço</h3>
                        <div class="filter-options-grid">
                            <label><input type="checkbox" name="price" value="0-400"><span>Até R$</span></label>
                            <label><input type="checkbox" name="price" value="400-500"><span>R$201 - R$500</span></label>
                            <label><input type="checkbox" name="price" value="501-1000"><span>R$501 - R$1000</span></label>
                            <label><input type="checkbox" name="price" value="1001-9999"><span>Acima de R$1000</span></label>
                        </div>
                    </div>

                    <div class="filter-group" data-filter-type="colors">
                        <h3>Cor</h3>
                        <div class="filter-options-grid">
                            <label><input type="checkbox" name="color" value="Vermelho"><span>Vermelho</span></label>
                            <label><input type="checkbox" name="color" value="Azul"><span>Azul</span></label>
                            <label><input type="checkbox" name="color" value="Preto"><span>Preto</span></label>
                            <label><input type="checkbox" name="color" value="Lilás"><span>Lilás</span></label>
                            <label><input type="checkbox" name="color" value="Branco"><span>Branco</span></label>
                            <label><input type="checkbox" name="color" value="Verde"><span>Verde</span></label>
                            <label><input type="checkbox" name="color" value="Amarelo"><span>Amarelo</span></label>
                            <label><input type="checkbox" name="color" value="Rosa"><span>Rosa</span></label>
                            <label><input type="checkbox" name="color" value="Roxo"><span>Roxo</span></label>
                            <label><input type="checkbox" name="color" value="Estampado"><span>Estampado</span></label>
                            <label><input type="checkbox" name="color" value="Floral"><span>Floral</span></label>
                            <label><input type="checkbox" name="color" value="Xadrez"><span>Xadrez</span></label>
                            <label><input type="checkbox" name="color" value="Onça"><span>Onça</span></label>
                            <label><input type="checkbox" name="color" value="Colorido"><span>Colorido</span></label>
                            <label><input type="checkbox" name="color" value="Tropical"><span>Tropical</span></label>
                        </div>
                    </div>
                </div>
                <div class="filter-actions">
                    <button class="apply-filters-btn">APLICAR FILTROS</button>
                </div>
            </aside>
        `;
    }

    connectedCallback() {
        const filterOverlay = this.shadowRoot.querySelector('.filter-overlay');
        const filterSidebar = this.shadowRoot.querySelector('.filter-sidebar');
        const closeFilterBtn = this.shadowRoot.querySelector('.close-filter-btn');
        const applyFiltersBtn = this.shadowRoot.querySelector('.apply-filters-btn');
        const clearFiltersBtn = this.shadowRoot.querySelector('.clear-filters-btn');

        const closeFilterSidebar = () => {
            filterSidebar.classList.remove('active');
            filterOverlay.classList.remove('active');
            this.dispatchEvent(new CustomEvent('filterSidebarClosed', { bubbles: true, composed: true }));
        };

        if (closeFilterBtn) {
            closeFilterBtn.addEventListener('click', closeFilterSidebar);
        }
        if (filterOverlay) {
            filterOverlay.addEventListener('click', closeFilterSidebar);
        }

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                const selectedFilters = this._collectSelectedFilters();
                this.dispatchEvent(new CustomEvent('filtersApplied', {
                    detail: selectedFilters,
                    bubbles: true,
                    composed: true
                }));
                closeFilterSidebar();
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.shadowRoot.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });
                this.dispatchEvent(new CustomEvent('filtersCleared', {
                    bubbles: true,
                    composed: true
                }));
                closeFilterSidebar();
            });
        }

        window.addEventListener('openFilterSidebar', () => {
            filterSidebar.classList.add('active');
            filterOverlay.classList.add('active');
            window.dispatchEvent(new CustomEvent('closeMenu', { bubbles: true, composed: true }));
        });
    }

    _collectSelectedFilters() {
        const filters = {};
        this.shadowRoot.querySelectorAll('.filter-group[data-filter-type]').forEach(group => {
            const filterType = group.dataset.filterType;
            const selectedValues = Array.from(group.querySelectorAll('input[type="checkbox"]:checked'))
                                       .map(checkbox => checkbox.value);
            
            if (filterType === 'price' && selectedValues.length > 0) {
                filters[filterType] = selectedValues.map(range => {
                    const parts = range.split('-');
                    return {
                        min: parseFloat(parts[0]) || 0,
                        max: parseFloat(parts[1]) || Infinity
                    };
                });
            } else if (selectedValues.length > 0) {
                filters[filterType] = selectedValues;
            }
        });
        return filters;
    }
}

customElements.define('app-filter', AppFilter);