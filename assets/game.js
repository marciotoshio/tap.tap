var game = new Phaser.Game(600, 480, Phaser.AUTO, 'gameCanvas', { preload: preload, create: create, update: update });

var explosion, crosshair, cockroaches;
var nextCockroachAt = 0;
var spawnDelay = 1000;

function preload() {
  game.load.image('bg-wood', 'assets/images/bg-wood.jpg');
  game.load.image('bg-stone', 'assets/images/bg-stone.jpg');
  game.load.image('bg-cracks', 'assets/images/bg-cracks.jpg');
  game.load.image('explosion', 'assets/images/explosion.png');
  game.load.image('crosshair', 'assets/images/crosshair.png');
  game.load.spritesheet('cockroach', 'assets/images/cockroach.png', 32, 32, 4);
}

function create() {
  game.add.sprite(0, 0, 'bg-wood');

  crosshair = game.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'crosshair');
  crosshair.anchor.setTo(.5, .5);
  crosshair.scale.setTo(.1,.1);

  explosion = game.add.sprite(0, 0, 'explosion');
  explosion.kill();
  game.input.onDown.add(clickHandle, this);

  cockroaches = game.add.group();
  cockroaches.enableBody = true;
  for(var i=0; i<30; i++) {
    cockroaches.create(game.world.randomX, 480, 'cockroach');
  }
  cockroaches.callAll('animations.add', 'animations', 'walk', null, 8, true, false);
  cockroaches.callAll('play', null, 'walk')
  cockroaches.callAll('kill');

}

function update() {
  crosshair.x = game.input.mousePointer.x;
  crosshair.y = game.input.mousePointer.y;

  cockroaches.forEachDead(function(cockroach){
    if (nextCockroachAt < game.time.now) {
        nextCockroachAt = game.time.now + spawnDelay;
        cockroach.revive();
    }
  });

  cockroaches.forEachAlive(function(cockroach){
    cockroach.y -= 1;
    if (cockroach.y < -cockroach.height)
    {
        cockroach.y = game.world.height;
    }
  });
}

function clickHandle(pointer) {
  createExplosion(pointer);
}

function createExplosion(pointer) {
  explosion.revive();
  explosion.anchor.setTo(.5, .5);
  explosion.x = pointer.x;
  explosion.y = pointer.y;
  explosion.alpha = 1;
  explosion.scale.setTo(.1,.1);
  var time = 500;
  game.add.tween(explosion.scale).to({x:.6,y:.6}, time, Phaser.Easing.Exponential.Out, true);
  game.add.tween(explosion).to({alpha:0}, time, Phaser.Easing.Linear.In, true);
}