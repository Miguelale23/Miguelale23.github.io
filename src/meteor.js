export default class meteor extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y)
    {
        super(scene,x,y,'meteor')
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.setGravity(0,75)
        this.rotation = Phaser.Math.DegToRad(90)
        this.anims.play('meteor')
    }
}