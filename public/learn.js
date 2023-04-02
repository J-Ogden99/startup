let db;
document.addEventListener('DOMContentLoaded', function() {
    db = new Database();

    const carousel = new VerticalCardCarousel(
        "#card-creation-carousel-wrapper",
        ".card",
        2
    );
    // carousel.start();

});