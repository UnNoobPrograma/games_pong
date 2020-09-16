export default class Ball extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y) {
		super(scene, x, y, 'ball');

		this.scene = scene;
		this.dx = 0;
		this.dy = 0;
		this.speed = Phaser.Math.GetSpeed(1000, 1);
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);
		this.setDirection();
	}

	setDirection() {
		this.directionx = this.scene.randomIntFromInterval(0, 1) > 0 ? 1: -1;
		this.directiony = this.scene.randomIntFromInterval(0, 1) > 0 ? 1: -1;
	}

	update(delta) {		
		this.x += this.speed * delta * this.directionx;
		this.y += this.speed * delta * this.directiony;
	}

	start(delta) {
		this.update(delta);
	}
}