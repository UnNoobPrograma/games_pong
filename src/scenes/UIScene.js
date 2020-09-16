export default class UISCene extends Phaser.Scene {
	constructor() {
		super({
			key: 'UI',
			active: true
		});
	}

	init() {
		this.gameScene = this.scene.get('Game');
		this.currentRecord = localStorage.getItem('pong_record');
	}

	create() {
		this.setupUIElements();
		this.setupEvents();
	}

	setupUIElements() {
		const windowX = this.cameras.main.width/2;
		const windowY = this.cameras.main.height;

		this.scorePlayerText = this.add.text(windowX - 80, 50, '0', {
			fontSize: '60px',
			fill: '#fff'
		});

		this.scoreEnemyText = this.add.text(windowX + 80, 50, '0', {
			fontSize: '60px',
			fill: '#fff'
		});

		this.counterText = this.add.text(windowX - 220, 300, 'Starts in: 5', {
			fontSize: '60px',
			fill: '#fff'
		});

		this.levelText = this.add.text(25, 25, 'Level: 1',
		{
			fontSize: '20px',
			fill: '#fff'
		});

		this.recordText = this.add.text(25, windowY - 25, `Current Record: ${this.currentRecord || 0}`,
		{
			fontSize: '20px',
			fill: '#fff'
		});

		this.hideUIElements();
	}

	hideUIElements() {
		this.scoreEnemyText.alpha = 0;
		this.scorePlayerText.alpha = 0;
		this.levelText.alpha = 0;
		this.counterText.alpha = 0;
		this.recordText.alpha = 0;
	}

	showCounter() {
		this.counterText.alpha = 1;
	}
	
	hideCounter() {
		this.counterText.alpha = 0;
	}

	setupEvents() {
		this.gameScene.events.on('displayUI', () => {
			this.scoreEnemyText.alpha = 1;
			this.scorePlayerText.alpha = 1;
			this.levelText.alpha = 1;
			this.recordText.alpha = 1;
		});

		this.gameScene.events.on('updatePlayerScore', (score)=> {
			this.scorePlayerText.setText(score);
		});

		this.gameScene.events.on('updateEnemyScore', (score)=> {
			this.scoreEnemyText.setText(score);
		});

		this.gameScene.events.on('updateCounterScore', (score)=> {
			this.counterText.setText(score);
		});

		this.gameScene.events.on('hideUI', ()=> {
			this.hideUIElements();
		});

		this.gameScene.events.on('updateRecord', (score)=> {
			if (score > this.currentRecord) {
				this.recordText.setText(`Current Record: ${this.currentRecord || 0}`);
				localStorage.setItem('pong_record', score);
			}
		});

		this.gameScene.events.on('startCounter', (level)=> {
			this.levelText.setText(`Level: ${level}`);
			this.levelText.alpha = 1;
			this.counterText.alpha = 1;

			// fade level text
			this.add.tween({
				targets: this.levelText,
				ease: 'Sine.easeInOut',
				duration: 1000,
				delay: 1000,
				alpha: {
					getStart: () => {
						return 1;
					},
					getEnd: () => {
						return 0;
					},
				},
				onComplete: () => {
					this.counterText.setText('Starts in: 5');
					this.counterText.alpha = 1;
					let timedEvent = this.time.addEvent({
						delay: 1000,
						callbackScope: this,
						repeat: 5,
						callback: () => {
							this.counterText.setText(`Starts in: ${timedEvent.repeatCount}`);
							if (timedEvent.repeatCount === 0) {
								this.events.emit('roundReady');
								this.counterText.alpha = 0;
							}
						}
					});
				}
			});			
		});
	}
}