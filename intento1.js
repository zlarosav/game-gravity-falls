var game = new Phaser.Game({
    parent: 'phaser-canvas',
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
});

function preload() {
    this.load.image('fondo', 'assets/fondo.png');
    this.load.spritesheet('dipper', 'assets/dipper.png', { frameWidth: 72.75, frameHeight: 104 });
    this.load.spritesheet('mabel', 'assets/mabel.png', { frameWidth: 88.5, frameHeight: 104 });
    this.load.spritesheet('stan', 'assets/stan.png', { frameWidth: 99.75, frameHeight: 148 });
    this.load.image('arrow', 'assets/arrow.png');
};

var characters = [];
var selectedCharacter = null;
var inicialText;
var interactionText;
var interactKey;

function create() {
    this.add.image(320, 320, 'fondo').setScale(0.5);
    inicialText = this.add.text(135, 580, 'ELIGE UN PERSONAJE', { fontFamily: 'Arial Black', fontWeight: 'bold', fontSize: '30px', fill: '#ffffff' })

    characters.push(createCharacter(this, 100, 410, 'stan'));
    characters.push(createCharacter(this, 255, 505, 'mabel'));
    characters.push(createCharacter(this, 380, 460, 'dipper'));

    characters.forEach(function (character) {
        character.on('pointerdown', function () {
            selectedCharacter = character.texture.key;
            console.log('Personaje elegido: ' + selectedCharacter);

            characters.forEach(function (character) {
                character.disableInteractive();
            });
            character.arrow.setVisible(false);
            inicialText.setVisible(false);
        });

        character.on('pointerover', function () {
            character.arrow.setVisible(true);
        });

        character.on('pointerout', function () {
            character.arrow.setVisible(false);
        });
    });

    interactKey = this.input.keyboard.addKey('E');
    interactionText = this.add.text(100, 500, '', { fontFamily: 'Arial Black', fontWeight: 'bold', fontSize: '30px', fill: '#ffffff' });

};

function createCharacter(scene, x, y, key) {
    var character = scene.physics.add.sprite(x, y, key).setScale(0.5).setInteractive();
    character.setCollideWorldBounds(true);
    character.arrow = scene.add.image(x, y - 50, 'arrow').setVisible(false).setScale(0.5);
    scene.anims.create({
        key: key+'mov',
        frames: scene.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
    });
    character.anims.play(key+'mov', true);
    return character;
}

function update() {
    if (selectedCharacter) {
        const cursors = this.input.keyboard.createCursorKeys();
        const character = characters.find(char => char.texture.key === selectedCharacter);

        switch (selectedCharacter) {
            case "stan": {
                const toMabel = Phaser.Math.Distance.Between(character.x, character.y, 255, 505);
                const toDipper = Phaser.Math.Distance.Between(character.x, character.y, 380, 460);

                if (toMabel < 50) {
                    interactionText.setText('E')
                    interactionText.setPosition(255, 505)
                } else if (toDipper < 50) {
                    interactionText.setText('E')
                    interactionText.setPosition(380, 460)
                } else {
                    interactionText.setText('');
                }
            } break;
            case "mabel": {
                const toStan = Phaser.Math.Distance.Between(character.x, character.y, 100, 410);
                const toDipper = Phaser.Math.Distance.Between(character.x, character.y, 380, 460);

                if (toStan < 50) {
                    interactionText.setText('E')
                    interactionText.setPosition(100, 410)
                } else if (toDipper < 50) {
                    interactionText.setText('E')
                    interactionText.setPosition(380, 460)
                } else {
                    interactionText.setText('');
                }
            } break;
            case "dipper": { 
                const toStan = Phaser.Math.Distance.Between(character.x, character.y, 100, 410);
                const toMabel = Phaser.Math.Distance.Between(character.x, character.y, 255, 505);

                if (toStan < 50) {
                    interactionText.setText('E')
                    interactionText.setPosition(100, 410)
                } else if (toMabel < 50) {
                    interactionText.setText('E')
                    interactionText.setPosition(255, 505)
                } else {
                    interactionText.setText('');
                }
            } break;
        }

        if (character) {
            if (cursors.left.isDown) {
                character.setVelocityX(-80);
            } else if (cursors.right.isDown) {
                character.setVelocityX(80);
            } else {
                character.setVelocityX(0);
            }

            if (cursors.up.isDown) {
                character.setVelocityY(-80);
            } else if (cursors.down.isDown) {
                character.setVelocityY(80);
            } else {
                character.setVelocityY(0);
            }
        }
    }
}
