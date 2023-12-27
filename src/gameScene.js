import Player from './player.js'
import Fuel from './fuel.js'
import Meteor from './meteor.js'

export default class gameScene extends Phaser.Scene{

    constructor()
    {
        super({key:'gameScene'})
    }

    init(data)
    {
        this.remainingFuel = data.fuel;
        this.meteorSpawnTime = data.meteorSpawnTime;
    }

    preload()
    {
        this.load.image('tilesetImage', './assets/sprites/tileset.png')
        this.load.tilemapTiledJSON('ground_ts', './assets/map/tilemap.json');

        this.load.spritesheet('jetPac', './assets/sprites/jetpac.png',{frameWidth: 17,frameHeight: 24})
        this.load.image('fuel', './assets/sprites/fuel.png')
        this.load.image('spaceship', './assets/sprites/spaceship.png')
        this.load.spritesheet('meteor', './assets/sprites/meteor.png', {frameWidth:16, frameHeight:14})
        this.load.spritesheet('explosion', './assets/sprites/explosion.png', {frameWidth:24, frameHeight:17})

        this.load.audio('pickSound', './assets/sounds/pick.wav')
        this.load.audio('dropSound', './assets/sounds/drop.wav')
        this.load.audio('winSound', './assets/sounds/win.wav')
        this.load.audio('loseSound', './assets/sounds/lose.wav')
        this.load.audio('explosionSound', './assets/sounds/explosion.wav')
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

        this.anims.create({
            key:'meteor',
            frames: this.anims.generateFrameNumbers('meteor', {start:0, end: 1}),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key:'explosion',
            frames: this.anims.generateFrameNumbers('explosion', {start:0, end: 2}),
            frameRate: 10
        })
    }

    create()
    {
        this.loadAnimations();
        this.gameRunning = true;
        
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

        this.time.addEvent({
            delay: this.meteorSpawnTime,
            callback: this.spawnMeteor,
            callbackScope: this,
            loop: true
        })

        this.currentFuel = 0;
        this.textFuel = this.add.text(150,120, this.currentFuel + '/' + this.remainingFuel)
        this.spawnFuel()
    }

    spawnMeteor()
    {
        let randomX = Phaser.Math.Between(10,this.sys.game.config.width - 10);
        let meteor = new Meteor(this,randomX, 0)

        this.physics.add.collider(meteor,this.player,(meteor,player)=>{
            this.sound.play('explosionSound')
            let explosion = this.add.sprite(meteor.x, meteor.y, 'explosion')
            explosion.play('explosion').on('animationcomplete',()=>{explosion.destroy()})
            meteor.destroy();
            player.destroy();
            this.fuel.destroy();
            this.gameRunning = false;
            this.time.delayedCall(1000,()=>{
                this.sound.play('loseSound')
                this.add.text(90,75, 'YOU LOSE')
                this.time.delayedCall(2000,()=>{
                    this.input.keyboard.removeAllListeners();
                    this.scene.start('mainMenu')
                })
            })
        })

        this.physics.add.collider(meteor, this.groundLayer, ()=>{
            this.sound.play('explosionSound')
            let explosion = this.add.sprite(meteor.x, meteor.y, 'explosion')
            explosion.play('explosion').on('animationcomplete',()=>{explosion.destroy()})
            meteor.destroy();
        })
    }

    spawnFuel()
    {
        let randomX = Phaser.Math.Between(10,this.sys.game.config.width - 10);
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
            this.add.text(95,75, 'YOU WIN')
            this.gameRunning = false;
            this.tweens.add({
                targets: this.spaceship,
                y: -50,
                ease: 'easeIn',
                duration: 3000,
                onComplete: ()=>{ 
                    this.input.keyboard.removeAllListeners();
                    this.scene.start('mainMenu')}
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
    updateText()
    {
        this.textFuel.destroy();
        this.textFuel = this.add.text(150,120, this.currentFuel + '/' + this.remainingFuel)
    }

    

    update()
    {
        if (this.gameRunning)
            this.player.update();
    }
}