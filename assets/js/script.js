/*
document.addEventListener('DOMContentLoaded', function() {

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
              
                
                
                cardWidth = cards[0].getBoundingClientRect().width; 
                
               
                
            } else {
                cardWidth = 0;
            }

            
            const itemSpacing = parseFloat(window.getComputedStyle(track).gap) || 0; 
            totalScrollableWidth = (cardWidth + itemSpacing) * cards.length - (cardsToShow * (cardWidth + itemSpacing));
            scrollAmount = cardsToShow * (cardWidth + itemSpacing);

            
            totalScrollableWidth = Math.max(0, totalScrollableWidth);
            
            track.style.transform = 'translateX(0)';
            currentPosition = 0;
        }

        function moveNext() {
            
            const maxScrollPosition = -(totalScrollableWidth);
            if (currentPosition > maxScrollPosition) {
                currentPosition = Math.max(currentPosition - scrollAmount, maxScrollPosition);
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
*/