
var Obstacle = cc.Sprite.extend({
    active: true,

    ctor: function(arg) {
        this._super("#" + arg.textureName);

    },
    destroy: function() {
        this.visible = false;
        this.active = false;
    },
    collideRect: function(x, y) {
        return cc.rect(x, y, TD.CELL_SIZE, TD.CELL_SIZE);
    }
})

Obstacle.create = function(arg) {
    var obstacle = new Obstacle(arg);
    g_sharedGameLayer.addChild(obstacle, TD.ZORDER.OBSTACLE, TD.UNIT_TAG.OBSTACLE);
    TD.CONTAINER.OBSTACLES.push(obstacle);
    return obstacle;
};

Obstacle.getOrCreate = function(arg) {
    var obstacle = null;
    for (var j = 0; j < TD.CONTAINER.OBSTACLES.length; j++) {
        obstacle = TD.CONTAINER.OBSTACLES[j];
        if (obstacle.active === false && obstacle.type === arg.type) {
            obstacle.active = true;
            obstacle.visible = true;
            return obstacle;
        }
    }
    obstacle = Obstacle.create(arg);
    return obstacle;
};

Obstacle.preset = function() {
    var obstacle = null;
    for (var i = 0; i < TD.MAX_OBSTACLES; i++) {
        for (var j = 0; j < ObstacleType.length; j++) {
            obstacle = Obstacle.create(ObstacleType[j]);
            TD.CONTAINER.OBSTACLES.push(obstacle);
            obstacle.active = false;
            obstacle.visible = false;
        }
    }
}