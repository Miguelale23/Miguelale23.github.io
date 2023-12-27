import mainMenu from './mainMenu.js'
import gameScene from './gameScene.js'

window.onload = ()=>{

    const config = {
        type: Phaser.AUTO,
        scale: {
            width: 256,
            height: 192,
            zoom: 3,
            autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY
        },
        physics: {
            default: 'arcade',
        },
        pixelArt: true,
        scene: [mainMenu, gameScene]
    };

    new Phaser.Game(config);
};