var MapBackground = cc.Sprite.extend({
    active: true,

    ctor: function(arg) {
        this._super("#" + arg.textureName);

    },
    destroy: function() {
        this.visible = false;
        this.active = false;
    }
});

MapBackground.create = function(arg) {
    var mapBackground = new MapBackground(arg);
    TD.CONTAINER.MAP_BACKGROUNDS.push(mapBackground);
    g_sharedGameLayer.addChild(mapBackground, TD.ZORDER.MAP_BACKGROUND);
    return mapBackground;
};

MapBackground.preset = function() {
    var mapBackground;
    var numOfMap = TD.CONTAINER.MAP_BACKGROUNDS;
    for (var j = 0; j < numOfMap; j++) {
        mapBackground = MapBackground.create(MapType[j]);
        mapBackground.visible = false;
        mapBackground.active = false;
    }
}