function getSiblings (element) {
    // for collecting siblings
    let siblings = [];
    // if no parent, return no sibling
    if(!element.parentNode) {
        return siblings;
    }
    // first child of the parent node
    let sibling  = element.parentNode.firstChild;

    // collecting siblings
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== element) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
};

class FlashCardSide {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;

        this.element = document.createElement("div");
        this.element.setAttribute('class', 'flashcard-piece');
        this.element.innerHTML =
            `<h5 class="card-title">${name}</h5>\n` +
            ` <p class="card-text">${desc}</p>`
    }

    changeNameDesc(name, desc) {
        this.name = name;
        this.desc = desc;
    }
    changeToInput() {
        this.element.innerHTML =
            `<h3 class="side-title">Side</h3>\n` +
            `<h5 class="card-title" contenteditable="true">Name</h5>\n` +
            ` <p class="card-text" contenteditable="true">Description</p>`
        return this;
    }
}
class FlashCard {
    constructor(cardSetName, frontName, frontDesc, backName, backDesc) {
        this.cardset = db.CardSets[cardSetName];
        this.frontName = frontName;
        this.frontDesc = frontDesc;
        this.backName = backName;
        this.backDesc = backDesc;

        this.front = new FlashCardSide(frontName, frontDesc);
        this.front.element.classList.add("card-body");

        this.back = new FlashCardSide(backName, backDesc);
        this.back.element.classList.add("card-flipside");

        this.card = document.createElement("div");
        this.card.setAttribute("class", "card flashcard");

        this.inner = document.createElement("div");
        this.inner.setAttribute("class", "flashcard-inner");
        this.card.appendChild(this.inner);

        this.inner.appendChild(this.front.element);
        this.inner.appendChild(this.back.element);
        this.card.addEventListener('click', () => {
            this.flip();
        });
    }

    createId() {
        let id = Math.floor(Math.random() * 10000);
        // while (this.cardset.cardIds.includes(id)) {
        //     id = Math.floor(Math.random() * 10000);
        // }
        return id;
    }

    flip() {
        let temp = this.back;
        this.back = this.front;
        this.front = temp;
        this.front.element.classList.remove("card-flipside");
        this.front.element.classList.add("card-body");
        this.back.element.classList.add("card-flipside");
        this.back.element.classList.remove("card-body");
    }
}

class FlashCardInput {
    constructor(frontName = "", frontDesc = "", backName = "", backDesc = "") {
        this.front = new FlashCardSide(frontName, frontDesc).changeToInput();
        this.back = new FlashCardSide(backName, backDesc).changeToInput();
        this.front.element.querySelector('.side-title').innerText = "Front Side";
        this.back.element.querySelector('.side-title').innerText = "Back Side";

        this.card = document.createElement("div");
        this.card.setAttribute("class", "card flashcard");

        this.inner = document.createElement("div");
        this.inner.setAttribute("class", "flashcard-inner");
        this.card.appendChild(this.inner);

        this.inner.appendChild(this.front.element);
        this.inner.appendChild(this.back.element);

        this.buttons = document.createElement('div');
        this.inner.appendChild(this.buttons);

        this.saveButton = document.createElement("button");
        this.saveButton.setAttribute("class", "btn btn-primary flashcard-save-button");
        this.saveButton.innerText = "Save";
        this.buttons.appendChild(this.saveButton);
    }
}

class CardsetInput {
    constructor(name = "", desc = "") {
        this.front = new FlashCardSide(name, desc).changeToInput();
        this.front.element.querySelector('.side-title').innerText = "New Cardset";

        this.card = document.createElement("div");
        this.card.setAttribute("class", "card flashcard");

        this.inner = document.createElement("div");
        this.inner.setAttribute("class", "flashcard-inner");
        this.card.appendChild(this.inner);

        this.inner.appendChild(this.front.element);

        this.buttons = document.createElement('div');
        this.inner.appendChild(this.buttons);

        this.saveButton = document.createElement("button");
        this.saveButton.setAttribute("class", "btn btn-primary flashcard-save-button");
        this.saveButton.innerText = "Save";
        this.buttons.appendChild(this.saveButton);
    }
}

class CardSet {
    constructor(setName, desc, id) {
        this.id = id;
        this.name = setName;
        this.desc = desc;
        this.infoCard = document.createElement("div");
        this.infoCard.setAttribute("class", "card cardset-info");
        this.infoCard.setAttribute("id",
            `${setName.toLowerCase().replace(/[\s_]+/g, "-")}`);
        this.infoCard.innerHTML =
            '<div class="card-body">\n' +
            `  <h5 class="card-title">${setName}</h5>\n` +
            `  <p class="card-text">${desc}</p>\n` +
            '  <button type="button" class="btn btn-primary learn-btn">Learn</button>\n' +
            '  <button type="button" class="btn btn-primary edit-btn">Edit</button>\n' +
            '  <button type="button" class="btn btn-primary add-to-set-btn">Add</button>\n' +
            '</div>'

        this.cardIds = [];
        this.cards = [];

        this.infoCard.querySelector('.learn-btn').addEventListener('click', () => {
            this.learn();
        });
        console.log(this.infoCard)

        this.infoCard.querySelector('.edit-btn').addEventListener('click', () => {
            this.edit();
        });

        this.infoCard.querySelector('.add-to-set-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            this.initAdd();

        });
    }

    async learn() {
        this.select();
        let cardCont = document.querySelector(".card-view-wrapper");
        cardCont.innerHTML = '';

        const req = {
            setName: this.name
        }

        const response = await fetch('/api/cards', {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(req),
        });
        console.log(response);
        if (this.cards.length === 0) {
            alert("This set is empty. Please add cards.");
            return;
        }
        let cardCarousel = new HorizontalCarousel("learn-carousel");

        let i = 0;
        for (let card of this.cards) {
            let cardCopy = Object.assign({}, card);
            console.log(cardCopy);
            cardCopy.card.classList.add('carousel-item');
            if (i===0)
                cardCopy.card.classList.add('active');
            cardCarousel.querySelector('.carousel-inner').appendChild(cardCopy.card);
            i++;
        }
        cardCont.appendChild(cardCarousel);
    }

    edit() {
        this.select();
        let cardCont = document.querySelector(".card-view-wrapper");
        cardCont.innerHTML = '';
        if (this.cards.length === 0) {
            alert("This set is empty. Please add cards.");
            return;
        }
        let cardCarousel = new HorizontalCarousel("learn-carousel");

        let i = 0;
        for (let card of this.cards) {
            // let cardCopy = Object.assign({}, card);
            let cardCopy = new FlashCardInput(
                card.frontName,
                card.frontDesc,
                card.backName,
                card.backDesc
            )

            console.log(cardCopy);
            cardCopy.card.classList.add('carousel-item');
            cardCopy.card.appendChild

            let deleteButton = document.createElement("button");
            deleteButton.setAttribute("class", "btn btn-danger flashcard-save-button");
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener('click', () => {
                this.delete(card.id);
            })

            cardCopy.buttons.appendChild(deleteButton);

            if (i===0)
                cardCopy.card.classList.add('active');
            cardCarousel.querySelector('.carousel-inner').appendChild(cardCopy.card);
            i++;
        }
        cardCont.appendChild(cardCarousel);
    }

    initAdd() {
        console.log("In CardSet.initAdd()")
        this.select();
        let createCardCont = document.querySelector(".card-view-wrapper");
        createCardCont.innerHTML = '';

        let cardInput = new FlashCardInput();
        createCardCont.appendChild(cardInput.card);
        cardInput.saveButton.addEventListener("click", async () => {
            let card = new FlashCard(
                this.name,
                cardInput.front.element.querySelector('.card-title').innerText,
                cardInput.front.element.querySelector('.card-text').innerText,
                cardInput.back.element.querySelector('.card-title').innerText,
                cardInput.back.element.querySelector('.card-text').innerText,
            )
            const response = await this.add(card);
            console.log(response);
        })

    }

    select() {
        let siblings = getSiblings(this.infoCard);
        for (let sibling of siblings) {
            sibling.classList.remove('selected-cardset');
        }
        this.infoCard.classList.add('selected-cardset');
    }

    async add(card) {
        const response = await fetch('/api/card', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(card),
          });
        return response;
    }
}

class VerticalCardCarousel {
    constructor(containerSelector, cardSelector, scrollSpeed, cardSets) {
        // Get references to the container and card elements
        this.container = document.querySelector(containerSelector);
        this.carousel = document.createElement("div");
        this.carousel.setAttribute("class", "carousel")
        // this.container.appendChild(this.carousel);

        console.log(cardSets);

        for (let cardset of Object.values(cardSets)) {
            // this.carousel.appendChild(cardset.infoCard);
            this.container.appendChild(cardset.infoCard);
        }
        this.cards = this.container.querySelectorAll(cardSelector);
        console.log(this.cards);
        // this.cards.addEventListener('click', () => {
        //     console.log('click');
        // })

        // Set the scroll speed
        this.scrollSpeed = scrollSpeed;

        // Calculate the total height of the carousel
        this.carouselHeight = this.container.scrollHeight - this.container.clientHeight;

        // Set up the animation interval
        this.intervalId = null;
        this.intervalDelay = 20; // Delay between each animation frame (in milliseconds)

        // this.container.addEventListener('click', function(event) {
        //     console.log(event.target)
        //     event.stopPropagation();
        //     if (event.target.classList.contains('btn')) {
        //         let event = new MouseEvent('click', {
        //             bubbles: true,
        //             cancelable: true,
        //             view: window
        //         });
        //
        //         event.target.dispatchEvent(event);
        //     }
        // })
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

function HorizontalCarousel(id, dark = true) {
    let carousel = document.createElement('div');
    carousel.setAttribute('class', 'carousel slide flashcard');
    carousel.setAttribute('id', id);
    carousel.setAttribute('data-bs-interval', false);
    if (dark)
        carousel.classList.add('carousel-dark');
    carousel.innerHTML =
        "<div class=\"carousel-inner\">\n" +
        "</div>\n" +
        `  <button class=\"carousel-control-prev\" type=\"button\" data-bs-target=\"#${id}\" data-bs-slide=\"prev\">\n` +
        "    <span class=\"carousel-control-prev-icon\" aria-hidden=\"true\"></span>\n" +
        "    <span class=\"visually-hidden\">Previous</span>\n" +
        "  </button>\n" +
        `  <button class=\"carousel-control-next\" type=\"button\" data-bs-target=\"#${id}\" data-bs-slide=\"next\">\n` +
        "    <span class=\"carousel-control-next-icon\" aria-hidden=\"true\"></span>\n" +
        "    <span class=\"visually-hidden\">Next</span>\n" +
        "  </button>"
    return carousel
}
function login(name) {
    //Login Function
    console.log(name);
    $('#login-div').toggleClass('d-none', true);
    $('#home-cards-div').toggleClass('d-none', false);
}

class Database {
    constructor() {
        this.CardSets = {};
        // this.CardSetIds = [];
        let name, desc;
        for (let i = 1; i < 5; i++) {
            name = `Set ${i}`;
            desc = `Description of Set ${i}`;
            this.CardSets[`Set ${i}`] = new CardSet(name, desc);
            // this.CardSetIds.push(this.CardSets[`Set ${i}`].id);
        }
    }
}

async function getCardsets() {
    const response = await fetch('/api/cardsets', {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    });
    console.log(response);
    if (!response.ok) {
        document.getElementById('card-creation-carousel-wrapper').innerHTML = "<p style='margin-top: 50%;'>No Cardsets Yet!</p>";
        return;
    }
    let cardSets = [];
    let name, desc;
    for (let set of response.body) {
        name = set.name;
        desc = set.desc;
        cardSets.push(new CardSet(name, desc))
    }

    const carousel = new VerticalCardCarousel(
        "#card-creation-carousel-wrapper",
        ".card",
        2,
        cardSets
    );

    return cardSets;
}

async function initAddCardset() {
    const cardSets = await getCardsets();
    let input = new CardsetInput();
    let createCardCont = document.querySelector(".card-view-wrapper");
    createCardCont.innerHTML = '';

    createCardCont.appendChild(input.card);
    input.saveButton.addEventListener("click", async () => {
        let card = new FlashCard(
            this.name,
            input.front.element.querySelector('.card-title').innerText,
            input.front.element.querySelector('.card-text').innerText,
        )
        let name = input.front.element.querySelector('.card-title').innerText;
        let desc = input.front.element.querySelector('.card-text').innerText;
        const response = await this.addCardset(name, desc);
        console.log(response);
    })
}

async function addCardset(name, desc) {
    const response = await fetch('/api/cardset', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({setName: name, desc: desc})
    });
}

function initRemoveCardset() {
    sets = document.querySelectorAll(".cardset-info");
    console.log(sets);
}
