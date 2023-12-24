export class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, positionX, positionY, texture = "card") {
        super(scene, positionX, positionY, texture);
        this.scene = scene;
        this.setOrigin(0, 0);
        this.scene.add.existing(this);
    }
}