class AppFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../components/app-footer/app-footer.css">
            <footer>
                <div class="footer-top">
                    <div class="footer-section about-us">
                        <h3>Sobre a Floré</h3>
                        <p>A Floré é um e-commerce de vestidos inspirados na essência tropical do Brasil. Nossas peças combinam tecidos fluidos, estampas vibrantes e cortes elegantes, perfeitos para quem ama leveza e sofisticação. O nome Floré simboliza o ato de florescer, refletindo a beleza natural e autêntica de cada mulher. Descubra vestidos que traduzem o calor do verão e a alegria brasileira. Acesse nosso site e floresça com a gente!</p>
                    </div>

                    <div class="footer-section team">
                        <h3>Equipe</h3>
                        <p>Gabriel Nader Marini</p>
                        <p>Izadora de Souza</p>
                        <p>Johann Michael Mignoni da Silva</p>
                        <p>Larissa dos Santos</p>
                        <p>Letícia de Abreu</p>
                    </div>

                    <div class="footer-section refs">
                        <h3>Referências</h3>
                        <p><a href="https://www.farmrio.com.br/" target="_blank" rel="noopener noreferrer">Farm Rio</a></p>
                        <p><a href="https://br.pinterest.com/pin/77968637294487830/" target="_blank" rel="noopener noreferrer">Paleta de Cores Pinterest</a></p>
                        <p><a href="https://icons.mono.company/" target="_blank" rel="noopener noreferrer">Ícones SVG</a></p>
                    </div>

                    <div class="footer-section quick-links">
                        <h3>Links Rápidos</h3>
                        <ul>
                            <li><a href="../pages/vestido-longo.html">Vestidos Longos</a></li>
                            <li><a href="../pages/vestido-curto.html">Vestidos Curtos</a></li>
                            <li><a href="../pages/vestido-midi.html">Vestidos Midi</a></li>
                            <li><a href="../pages/mais-vendidos.html">Mais Vendidos</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy 2025 Floré. Todos os direitos reservados.</p>
                    <div class="social-links">
                        <a href="#" aria-label="Instagram"><img src="../assets/imagens/svg/instagram.svg" alt="Instagram"></a>
                        <a href="#" aria-label="Facebook"><img src="../assets/imagens/svg/facebook.svg" alt="Facebook"></a>
                    </div>
                </div>

            </footer>
        `;
    }
}

customElements.define('app-footer', AppFooter);