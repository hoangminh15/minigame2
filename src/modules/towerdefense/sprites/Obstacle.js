
var Obstacle = cc.Sprite.extend({
    active: true,
    obstacleType: null,


    ctor: function(arg) {
        this._super("#" + arg.textureName);


    },
    destroy: function() {
        this.visible = false;
        this.active = false;
    }
})