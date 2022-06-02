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

MapBackground.getOrCreate = function(arg) {
    var mapBackground;
    for (var j = 0; j < TD.CONTAINER.MAP_BACKGROUNDS; j++) {
        mapBackground = TD.CONTAINER.MAP_BACKGROUNDS[j];
        if (mapBackground.active === false && mapBackground.type === arg.type) {
            mapBackground.active = true;
            mapBackground.visible = true;
            return mapBackground;
        }
    }
    mapBackground = MapBackground.create(arg);
    return mapBackground;
}

MapBackground.preset = function() {
    var mapBackground;
    for (var j = 0; j < MapType.length; j++) {
        mapBackground = MapBackground.create(MapType[j]);
        mapBackground.visible = false;
        mapBackground.active = false;
    }
};