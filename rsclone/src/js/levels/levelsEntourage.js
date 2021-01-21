import Phaser from 'phaser';

export default class LevelsEntourage {
  constructor(scene, x, y, sprite, flipY, flipX, depth = 0, colorA = 0xffffff, colorB = 0x00FF66) {
    this.scene = scene;
    this.entourageObject = null;
    this.init(x, y, sprite, depth);
    this.compose(flipY, flipX);
    this.entourageObjectAnimation(colorA, colorB);
  }

  init(x, y, sprite, depth) {
    this.entourageObject = this.scene.add.sprite(x, y, sprite);
    this.entourageObject.setOrigin(1);
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

  entourageObjectAnimation(colorA, colorB) {
    const primaryColor = Phaser.Display.Color.ValueToColor(colorA);
    const secondatyColor = Phaser.Display.Color.ValueToColor(colorB);

    this.scene.tweens.addCounter({
      from: 0,
      to: 300,
      duration: 3000,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: tween => {
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
}
