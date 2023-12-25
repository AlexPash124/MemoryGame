export class Card extends Phaser.GameObjects.Sprite {
    isOpen = false;
    constructor(scene, positionX, positionY, value) {
        super(scene, positionX, positionY, "card");
        this.value = value;
        this.scene = scene;
        //this.setOrigin(0, 0);
        this.scene.add.existing(this);
        this.setInteractive();
    }
}