class SetaDorada extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene,x,y)
    {
        super(scene,x+16,y-16,'tilesSprites',100);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.allowGravity = false;

    }

    getScore(){
      return 5;
    }

    update(time,delta)
    {
    }
}
