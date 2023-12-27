import Player from './player.js'
import Fuel from './fuel.js'

export default class gameScene extends Phaser.Scene{

    constructor()
    {
        super({key:'gameScene'})
    }

    init(data)
    {
        this.remainingFuel = data.fuel;
    }

    preload()
    {
        this.load.image('tilesetImage', './assets/sprites/tileset.png')
        this.load.tilemapTiledJSON('ground_ts', './assets/map/tilemap.json');

        this.load.spritesheet('jetPac', './assets/sprites/jetpac.png',{frameWidth: 17,frameHeight: 24})
        this.load.image('fuel', './assets/sprites/fuel.png')
        this.load.image('spaceship', './assets/sprites/spaceship.png')

        this.load.audio('pickSound', './assets/sounds/pick.wav')
        this.load.audio('dropSound', './assets/sounds/drop.wav')
        this.load.audio('winSound', './assets/sounds/win.wav')
    }

    loadAnimations()
    {
        this.anims.create({
            key: 'jetPacwalk',
            frames: this.anims.generateFrameNumbers('jetPac', {start:4, end:7}),
            frameRate: 13,
            repeat: -1
        })
        this.anims.create({
            key: 'jetPacjump',
            frames: this.anims.generateFrameNumbers('jetPac', {start:0, end:3}),
            frameRate: 13,
            repeat: -1
        })
        this.anims.create({
            key: 'jetPacidle',
            frames: this.anims.generateFrameNumbers('jetPac', {start:4, end:4})
        })
    }

    create()
    {
        this.loadAnimations();

        const map = this.make.tilemap({ 
			key: 'ground_ts', 
			tileWidth: 8, 
			tileHeight: 8 
		});
        const tileset = map.addTilesetImage('ground_ts', 'tilesetImage')
        this.groundLayer = map.createLayer('ground', tileset)

        this.player = new Player(this,50,50,'jetPac')
        this.spaceship = this.add.image(165,160,'spaceship')

        const spaceshipZone = this.add.zone(165, 90, 8, 190)
        this.physics.world.enable(spaceshipZone);

        this.groundLayer.setCollisionByExclusion([-1])
        this.physics.add.collider(this.player, this.groundLayer)

        this.physics.add.overlap(spaceshipZone, this.player,()=>{
            if (this.player.carryingFuel)
            {
                this.fuel.destroy();
                this.addFuelAnimation(this.player.y + 5)
                this.player.carryingFuel = false;
            }
        })

        this.currentFuel = 0;
        this.textFuel = this.add.text(150,120, this.currentFuel + '/' + this.remainingFuel)
        this.spawnFuel()
    }

    spawnFuel()
    {
        let randomX = Phaser.Math.Between(0,this.sys.game.config.width);
        this.fuel = new Fuel(this,randomX,0,this.player)

        this.physics.add.collider(this.fuel, this.groundLayer)
        this.physics.add.collider(this.player,this.fuel,(player,fuel)=>{
            player.carryingFuel = true;
            this.sound.play('pickSound')
            fuel.followPlayer();
        })
    }

    checkEndGame()
    {
        if (this.remainingFuel == this.currentFuel)
        {
            this.player.destroy();
            this.textFuel.destroy();
            this.sound.play('winSound')
            this.add.text(115,75, 'WIN')
            this.tweens.add({
                targets: this.spaceship,
                y: -50,
                ease: 'easeIn',
                duration: 3000,
                onComplete: ()=>{ this.scene.start('mainMenu')}
            })
        }
        return this.remainingFuel == this.currentFuel
    }

    addFuel()
    {
        this.currentFuel++;
        this.updateText()
        if (!this.checkEndGame())
        {
            this.time.delayedCall(2000,()=>{
                this.spawnFuel()
            })
        }
    }

    updateText()
    {
        this.textFuel.destroy();
        this.textFuel = this.add.text(150,120, this.currentFuel + '/' + this.remainingFuel)
    }

    addFuelAnimation(y)
    {
        this.sound.play('dropSound')
        let fuel = this.add.image(165, y, 'fuel')
        this.tweens.add({
            targets: fuel,
            y: 160,
            duration: 1500,
            onComplete: ()=>{
                fuel.destroy();
                this.addFuel();
            }
        })

    }

    update()
    {
        if (this.currentFuel < this.remainingFuel)
            this.player.update();
    }
}