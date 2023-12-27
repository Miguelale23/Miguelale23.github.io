export default class fuel extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y, player)
    {
        super(scene,x,y,'fuel')
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.setGravity(0,300)

        this.player = player
        this.followingPlayer = false;
    }

    followPlayer()
    {
        this.body.destroy()
        this.followingPlayer = true;
    }

    preUpdate()
    {
        if (this.followingPlayer)
        {
            this.setPosition(this.player.x, this.player.y + 5)
        }
    }
}