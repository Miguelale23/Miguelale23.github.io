import Button from './button.js'

export default class mainMenu extends Phaser.Scene{

    constructor()
    {
        super({key: "mainMenu"});
    }
        
    create(){
        this.add.text(100, 40, "JetPac", { font: 'Pixeled' }).setScale(2)

        new Button(this,50,120,'facil',() => {this.scene.start('gameScene', {fuel: 2, meteorSpawnTime: 2000});})
        new Button(this,110,120,'normal',() => {this.scene.start('gameScene', {fuel: 3, meteorSpawnTime: 1000});})
        new Button(this,180,120,'dificil',() => {this.scene.start('gameScene', {fuel: 5, meteorSpawnTime: 500});})
    }
}