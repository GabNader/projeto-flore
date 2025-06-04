// assets/js/script.js

document.addEventListener('DOMContentLoaded', function() {
    // A lógica de menu lateral e carrinho agora é gerenciada pelos componentes
    // (app-header.js e app-menu.js, e app-cart.js se criado)
    // e se comunicam via Custom Events.

    // Seu código do carrossel permanece aqui
    const track = document.querySelector('.carousel-track');
    const nextButton = document.querySelector('.carousel-button-next');
    const prevButton = document.querySelector('.carousel-button-prev');

    if (track && nextButton && prevButton) {
        const cards = Array.from(track.children);
        let cardsToShow;
        let cardWidth;
        let totalScrollableWidth;
        let scrollAmount;
        let currentPosition = 0;

        function calculateCarouselDimensions() {
            if (window.innerWidth >= 1920) {
                cardsToShow = 8;
            } else if (window.innerWidth >= 1400) {
                cardsToShow = 6;
            } else if (window.innerWidth >= 1024) {
                cardsToShow = 5;
            } else if (window.innerWidth >= 768) {
                cardsToShow = 4;
            } else if (window.innerWidth >= 580) {
                cardsToShow = 3;
            } else {
                cardsToShow = 2;
            }

            if (cards.length > 0) {
                cardWidth = cards[0].getBoundingClientRect().width + 10;
            } else {
                cardWidth = 0;
            }

            totalScrollableWidth = cardWidth * cards.length - (cardsToShow * cardWidth);
            scrollAmount = cardsToShow * cardWidth;

            track.style.transform = 'translateX(0)';
            currentPosition = 0;
        }

        function moveNext() {
            if (currentPosition > -totalScrollableWidth) {
                currentPosition = Math.max(currentPosition - scrollAmount, -totalScrollableWidth);
                track.style.transform = `translateX(${currentPosition}px)`;
            }
        }

        function movePrev() {
            if (currentPosition < 0) {
                currentPosition = Math.min(currentPosition + scrollAmount, 0);
                track.style.transform = `translateX(${currentPosition}px)`;
            }
        }

        nextButton.addEventListener('click', moveNext);
        prevButton.addEventListener('click', movePrev);
        window.addEventListener('resize', calculateCarouselDimensions);

        calculateCarouselDimensions();
    }
});