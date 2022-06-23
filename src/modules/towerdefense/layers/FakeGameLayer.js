const TAG_CONTENTNODE = 2;

var FakeGameLayer = cc.Layer.extend({

    ctor: function() {
        this._super();

        var winSize = cc.director.getWinSize();
        var sprite = new cc.Sprite(resource.mapHouse_png);
        sprite.tag = 1;
        sprite.x = winSize.width / 2;
        sprite.y = winSize.height / 2;
        this.addChild(sprite);

        if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseUp: function(event){
                    event.getCurrentTarget().processEvent(event.getLocation());
                }
            }, this);
    },
    processEvent: function(location) {
        var sprite = this.getChildByTag(1);
        var p = sprite.convertToNodeSpaceAR(location);
        cc.log("Location X: " + p.x);
        cc.log("Location Y: " + p.y);
    }
})