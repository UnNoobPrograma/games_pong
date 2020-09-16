export default class TitleScene extends Phaser.Scene {
	constructor() {
		super('Title');
	}
	
	create() {
		this.createTitle();
		this.createButton();
	}

	createTitle() {
		// title image
		this.titleImage = this.add.image(0, 0, 'title');
		this.centerObject(this.titleImage, 0);
	}

	createButton() {
		// Start Game BUtton
		this.gameButton = this.add.sprite(0, 0, 'button1').setInteractive();
		this.centerObject(this.gameButton, -2);

		this.gameButton.on('pointerdown', (pointer)=> {
			this.scene.start('Game');
		});

		this.gameButton.on('pointerover', (pointer)=> {
			this.gameButton.setTexture('button1');
		});

		this.gameButton.on('pointerout', (pointer)=> {
			this.gameButton.setTexture('button2');
		});
		// Add text to button
		this.gameText = this.add.text(0, 0, 'Play', {
			fontSize: '32px',
			fill: '#fff'
		});
		// center text in button
		Phaser.Display.Align.In.Center(this.gameText, this.gameButton);
	}

	centerObject(gameObject, offset = 0) {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		gameObject.x = width / 2;
		gameObject.y = height / 2 - offset * 100;
	}
}