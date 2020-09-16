import bar from '../assets/bar.png';
import shortBar from '../assets/short_bar.png';
import ball from '../assets/ball.png';
import title from '../assets/title.png';
import gameover from '../assets/gameOver.png';
import button1 from '../assets/ui/blue_button01.png';
import button2 from '../assets/ui/blue_button02.png';
import music from '../assets/pong.mp3';
import hitSound from '../assets/hit.mp3';
import gameoverSound from '../assets/gameOver.mp3';


export default class PreloaderScene extends Phaser.Scene {
	constructor() {
		super('Preloader');
	}

	init() {
		this.readyCount = 0;
	}

	preload() {
		this.timedEvent = this.time.delayedCall(1000, this.ready, [], this);
		this.createPreloader();
		this.loadAssets();
	}

	createPreloader() {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// add logo image preloaded in BootScene
		this.add.image(width/2, height/2, 'logo');

		// progress bar
		const progressBar = this.add.graphics();
		const progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(width/2-160, height/2-30, 320, 50);
		const loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: 'Loading...',
			style: {
				font: '20px monospace',
				fill: '#ffffff'
			}
		})
		loadingText.setOrigin(.5,.5);

		const percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: '0%',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		})
		percentText.setOrigin(.5,.5);

		const assetText = this.make.text({
			x: width / 2,
			y: height / 2 + 50,
			text: 'Asset',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		})
		assetText.setOrigin(.5,.5);

		// Phaser events for assets loaded
		this.load.on('progress', (value) => {
			console.log(value);
			percentText.setText(parseInt(value*100) + '%');
			progressBar.clear();
			progressBox.fillStyle(0x232323, 1);
			progressBox.fillRect(width/2-150, height/2-20, 300*value, 30);
		})

		// update File progress text
		this.load.on('fileprogress', (file)=> {
			assetText.setText(`Loading asset: ${file.key}`);
		})

		//remove progressbar on complete
		this.load.on('complete', ()=> {
			progressBar.destroy();
			progressBox.destroy();
			assetText.destroy();
			loadingText.destroy();
			percentText.destroy();
			this.ready();
		});
	}

	loadAssets() {
		this.load.image('bar', bar);
		this.load.image('shortBar', shortBar);
		this.load.image('ball', ball);
		this.load.image('title', title);
		this.load.image('gameover', gameover);
		this.load.image('button1', button1);
		this.load.image('button2', button2);
		this.load.audio('music', music);
		this.load.audio('hitSound', hitSound);
		this.load.audio('gameOverSound', gameoverSound);
	}

	ready() {
		// First call is when assets are loaded
		// second call is after timer function
		this.readyCount++;
		if (this.readyCount === 2) {
			this.cameras.main.fade(700);

			this.cameras.main.on('camerafadeoutcomplete', (camera, effect) => {
				this.scene.start('Title');
			});
		}
	}
}