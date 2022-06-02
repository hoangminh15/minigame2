var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({

    state: null,
    mapBackgroundBatch: null,
    mapForestObstacleBatch: null,
    mapCellBatch: null,
    monsterBatRunBatch: null,
    monsterDarkGiantRunBatch: null,
    monsterGiantRunBatch: null,

    mapBackground: null,
    obstacles: [],

    ctor: function() {
        this._super();
        this.init();
    },

    init: function() {

        var winSize = cc.winSize;
        g_sharedGameLayer = this;

        // Reset global values
        TD.CONTAINER.MONSTER = [];
        TD.CONTAINER.OBSTACLES = [];
        TD.ACTIVE_MONSTERS = 0;

        this.state = TD.GAME_STATE.PLAYING;

        // Add Sprite frames to SpriteFrameCache
        cc.spriteFrameCache.addSpriteFrames(resource.mapBackground_plist);
        cc.spriteFrameCache.addSpriteFrames(resource.mapCell_plist);
        cc.spriteFrameCache.addSpriteFrames(resource.mapForestObstacle_plist);
        cc.spriteFrameCache.addSpriteFrames(resource.monsterBatRun_plist);
        cc.spriteFrameCache.addSpriteFrames(resource.monsterDarkGiantRun_plist);
        cc.spriteFrameCache.addSpriteFrames(resource.monsterGiantRun_plist);


        //Make use of SpriteNodeBatch to optimize performance
        // this.mapBackgroundBatch = new cc.SpriteBatchNode(res.mapBackground_png);
        // this.mapCellBatch = new cc.SpriteBatchNode(res.mapCell_png);
        var mapForestObstacle = cc.textureCache.addImage(resource.mapForestObstacle_png);
        this.mapForestObstacleBatch = new cc.SpriteBatchNode(mapForestObstacle);
        this.addChild(this.mapForestObstacleBatch);
        // this.monsterBatRunBatch = new cc.SpriteBatchNode(res.monsterBatRun_png);
        // this.monsterDarkGiantRunBatch = new cc.SpriteBatchNode(res.monsterDarkGiantRun_plist);
        // this.monsterGiantRunBatch = new cc.SpriteBatchNode(res.monsterGiantRun_png);

        // Preset
        // Monster.preset();
        Obstacle.preset();
        MapBackground.preset();

        // Init cells

        // Init map background
        var randomMapTypeIndex = Math.floor(Math.random() * MapType.length);
        this.mapBackground = MapBackground.getOrCreate(MapType[randomMapTypeIndex]);
        this.mapBackground.attr({
            x: winSize.width/2,
            y: winSize.height/2,
            scaleX: winSize.width / this.mapBackground.width,
            scaleY: winSize.height / this.mapBackground.height
        });

        // Draw a grid on background to position obstacles
        var draw = new cc.DrawNode();
        var mainSquareOriginX = winSize.width/2-winSize.height/2
        var mainSquareDestinationX = winSize.width/2 + winSize.height/2;

        var mainSquareOrigin = cc.p(mainSquareOriginX, 0);
        var mainSquareDestination = cc.p(mainSquareDestinationX, winSize.height);

        draw.drawRect(mainSquareOrigin, mainSquareDestination, null, 2, cc.color("#000"));
        for (var i = 0; i < TD.CELLS_PER_EDGE; i++) {
            for (var j = 0; j < TD.CELLS_PER_EDGE; j++) {
                var origin = cc.p(mainSquareOriginX + i * TD.CELL_SIZE, j * TD.CELL_SIZE);
                var destination = cc.p(mainSquareOriginX + (i + 1) * TD.CELL_SIZE, (j + 1) * TD.CELL_SIZE);
                var fillColor = null;
                var lineWidth = 1;
                var lineColor = cc.color("#000");
                draw.drawRect(origin, destination, fillColor, lineWidth, lineColor);
            }
        }
        this.addChild(draw, TD.ZORDER.MAP_BACKGROUND, TD.UNIT_TAG.BACKGROUND);


        // Init Obstacle
        var numOfObstacles = Math.floor(TD.MIN_OBSTACLES + Math.random() * (TD.MAX_OBSTACLES - TD.MIN_OBSTACLES));
        for (var i = 0; i < numOfObstacles; i++) {
            var obstacle = Obstacle.getOrCreate(ObstacleType[Math.floor(Math.random() * ObstacleType.length)])
            if (obstacle.active === false) {
                this.obstacles.push(obstacle);
                this.mapForestObstacleBatch.addChild(obstacle, TD.ZORDER.OBSTACLE, TD.UNIT_TAG.OBSTACLE);
                obstacle.active = true;
                obstacle.visible = true;
            }

            var obstacleXIndex = Math.floor(Math.random() * TD.CELLS_PER_EDGE)
            var obstacleYIndex = Math.floor(Math.random() * TD.CELLS_PER_EDGE);
            // Check Validity: Obstacle can't be adjacent with any others.
            // Check Validity: Obstacle can't be at 1, 6
            // Check Validity: Obstacle can be on the same diagonal, but shouldn't block the path.
            // i.e: there's no 2 obstacles adjacent to (0, 0) cell and (6, 6) cell

            var obstacleX = mainSquareOriginX + obstacleXIndex * TD.CELL_SIZE;
            var obstacleY = obstacleYIndex * TD.CELL_SIZE;

            obstacle.setPosition(cc.p(obstacleX, obstacleY));
            obstacle.setAnchorPoint(cc.p(0, 0));
            obstacle.attr({
                x: obstacleX,
                y: obstacleY,
                anchorX: 0,
                anchorY: 0,
                scaleX: TD.CELL_SIZE / obstacle.width,
                scaleY: TD.CELL_SIZE / obstacle.height
            })
        }


        // Set Obstacle Position
        // for (var i = 0; i < TD.CONTAINER.OBSTACLES.length; i++) {
        //     obstacle = TD.CONTAINER.OBSTACLES[i];
        //     if (obstacle.active === true) {
        //         obstacle.setPosition(cc.p(winSize.width * Math.random(), winSize.height * Math.random()));
        //     }
        // }


        // Init map house

        // Init Monsters
        // Spawn monster with an interval.
        var randomMonsterIndex = Math.floor(Math.random() * MonsterType.length);
        var monster = Monster.getOrCreate(MonsterType[randomMonsterIndex]);
        monster.setPosition(cc.p(winSize.width/4, winSize.height/4));


        // Sound settings here

        //Add listener or logic functions.

        // Schedule update here
        this.scheduleUpdate();

        return true;
    },

    update: function(dt) {
        if (this.state === TD.GAME_STATE.PLAYING) {
            // Run update functions

        }
    },

    collide: function(a, b) {
        var ax = a.x, ay = a.y, bx = b.x, by = b.y;
        if (Math.abs(ax - bx) > TD.MAX_CONSTANT_WIDTH || Math.abs(ay - by) > TD.MAX_CONSTANT_HEIGHT) {
            return false;
        }

        var aRect = a.collideRect(ax, ay);
        var bRect = b.collideRect(bx, by);
        return cc.rectIntersectsRect(aRect, bRect);
    }
});

