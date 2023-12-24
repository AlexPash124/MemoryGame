import GameScene from "./GameScene.js";
import {screenConfig} from "./config.js";

const scene = new GameScene();
const config = {
    type: Phaser.AUTO, //webGl or canvas
    width: screenConfig.WIDTH,
    height: screenConfig.HEIGHT,
    scene: scene,
    scaleMode: Phaser.Scale.NONE,
};


const GAME = new Phaser.Game(config);