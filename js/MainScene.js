class MainScene extends Phaser.Scene
{
    preload()
    {
        this.load.image('tiles','res/Tileset.png');
        this.load.tilemapTiledJSON('map','res/FirstMap2.json');
        this.load.image('bg-1', 'res/sky.png');
        this.load.image('sea', 'res/sea.png');
        this.load.image('player', 'res/idle-1.png');
        //Phaser.Physics.Arcade.Sprite
        // https://gammafp.com/tool/atlas-packer/
        this.load.atlas('sprites_jugador','res/player_anim/player_anim.png',
        'res/player_anim/player_anim_atlas.json');
        this.load.spritesheet('tilesSprites','res/Tileset.png',
        { frameWidth: 32, frameHeight: 32 });

        this.load.audio('mainMusic', ['Music/musicMainScene.mp3', 'Music/musicMainScene.ogg']);

    }

    create()
    {
        var bg_1 = this.add.tileSprite(0, 0, windows.width*10, windows.height*10, 'bg-1').setOrigin(0,0);
        bg_1.fixedToCamera = true;

        //necesitamos un player
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('GoldenTileset', 'tiles');

        var layer2 = map.createLayer('Fondo', tiles, 0, 0); //Nunca es llamado
        var layer = map.createLayer('Suelo', tiles, 0, 0);
        this.player = new Player(this,50,100);


        //Music


        this.mainMusic = this.sound.add('mainMusic');
        var musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            denute: 0,
            seek:0,
            loop: true,
            delay:0
        }

        this.mainMusic.play(musicConfig);


        //enable collisions for every tile
        layer.setCollisionByExclusion(-1,true);
        this.physics.add.collider(this.player,layer);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);


        this.objetos = map.getObjectLayer('objetos')['objects'];
        this.setas = [];
        this.setasDoradas = [];
        this.oro = [];
        for(var i = 0; i < this.objetos.length; ++i)
        {
            var obj = this.objetos[i];
            if(obj.gid == 115) // en mi caso la seta
            {
                var seta = new Seta(this,obj.x,obj.y);
                this.setas.push(seta);
                this.physics.add.overlap(seta, this.player, this.spriteHit,null,this);
            } else if(obj.gid == 101) {
              var setaDorada = new SetaDorada(this,obj.x,obj.y);
              this.setasDoradas.push(setaDorada);
              this.physics.add.overlap(setaDorada, this.player, this.spriteHit,null,this);
            } else if(obj.gid == 99) {
              var oroAux = new Oro(this,obj.x,obj.y);
              this.oro.push(oroAux);
            }
        }
        this.score = 0;
        this.showscore0();

    }


    spriteHit (sprite1, sprite2) {

        this.addscore(sprite1.getScore());
        sprite1.destroy();
        //this.scene.restart(); //Esto para los enemigos

    }
    showscore0(){

        this.scoreText = this.add.text( 10, 16, 'PUNTOS: '+this.score, {
            fontSize: '20px',
            fill: '#000',
            fontFamily: 'verdana, arial, sans-serif'
          })

    }

    showscore(){


        if (this.score> 0) {
            this.scoreText.destroy();
            this.scoreText = this.add.text(this.cameras.main.worldView.x + 10, 16, 'PUNTOS: '+this.score, {
            fontSize: '20px',
            fill: '#000',
            fontFamily: 'verdana, arial, sans-serif'
          })
        }

    }

    addscore( points ){

        this.score = this.score + points;

    }

    update (time, delta)
    {


       this.showscore();


        if (this.player.y> 450) { //Muere al tocar el agua.
            this.mainMusic.mute = true;
            this.scene.restart();
        }

        this.player.update(time,delta);


    }
}
