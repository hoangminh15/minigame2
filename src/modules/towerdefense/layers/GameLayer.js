var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({

    state: null,
    mapBackgroundBatch: null,
    mapForestObstacleBatch: null,
    mapCellBatch: null,
    monsterBatRunBatch: null,
    monsterDarkGiantRunBatch: null,
    monsterGiantRunBatch: null,

    ctor: function() {
        this._super();
        this.init();
    },

    init: function() {

        var winSize = cc.winSize;

        // Reset global values
        TD.CONTAINER.MONSTER = [];
        TD.CONTAINER.OBSTACLES = [];
        TD.ACTIVE_MONSTERS = 0;

        this.state = TD.GAME_STATE.PLAYING;

        // Add Sprite frames to SpriteFrameCache
        cc.spriteFrameCache.addSpriteFrame(res.mapBackground_plist);
        cc.spriteFrameCache.addSpriteFrame(res.mapCell_plist);
        cc.spriteFrameCache.addSpriteFrame(res.mapForestObstacle_plist);
        cc.spriteFrameCache.addSpriteFrame(res.monsterBatRun_plist);
        cc.spriteFrameCache.addSpriteFrame(res.monsterDarkGiantRun_plist);
        cc.spriteFrameCache.addSpriteFrame(res.monsterGiantRun_plist);

        //Make use of SpriteNodeBatch to optimize performance
        this.mapBackgroundBatch = new cc.SpriteBatchNode(res.mapBackground_png);
        this.mapCellBatch = new cc.SpriteBatchNode(res.mapCell_png);
        this.mapForestObstacleBatch = new cc.SpriteBatchNode(res.mapForestObstacle_png);
        this.monsterBatRunBatch = new cc.SpriteBatchNode(res.monsterBatRun_png);
        this.monsterDarkGiantRunBatch = new cc.SpriteBatchNode(res.monsterDarkGiantRun_plist);
        this.monsterGiantRunBatch = new cc.SpriteBatchNode(res.monsterGiantRun_png);

        // Preset
        Monster.preset();
        Obstacle.preset();
        MapBackground.preset();

        // Map init here
        // Map index from 1 to 3
        var mapTypeIndex = Math.random() * 3;
        var mapBackground = MapBackground.getOrCreate(MapType[mapTypeIndex]);
        mapBackground.attr({
            x: winSize.width / 2,
            y: winSize.height /2
        });
        this.addChild(mapBackground);

        // Map house init here

        // Monster init her too?

        // Obstacle init

        // Sound settings here

        //Add listener or logic functions.

        // Schedule update here
        this.scheduleUpdate();

        return true;
    },

    update: function() {
        if (this.state === TD.GAME_STATE.PLAYING) {
            // Run update functions
            cc.log("Playing the game")
        }
    }
})