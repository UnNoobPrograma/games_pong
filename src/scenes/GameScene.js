import Ball from '../objects/Ball';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	init() {
		this.restartGame();
		this.events.emit('displayUI');
		this.uiScene = this.scene.get('UI');
	}

	restartGame() {
		this.level = 1;
		this.ballSpeed = 0;
		this.playerSpeed = 8;
		this.enemySpeed = 5;
		this.playerPoints = 0;
		this.enemyPoints = 0;
		this.hitEnemy = false;
		this.hitPlayer = false;
		this.hitsCounter = 0;
		this.totalLevels = 5;
		this.events.emit('updatePlayerScore', this.playerPoints);
		this.events.emit('updateEnemyScore', this.enemyPoints);
	}

	create() {
		this.worldHeight = this.cameras.main.height;
		this.worldWidth = this.cameras.main.width;

		this.music = this.sound.add('music');
		this.hitSound = this.sound.add('hitSound');
		this.gameOverSound = this.sound.add('gameOverSound');
		this.music.play({loop: -1, volume: 0.3});

		this.events.emit('start', this.level);
		this.player = this.physics.add.image(30, (this.worldHeight/2), 'shortBar');
		this.player.setCollideWorldBounds(true);

		this.enemy = this.physics.add.image(this.worldWidth - 30, (this.worldHeight/2), 'shortBar');
		this.enemy.setCollideWorldBounds(true);

		this.ball = new Ball(this, this.getCenterPosition().x, this.getCenterPosition().y);
		this.physics.add.collider(this.player, this.ball, (player, ball) => {
			if (!this.hitPlayer) {
				ball.directionx *= -1;
				this.hitPlayer = true;
				this.hitEnemy = false;
				this.hitsCounter++;
				this.hitSound.play();
			}
		});

		this.physics.add.collider(this.enemy, this.ball, (enemy, ball) => {
			if (!this.hitEnemy) {
				ball.directionx *= -1;
				this.hitEnemy = true;
				this.hitPlayer = false;
				this.hitsCounter++;
				this.hitSound.play();
			}
		});

		this.uiScene.events.on('roundReady', () => {
			this.ballSpeed = 5;
		});

		this.events.emit('startCounter', this.level);

		
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	increaseLevel() {
		// Increase ball speed every 5 hits
		if (this.playerPoints % 5 === 0 && this.enemyPoints < 5) {
			this.level++;
			this.ballSpeed++;
			this.playerSpeed++;
			this.enemySpeed++;
		}
	}

	initialLevel() {
		this.level = this.level-1 <= 1 ? 1: this.level-1;
		this.ballSpeed = this.ballSpeed-1 <=5 ? 5 : this.ballSpeed-1;
		this.playerSpeed = this.playerSpeed-1 <=5 ? 5 : this.playerSpeed-1;
		this.enemySpeed = this.enemySpeed-1 <=3 ? 3 : this.enemySpeed-1;
	}

	randomIntFromInterval(min, max) { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	update(time, delta) {
		this.ball.start(this.ballSpeed);

	
		if (this.ball.y <= (this.ball.getBounds().height/2) || 
				this.ball.y >= this.cameras.main.height-(this.ball.getBounds().height/2)) {
			this.ball.directiony *= -1;
		}

		if (this.ball.x > this.cameras.main.width) {
			this.ball.setPosition(this.getCenterPosition().x, this.getCenterPosition().y);
			this.ball.setDirection();
			this.hitPlayer = false;
			this.hitEnemy = false;
			this.playerPoints++;
			this.events.emit('updatePlayerScore', this.playerPoints);
			this.increaseLevel();
		} else if (this.ball.x < 0) {
			this.ball.setPosition(this.getCenterPosition().x, this.getCenterPosition().y);
			this.ball.setDirection();
			this.hitPlayer = false;
			this.hitEnemy = false;
			this.enemyPoints++;
			this.events.emit('updateEnemyScore', this.enemyPoints);
			this.initialLevel();
		}

		// Player Controls
		// I don't need to validate boundaries 
		// because I'm using setCollideWorldBounds
		if (this.cursors.down.isDown) {
				this.player.y += this.playerSpeed;
		} else if (this.cursors.up.isDown) {
				this.player.y -= this.playerSpeed;
		}

		// Enemy movement
		if (this.ball.x > ((this.cameras.main.width/2) + 100)) {
			if (this.ball.y > this.enemy.y) {
				this.enemy.y += this.enemySpeed;
			} else {
				this.enemy.y -= this.enemySpeed;
			}
		}

		// Game Over
		if (this.enemyPoints >= 5) {
			this.gameOver();
		}

		// You Win
		if ((this.playerPoints >= 5) && (this.playerPoints > this.enemyPoints)) {
			this.youWin();
		}
	}

	gameOver() {
		this.events.emit('updateRecord', this.playerPoints);
		if (this.music.isPlaying) {
			this.music.stop();
		}
		this.gameOverSound.play();
		
		this.cameras.main.shake(500);
    // Listen event
    this.cameras.main.on('camerashakecomplete', (camera, effect)=>{
      // Fade Out
      this.cameras.main.fade(500);
    });

    this.cameras.main.on('camerafadeoutcomplete', (camera, effect) => {
      this.events.emit('hideUI');
			this.scene.start('GameOver');
		});
		
		this.restartGame();
	}

	youWin() {

	}

	getCenterPosition() {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		const x = width / 2;
		const y = height / 2;

		return { x, y } 
	}
}