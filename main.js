class CardSet {
    constructor(setName, desc) {
        this.name = setName;
        this.desc = desc;
        this.infoCard = document.createElement("div");
        this.infoCard.setAttribute("class", "card");
        this.infoCard.setAttribute("id",
            `${setName.toLowerCase().replace(/[\s_]+/g, "-");}`);
        this.infoCard.innerHTML =
            '<div class="card-body">\n' +
            `  <h5 class="card-title">${setName}</h5>\n` +
            `  <p class="card-text">${desc}</p>\n` +
            '  <a href="#" class="btn btn-primary">Learn</a>\n' +
            '  <a href="#" class="btn btn-primary">Edit</a>\n' +
            '</div>'

    }
}

class VerticalCardCarousel {
    constructor(containerSelector, cardSelector, scrollSpeed) {
        // Get references to the container and card elements
        this.container = document.querySelector(containerSelector);
        this.carousel = document.createElement("div");
        this.carousel.setAttribute("class", "carousel")
        this.container.appendChile(this.carousel);
        this.cards = this.container.querySelectorAll(cardSelector);

        // Set the scroll speed
        this.scrollSpeed = scrollSpeed;

        // Calculate the total height of the carousel
        this.carouselHeight = this.container.scrollHeight - this.container.clientHeight;

        // Set up the animation interval
        this.intervalId = null;
        this.intervalDelay = 20; // Delay between each animation frame (in milliseconds)
    }

    start() {
        // Add a "wheel" event listener to the container element
        this.container.addEventListener("wheel", (event) => {
            // Prevent the default scrolling behavior
            event.preventDefault();

            // Calculate the new scroll position
            const newScrollTop = this.container.scrollTop + event.deltaY;

            // Check if we have reached the top or bottom of the carousel
            if (newScrollTop < 0) {
                // If we have reached the top, set the scroll position to 0
                this.container.scrollTop = 0;
            } else if (newScrollTop > this.carouselHeight) {
                // If we have reached the bottom, set the scroll position to the maximum
                this.container.scrollTop = this.carouselHeight;
            } else {
                // Otherwise, scroll to the new position
                this.container.scrollTop = newScrollTop;
            }
        });
    }

    stop() {
        // Stop the animation interval
        clearInterval(this.intervalId);
    }
}

// Usage example:
const carousel = new VerticalCardCarousel(".carousel-container", ".card", 2);
carousel.start();

function login(name) {
    //Login Function
    console.log(name)
    $('#login-div').toggleClass('d-none', true)
    $('#home-cards-div').toggleClass('d-none', false)
}

function createDatabase() {
    let db = {}
    db['CardSets'] = {}
    for (let i = 0; i < 5; i++) {
        name = `Set ${i}`;
        desc = `Description of Set ${i}`;
        db['CardSets'][`Set ${i}`] = new CardSet(name, desc);
    }
    return db
}

document.addEventListener('DOMContentLoaded', function() {
    let db = new createDatabase();

});



