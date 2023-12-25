import Button from './button.js'

export default class mainMenu extends Phaser.Scene{

    constructor()
    {
        super({key: "mainMenu"});
    }    

    init(){

    }

    preload(){

    }



    create(){
        
        let boton = new Button(this,0,0,'hola',() =>{console.log("nashe")})
    }
}