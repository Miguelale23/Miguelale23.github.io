export default class button extends Phaser.GameObjects.Container{

    constructor(scene, x, y, texto, func){
        super(scene, x, y);
        //this.sprite = scene.add.sprite(x, y, key);
        this.func = func;
        let text = scene.add.text(x, y, texto, { font: 'Pixeled' });
        text.setInteractive();
        text.on('pointerdown',()=> { this.func(); })
        this.scene.add.existing(this);
    }
}