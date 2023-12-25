import {CARDS_ID, COLS, NUMBER_CARDS, NUMBER_ID, NUMBER_REPETITIONS, ROWS} from "./config.js";
import {Card} from "./Card.js";
import setAnimationTimeout from "./utils.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("MainGame");
    }

    openCards = [];
    listGameCards = [];
    numberOpenCards = 0;
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
        let numberCard = 0;
        this.shuffle();
        for (let i = 0; i < NUMBER_ID; i++) {
            for (let j = 0; j < NUMBER_REPETITIONS; j++) {
                const card = new Card(this, position[numberCard].x, position[numberCard].y, CARDS_ID.pop());
                this.listGameCards.push(card);
                numberCard++;
            }
        }

        this.addEventCards();
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
                    x: offsetX + col * cardWidth + 175,
                    y: offsetY + row * cardHeight + 175,
                };
                positions.push(position);
            }
        }

        return positions;
    }

    random(n) {
        return Math.floor(Math.random() * Math.floor(n));
    }

    shuffle() {
        CARDS_ID.sort(() => Math.round(Math.random() * 100) - 50);
    }

    async addEventCards() {
        this.listGameCards.forEach(card => {
            card.on("pointerdown", async () => {
                //card.open();
                this.flipCardAnimationOpen(card);
                this.openCards.push(card);
                if (this.openCards.length > 1) {
                    if (this.openCards[0].value !== this.openCards[1].value) {
                        this.disableInteractiveCard();
                        await setAnimationTimeout(800);
                        this.closeAnimationCard(this.openCards[0]);
                        this.closeAnimationCard(this.openCards[1]);
                        this.openCards.length = 0;

                    } else {
                        this.openCards[0].isOpen = true;
                        this.openCards[1].isOpen = true;

                        this.disableInteractiveCard();
                        await setAnimationTimeout(800);
                        this.enableInteractiveCard();
                        this.openCards.length = 0;
                        this.numberOpenCards++;
                        if (this.numberOpenCards === NUMBER_ID) {
                            await setAnimationTimeout(800);
                            this.enableInteractiveCard();
                            this.winn();
                        }
                    }
                }
            })
        })
    }

    winn() {
        this.listGameCards.forEach(card => {
            card.isOpen = false;
            this.closeAnimationCard(card);
        });
    }

    disableInteractiveCard() {
        this.listGameCards.forEach(card => {
            card.disableInteractive();
        });
    }

    enableInteractiveCard() {
        this.listGameCards.forEach(card => {
            if (!card.isOpen) card.setInteractive();
        });
    }

    async flipCardAnimationOpen(el) {
        el.scene.tweens.add({
            targets: el,
            props: {
                scaleX: { value: 0, duration: 150, yoyo: true },
                texture: { value: "card" + el.value, duration: 0, delay: 150 }
            },
            ease: 'Linear'
        })

    }

    closeAnimationCard(el) {
        const tween = el.scene.tweens.add({
            targets: el,
            props: {
                scaleX: { value: 0, duration: 150, yoyo: true },
                texture: { value: "card", duration: 0, delay: 150 }
            },
            ease: 'Linear',

            onComplete: () => {
                el.setInteractive();
                this.enableInteractiveCard();
            }
        })
    }
}
