document.addEventListener('DOMContentLoaded', function() {

    const openFilterBtn = document.querySelector('.open-filter-btn');

    if (openFilterBtn) {
        openFilterBtn.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('openFilterSidebar', { bubbles: true, composed: true }));
        });
    }

});
