import logo from '../assets/logo.png';
import musicTitle from '../assets/title.mp3';

export default class BootScene extends Phaser.Scene {
	constructor() {
		super('Boot');
	}

	preload() {
		this.logoImage = this.load.image('logo', logo);
		this.load.audio('musicTitle', musicTitle);
	}
	
	create() {
		
		this.music = this.sound.add('musicTitle');
		this.music.play();
		this.scene.start('Preloader');		
		
	}
}