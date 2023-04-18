export function getSiblings (element) {
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

export class FlashCardSide {
    constructor(name = "Name", desc = "Description") {
        this.name = name;
        this.desc = desc;

        this.element = document.createElement("div");
        this.element.setAttribute('class', 'flashcard-piece');
        this.element.innerHTML =
            `<h5 className="card-title">${name}</h5>\n` +
            ` <p className="card-text">${desc}</p>`
    }

    changeNameDesc(name, desc) {
        this.name = name;
        this.desc = desc;
    }
    changeToInput() {
        this.element.innerHTML =
            `<h3 className="side-title">Side</h3>\n` +
            `<h5 className="card-title" contenteditable="true">${this.name}</h5>\n` +
            ` <p className="card-text" contenteditable="true">${this.desc}</p>`
        return this;
    }
}
export class FlashCard {
    constructor(cardSetName, frontName, frontDesc, backName, backDesc, id) {
        this.cardSetName = cardSetName
        this.frontName = frontName;
        this.frontDesc = frontDesc;
        this.backName = backName;
        this.backDesc = backDesc;
        this.id = id;

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

export class FlashCardInput {
    constructor(frontName = "Name", frontDesc = "Description", backName = "Name", backDesc = "Description", id = "") {
        this.front = new FlashCardSide(frontName, frontDesc).changeToInput();
        this.back = new FlashCardSide(backName, backDesc).changeToInput();
        this.front.element.querySelector('.side-title').innerText = "Front Side";
        this.back.element.querySelector('.side-title').innerText = "Back Side";
        this.id = id;

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

export function HorizontalCarousel(id, dark = true) {
    let carousel = document.createElement('div');
    carousel.setAttribute('class', 'carousel slide flashcard');
    carousel.setAttribute('id', id);
    carousel.setAttribute('data-bs-interval', false);
    if (dark)
        carousel.classList.add('carousel-dark');
    carousel.innerHTML =
        "<div className=\"carousel-inner\">\n" +
        "</div>\n" +
        `  <button className=\"carousel-control-prev\" type=\"button\" data-bs-target=\"#${id}\" data-bs-slide=\"prev\">\n` +
        "    <span className=\"carousel-control-prev-icon\" aria-hidden=\"true\"></span>\n" +
        "    <span className=\"visually-hidden\">Previous</span>\n" +
        "  </button>\n" +
        `  <button className=\"carousel-control-next\" type=\"button\" data-bs-target=\"#${id}\" data-bs-slide=\"next\">\n` +
        "    <span className=\"carousel-control-next-icon\" aria-hidden=\"true\"></span>\n" +
        "    <span className=\"visually-hidden\">Next</span>\n" +
        "  </button>"
    return carousel
}
