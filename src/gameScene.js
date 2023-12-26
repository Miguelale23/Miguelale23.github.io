import Player from './player.js'

export default class gameScene extends Phaser.Scene{

    constructor()
    {
        super({key:'gameScene'})
    }

    init(data)
    {
        this.difficulty = data.difficulty;
    }

    preload()
    {
        this.load.image('tilesetImage', './assets/sprites/tileset.png')
        this.load.tilemapTiledJSON('ground_ts', './assets/map/tilemap.json');

        this.load.spritesheet('jetPac', './assets/sprites/jetpac.png',{frameWidth: 17,frameHeight: 24})
        this.load.image('fuel', './assets/')
        
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
        const groundLayer = map.createLayer('ground', tileset)

        this.player = new Player(this,50,50,'jetPac')

        groundLayer.setCollisionByExclusion([-1])
        this.physics.add.collider(this.player, groundLayer,()=> {console.log("hola")})
    }

    spawnFuel()
    {
        let randomX = Phaser.Math.Between(0,sys.game.config.width);
        let fuel = this.add.sprite(this,randomX,0,'fuel')
        this.add.physics.existing(fuel)
        fuel.body.setGravity(0,300)

        this.physics.add.collider(this.player, fuel,(player,fuel)=>{
            fuel.followPlayer()
        })
    }

    update()
    {
        this.player.update();
    }
}