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
}

async function getCardsets() {
    document.getElementById('card-creation-carousel-wrapper').innerHTML = '';
    const response = await fetch('/api/cardsets', {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    if (!data) {
        document.getElementById('card-creation-carousel-wrapper').innerHTML = "<p style='margin-top: 50%;'>No Cardsets Yet!</p>";
        return [];
    }
    
    
    let cardSets = [];
    let name, desc, id;
    for (let set of data) {
        name = set.name;
        desc = set.desc;
        id = set._id;
        cardSets.push(new CardSet(name, desc, id))
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
        const response = await addCardset(name, desc);
        initAddCardset();
    })
}

async function addCardset(name, desc) {
    const response = await fetch('/api/cardset', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ setName: name, desc: desc })
    });
    await getCardsets();
    const data = await response.json();
    return data;
}

async function initRemoveCardset() {
    // let sets = document.querySelectorAll(".cardset-info");
    document.querySelector('.card-view-wrapper').innerHTML = "";
    let sets = await getCardsets();
    let btn;
    for (let set of sets) {
        btn = document.createElement('button');
        btn.setAttribute('class', 'btn btn-danger remove-from-set-btn');
        btn.setAttribute('set-id', set.id);
        btn.innerText = "Delete";
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute('set-id');
            const response = await removeCardset(id);
            await getCardsets();
            initRemoveCardset();
        });
        set.infoCard.querySelector('.card-body').appendChild(btn);
    }
}

async function removeCardset(id) {
    const response = await fetch('/api/cardset', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: id })
    });

    const data = await response.json();
    return data;
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
        if (cardSets.length == 0)
            this.container.innerHTML = "<p style='margin-top: 50%;'>No Cardsets Yet!</p>";
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

    configureWebSocket() {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        this.socket.onopen = (event) => {
          this.displayMsg('system', 'game', 'connected');
        };
        this.socket.onclose = (event) => {
          this.displayMsg('system', 'game', 'disconnected');
        };
        this.socket.onmessage = async (event) => {
          const msg = JSON.parse(await event.data.text());
          if (msg.type === GameEndEvent) {
            this.displayMsg('player', msg.from, `scored ${msg.value.score}`);
          } else if (msg.type === GameStartEvent) {
            this.displayMsg('player', msg.from, `started a new game`);
          }
        };
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

    async getCards() {
        const response = await fetch(`/api/cards?setid=${this.id}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
            // body: JSON.stringify(req),
        });
        return response;
    }

    async learn() {
        this.select();
        let cardCont = document.querySelector(".card-view-wrapper");
        cardCont.innerHTML = '';

        const req = {
            setName: this.name
        }

        const response = await this.getCards();
        const data = await response.json();
        console.log(data);
        this.cards = [];
        for (let card of data) {
            this.cards.push(new FlashCard(
                this.name,
                card.frontName,
                card.frontDesc,
                card.backName,
                card.backDesc,
                card._id,
            ));
        }
        if (this.cards.length === 0) {
            alert("This set is empty. Please add cards.");
            return;
        }
        let cardCarousel = new HorizontalCarousel("learn-carousel");

        let i = 0;
        for (let card of this.cards) {
            let cardCopy = Object.assign({}, card);
            cardCopy.card.classList.add('carousel-item');
            if (i===0)
                cardCopy.card.classList.add('active');
            cardCarousel.querySelector('.carousel-inner').appendChild(cardCopy.card);
            i++;
        }
        cardCont.appendChild(cardCarousel);
    }

    async edit() {
        this.select();
        await this.learn();
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
                card.backDesc,
                card.id
            )

            cardCopy.card.classList.add('carousel-item');
            cardCopy.card.appendChild

            let deleteButton = document.createElement("button");
            deleteButton.setAttribute("class", "btn btn-danger flashcard-save-button");
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener('click', async () => {
                const data = await this.delete(card.id);
                console.log(data);
                this.edit();
            })

            cardCopy.buttons.appendChild(deleteButton);

            cardCopy.saveButton.addEventListener('click', async () => {
                let attr = {
                    setName: this.name,
                    frontName: cardCopy.front.element.querySelector('.card-title').innerText,
                    frontDesc: cardCopy.front.element.querySelector('.card-text').innerText,
                    backName: cardCopy.back.element.querySelector('.card-title').innerText,
                    backDesc: cardCopy.back.element.querySelector('.card-text').innerText,
                    _setid: this.id,
                    id: card.id
                }
                console.log(attr);
                const data = await this.update(attr);
                console.log(data);
                this.edit();
            });

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
            let card = {
                setName: this.name,
                frontName: cardInput.front.element.querySelector('.card-title').innerText,
                frontDesc: cardInput.front.element.querySelector('.card-text').innerText,
                backName: cardInput.back.element.querySelector('.card-title').innerText,
                backDesc: cardInput.back.element.querySelector('.card-text').innerText,
                _setid: this.id
            }
            this.initAdd();
            const response = await this.add(card);
            const data = await response.json();
            console.log(data);
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

    async delete(id) {
        const data = await this.request('DELETE', { id: id })
        return data;
    }

    async update(card) {
        const data = await this.request('PUT', card);
        return data
    }

    async request(method, body) {
        const response = await fetch('/api/card', {
            method: method,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body)
        })
        const data = await response.json();
        return data
    }
}
