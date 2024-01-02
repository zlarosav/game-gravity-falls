// Configuración del Juego
var game = new Phaser.Game({
    type: Phaser.AUTO,  // Phaser.CANVAS, Phaser.WEBGL, Phaser.AUTO
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
});

// Preload. Cargar los recursos que necesitamos para nuestro juego.
function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 }); //Original: 288 x 48 (Hoja de Sprites)
};

// Create. Mostrar las imágenes cargadas.
var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var gameOverText;
var scoreText;
function create() {
    // Todos los elementos del juego están posicionados por defecto en base a su centro.
    this.add.image(400, 300, 'sky'); // this.add.image(0, 0, 'sky').SetOrigin(0, 0)
    // this.add.image(400, 300, 'star');  Si se cargara la imagen star en primer lugar quedaría tapada por la imagen del cielo.

    // Plataformas
    platforms = this.physics.add.staticGroup(); // Crea un nuevo grupo de elementos estáticos con física y lo asigna a la variable local platforms.
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Personaje
    player = this.physics.add.sprite(100, 450, 'dude'); // Ubicación relativa a la parte inferior del juego
    player.setBounce(0.2); // Rebote del personaje
    player.setCollideWorldBounds(true); // Hacer que el personaje no se salga del mundo
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10, // velocidad de fps
        repeat: -1 // indica que la animación debe volver a empezar cuando termine.
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    // player.body.setGravityY(300)

    // Estrellas
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Bombas, solo las dibujaremos si el usuario recoge todas las estrellas
    bombs = this.physics.add.group();
    
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // Reacción a las teclas, las establecemos en update
    cursors = this.input.keyboard.createCursorKeys();

    // Si hay colisión entre ambos argumentos
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Si el personaje se superpone con alguna estrella
    this.physics.add.overlap(player, stars, collectStar, null, this);

};

function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function hitBomb (player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOverText = this.add.text(250, 275, 'GAME OVER', { fontSize: '50px', fill: '#000' });
    gameOver = true;
}

// 
function update() {
    if (gameOver)
    {   
        return;
    }
    
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
};