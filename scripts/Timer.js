import {screenConfig, TIMER_DELAY} from "./config.js";
import setAnimationTimeout from "./utils.js";
import {EventDispatcher} from "./Event.js";

export class Timer {
    textDelay;
    timerDelay = TIMER_DELAY;
    context;
    isTimerStart = false;

    constructor(context) {
        this.context = context;
    }

    initTextTimer() {
        this.textDelay = this.context.add.text(0, 0, "", {font: "Arial", ontSize: 50});
        this.textDelay.setOrigin(0.5, 0.5);
        this.textDelay.setFontSize(50);
        this.updateTextDelay();
        this.textDelay.setPosition(screenConfig.WIDTH / 2, 50);
    }

    async timerStart() {
        if (this.timerDelay < 1) {
            this.textDelay.text = "You lost";
            this.lose();
            return;
        }
        this.isTimerStart = true;
        await setAnimationTimeout(1000);
        this.timerDelay--;
        this.updateTextDelay();

        this.timerStart();
    }

    updateTextDelay() {
        this.textDelay.text = "Time to defeat " + this.timerDelay + " sec";
    }

    async lose() {
        const emitter = EventDispatcher.getInstance();
        emitter.emit("Lose", "");

        await setAnimationTimeout(800);
        this.resetTimer();
    }

    resetTimer() {
        this.timerDelay = TIMER_DELAY;
        this.updateTextDelay();
    }
}
