import {CARDS_ID, COLS, NUMBER_CARDS, NUMBER_ID, NUMBER_REPETITIONS, ROWS} from "./config.js";
import {Card} from "./Card.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("MainGame");
    }

    listBackCards = [];
    listGameCards = [];
    preload = () => {
        this.load.image("bg", "assets/img/back/back.jpg");
        this.load.image("card", "assets/img/cards/wrapper_card.png");

        for (let i = 0; i < NUMBER_CARDS / 2; i++) {
            this.load.image("card" + (i + 1), "assets/img/cards/card_" + (i + 1) + ".png");
        }
    }
    create = () => {
        this.createBg();
        this.createCards();
    }

    createBg() {
        const bg = this.add.sprite(0, 0, "bg");
        bg.setOrigin(0, 0);
    }

    createCards() {
        const position = this.getCardsPositions();
        for (let i = 0; i < NUMBER_CARDS; i++) {
            const card = new Card(this, position[i].x, position[i].y);
            this.listBackCards.push(card);
        }

        let numberCard = 0;
        this.shuffle();
        for (let i = 0; i < NUMBER_ID; i++) {
            for (let j = 0; j < NUMBER_REPETITIONS; j++) {
                const card = new Card(this, position[numberCard].x, position[numberCard].y, "card" + CARDS_ID.pop());
                this.listGameCards.push(card);
                numberCard++;
            }
        }
    }

    getCardsPositions = () => {
        const retreat = 20;
        const positions = [];
        const cardTexture = this.textures.get("card").getSourceImage();
        const cardWidth = cardTexture.width + retreat;
        const cardHeight = cardTexture.height + retreat;
        const offsetX = (this.sys.game.config.width - cardWidth * COLS) / 2;
        const offsetY = (this.sys.game.config.height - cardHeight * ROWS) / 2;

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const position = {
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                };
                positions.push(position);
            }
        }

        return positions;
    }

    random(n) {
        return Math.floor(Math.random() * Math.floor(n));
    }

    shuffle () {
        CARDS_ID.sort(() => Math.round(Math.random() * 100) - 50);
    }
}
