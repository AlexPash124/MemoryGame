import {CARDS_ID, COLS, NUMBER_CARDS, NUMBER_ID, NUMBER_REPETITIONS, ROWS, screenConfig, WIDTH_CARD} from "./config.js";
import {Card} from "./Card.js";
import setAnimationTimeout from "./utils.js";
import {Timer} from "./Timer.js";
import {EventDispatcher} from "./Event.js";

export default class GameSceneUI extends Phaser.Scene {
    timer;

    constructor() {
        super("MainGame");
    }

    openCards = [];
    listGameCards = [];
    numberOpenCards = 0;
    soundBack;
    soundClick;
    lowWin;
    emitter;
    isFinishGame = false;
    preload = () => {
        this.load.image("bg", "assets/img/back/back.jpg");
        this.load.image("card", "assets/img/cards/wrapper_card.png");

        for (let i = 0; i < NUMBER_CARDS / 2; i++) {
            this.load.image("card" + (i + 1), "assets/img/cards/card_" + (i + 1) + ".png");
        }

        this.load.audio("back", "assets/sounds/game_back.mp3");
        this.load.audio("click", "assets/sounds/btn_click.mp3");
        this.load.audio("lowWin", "assets/sounds/low_win.mp3");
        this.load.audio("winSound", "assets/sounds/win.mp3");
    }
    create = () => {
        this.createBg();
        this.createCards();

        this.initTimer();

        this.addLoseEvent();

        this.createSounds();
    }

    createSounds() {
        this.soundBack = this.sound.add("back", {
            loop: true,
        });
        this.soundBack.play();

        this.soundClick = this.sound.add("click", {
            loop: false,
        });

        this.lowWin = this.sound.add("lowWin", {
            loop: false,
        });

        this.winSound = this.sound.add("winSound", {
            loop: false,
        });
    }

    initTimer() {
        this.timer = new Timer(this);
        this.timer.initTextTimer();
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
                    x: offsetX + col * cardWidth + WIDTH_CARD / 2,
                    y: offsetY + row * cardHeight + WIDTH_CARD / 2,
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

    addEventCards() {
        this.listGameCards.forEach(card => {
            card.on("pointerdown", async () => {
                if (this.isFinishGame) return;
                this.disableInteractiveCard();
                this.soundClick.play();
                if (!this.timer.isTimerStart) {
                    this.timer.timerStart();
                }
                this.flipCardAnimationOpen(card);
                card.isOpen = true;
                await setAnimationTimeout(500);
                this.openCards.push(card);
                if (this.openCards.length > 1) {
                    if (this.openCards[0].value !== this.openCards[1].value) {
                        await this.openCardsRevealed();
                    } else {
                        this.lowWin.play();
                        await setAnimationTimeout(800);
                        this.openCards.length = 0;
                        this.numberOpenCards++;
                        if (this.numberOpenCards === NUMBER_ID) {
                            await this.openCardsNoRevealed();
                        }
                    }
                    this.openCards.length = 0;
                    this.resetScaleXCard();
                }
                this.enableInteractiveCard();
            })
        })
    }

    async openCardsRevealed() {
        this.openCards[0].isOpen = true;
        this.openCards[1].isOpen = true;
        await setAnimationTimeout(300);
        this.closeAnimationCard(this.openCards[0]);
        this.closeAnimationCard(this.openCards[1]);
        await setAnimationTimeout(500);
    }

    async openCardsNoRevealed() {
        this.winSound.play();
        this.isFinishGame = true;
        this.emitter = EventDispatcher.getInstance();
        this.emitter.emit("Win", "");
        await setAnimationTimeout(800);
        this.enableInteractiveCard();
        this.winn();
        this.isFinishGame = false;
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

    flipCardAnimationOpen(el) {
        el.disableInteractive();
        el.scene.tweens.add({
            targets: el,
            props: {
                scaleX: {value: 0, duration: 150, yoyo: true},
                texture: {value: "card" + el.value, duration: 0, delay: 150}
            },
            ease: "Linear",
            onComplete: () => {
                el.scaleX = 1;
            }
        })
    }

    closeAnimationCard(card) {
        card.scene.tweens.add({
            targets: card,
            props: {
                scaleX: {value: 0, duration: 150, yoyo: true},
                texture: {value: "card", duration: 0, delay: 150}
            },
            ease: 'Linear',
            onComplete: () => {
                card.isOpen = false;
                card.scaleX = 1;
            }
        })
    }

    addLoseEvent() {
        this.emitter = EventDispatcher.getInstance();
        this.emitter.on("Lose", () => {
            this.isFinishGame = true;
            this.resetCard();
            this.numberOpenCards = 0;
        })
    }

    winn() {
        this.listGameCards.forEach(card => {
            card.isOpen = false;
            this.closeAnimationCard(card);
        });
        this.numberOpenCards = 0;
        this.openCards.length = 0;
    }

    async resetCard() {
        this.disableInteractiveCard();
        this.listGameCards.forEach(card => {
            this.closeAnimationCard(card);
            card.isOpen = false;
        });

        this.openCards.length = 0;

        await setAnimationTimeout(1000);
        this.isFinishGame = false;
        this.enableInteractiveCard();
    }

    resetScaleXCard() {
        this.listGameCards.forEach(card => {
            card.scaleX = 1;
        });
    }
}
