import Phaser from 'phaser';

export default class LevelsEntourage {
  constructor(scene, scale, x, y, randomCoof, sprite, flipY, flipX, depth = 0,
    animationSpeed, colorA = 0xffffff, colorB = 0x00FF66) {
    this.scene = scene;
    this.entourageObject = null;
    this.init(scale, x, y, sprite, randomCoof, depth);
    this.compose(flipY, flipX);
    this.entourageObjectAnimation(colorA, colorB, animationSpeed);
    this.glow();
  }

  init(scale, x, y, sprite, randomCoof, depth) {
    this.entourageObject = this.scene.add.sprite(Math.random() * randomCoof + x, y, sprite);
    this.entourageObject.setOrigin(0, 1);
    this.entourageObject.scaleX = scale;
    this.entourageObject.depth = depth;
  }

  compose(flipY, flipX) {
    if (flipY) {
      this.entourageObject.angle = 180;
    }
    if (flipX) {
      this.entourageObject.scaleX = -1;
    }
  }

  entourageObjectAnimation(colorA, colorB, animationSpeed) {
    const primaryColor = Phaser.Display.Color.ValueToColor(colorA);
    const secondatyColor = Phaser.Display.Color.ValueToColor(colorB);

    this.scene.tweens.addCounter({
      from: 0,
      to: 300,
      duration: animationSpeed,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween) => {
        const value = tween.getValue();
        const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
          primaryColor,
          secondatyColor,
          500,
          value,
        );
        const color = Phaser.Display.Color.GetColor(colorObject.r, colorObject.g, colorObject.b);
        this.entourageObject.setTint(color);
      },
    });
  }

  glow() {
    console.log(this.entourageObject);
    const color = Phaser.Display.Color.IntegerToRGB(Math.random() * 0xf0ff00);
    const light = this.scene.add.pointlight(
      this.entourageObject.x - (Math.random() * 100), this.entourageObject.y - Math.random() * 100,
      0, this.entourageObject.width * Math.random() * 1.8, Math.random() * 0.075,
    );
    light.depth = 1;
    light.color.setTo(color.r, color.g, color.b);
  }
}
