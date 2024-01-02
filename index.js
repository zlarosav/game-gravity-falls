var game = new Phaser.Game({
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

    this.load.audio('theme', [ 'assets/theme.mp3' ]);
};

var stan;
var cursors;

var interactKey;
var isNearRadio = false;
var isRadioPlaying = false;
var interactionText;
var radioAudio;

function create() {
    radioAudio = this.sound.add('theme');
    radioAudio.loop = true;

    this.add.image(320, 320, 'fondo').setScale(0.5);

    stan = this.physics.add.sprite(320, 320, 'stan').setScale(0.5);
    stan.setBounce(0.2);
    stan.setCollideWorldBounds(true);

    this.anims.create({
        key: 'mov',
        frames: this.anims.generateFrameNumbers('stan', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
    });
    
    cursors = this.input.keyboard.createCursorKeys();

    interactKey = this.input.keyboard.addKey('E');
    interactionText = this.add.text(16, 16, '', { fontSize: '16px', fill: '#ffffff' });

};

function update() {
    var playerX = stan.x;
    var playerY = stan.y;
    var radioX = 50;
    var radioY = 50;
    var distance = Phaser.Math.Distance.Between(playerX, playerY, radioX, radioY);

    isNearRadio = distance < 20  // False o True

    if (isNearRadio) {
        interactionText.setText('Presiona E');
    } else {
        interactionText.setText('');
    }

    if (Phaser.Input.Keyboard.JustDown(interactKey) && isNearRadio) {
        isRadioPlaying = !isRadioPlaying;

        if (isRadioPlaying) {
            radioAudio.play();
        } else {
            radioAudio.pause();
        }
    }


    stan.anims.play('mov', true);

    if (cursors.left.isDown)
    {
        stan.setVelocityX(-80);
    }
    else if (cursors.right.isDown)
    {
        stan.setVelocityX(80);
    } else {
        stan.setVelocityX(0);
    }


    if (cursors.up.isDown)
    {
        stan.setVelocityY(-80);
    }
    else if (cursors.down.isDown)
    {
        stan.setVelocityY(80);
    } else {
        stan.setVelocityY(0);
    }
};