
export default class player extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y,key)
    {
        super(scene,x,y,key)
        this.scene = scene
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.setGravity(0,300)

        this.carryingFuel = false;

        this.walkSpeed = 50;
        this.jumpSpeed = 50;
        this.directionX = 0;
        this.directionY = 0;

        this.leftKey = scene.input.keyboard.addKey('LEFT');
        this.rightKey = scene.input.keyboard.addKey('RIGHT');
        this.upKey = scene.input.keyboard.addKey('UP');
    }

    movement()
    {
        if (this.rightKey.isDown)
        {
            this.directionX = 1;
            this.flipX = false;
        }
        else if (this.leftKey.isDown)
        {
            this.directionX = -1;
            this.flipX = true
        }
        if (this.upKey.isDown)
        {
            this.body.setVelocityY(-this.jumpSpeed)
        }
        if (this.leftKey.isUp && this.rightKey.isUp)
            this.directionX = 0

        this.body.setVelocityX(this.directionX * this.walkSpeed)

        if (this.body.onFloor() && this.body.velocity.x != 0)
            this.play('jetPacwalk', true)
        else if (!this.body.onFloor() && this.body.velocity.y != 0)
            this.play('jetPacjump', true)
        else if (this.body.onFloor())
            this.play('jetPacidle', true)

    }

    toroidalCheck()
    {
        if (this.x < 1)
        {
            this.setPosition(this.scene.sys.game.config.width, this.y)
        }
        else if (this.x > this.scene.sys.game.config.width)
        {
            this.setPosition(5, this.y)
        }
    }

    update()
    {
        this.movement();
        this.toroidalCheck();
    }
}