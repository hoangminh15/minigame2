

var Monster = cc.Sprite.extend({
    active: true,
    type: null,
    monsterName: null,
    speed: null,
    HP: null,
    weight: null,
    moveDirection: null,
    currentMoveDirectionIndex: 0,
    nextMoveDirection: null,
    currentAnimation: null,

    // Monster animation variables
    framesPerDirection: null,
    frameNamePrefix: null,
    isJustCreated: true,

    //Monster movement variables.
    waypoints: null,
    isWayPointReached: true,
    curPos: null,
    nextPos: null,
    nextNextPos: null,
    curPosIndex: 0,
    moveToWaypointAction: null,
    isMapHouseReached: false,

    //Monsters reach map house action
    reachMapHouseAction: null,

    ctor: function (arg, waypoints) {
        this._super("#" + arg.textureName);
        this.monsterName = arg.monsterName;
        this.type = arg.type;
        this.speed = arg.speed;
        this.HP = arg.HP;
        this.weight = arg.weight;
        this.waypoints = waypoints;
        this.framesPerDirection = arg.framesPerDirection;
        this.frameNamePrefix = arg.frameNamePrefix;

        //Testing move direction down
        this.moveDirection = "Up";
        this.nextMoveDirection = "Up";

        this.setOpacity(0);
        var fadeInAction = cc.sequence(cc.fadeIn(1.0), cc.callFunc(this.postCreation, this, arg));
        this.runAction(fadeInAction);

    },
    postCreation: function (arg) {
        this.initAnimation(arg);
        this.scheduleUpdate();
    },

    update: function (dt) {
        this.updateMonsterAnimation();
        this.updateMonsterPosition();
    },
    updateMonsterPosition: function () {
        if (this.isWayPointReached === true) {
            if (this.curPosIndex < this.waypoints.length - 1) {
                this.curPos = this.waypoints[this.curPosIndex];
                this.nextPos = this.waypoints[this.curPosIndex + 1];

                var xDistance = (this.nextPos[1] - this.curPos[1]) * TD.CELL_SIZE;
                var yDistance = (this.nextPos[0] - this.curPos[0]) * TD.CELL_SIZE;
                // Set up animation accordingly
                if (yDistance > 0) {
                    this.nextMoveDirection = "Up";
                } else if (yDistance < 0) {
                    this.nextMoveDirection = "Down"
                }
                if (xDistance > 0) {
                    this.nextMoveDirection = "Right";
                } else if (xDistance < 0) {
                    this.nextMoveDirection = "Left";
                }

                var distance = Math.max(xDistance, yDistance);
                var duration = distance / (this.speed * TD.CELL_SIZE);
                this.moveToWaypointAction = cc.moveBy(duration, xDistance, yDistance);
                this.runAction(cc.sequence(this.moveToWaypointAction, cc.callFunc(this.postMoveAction, this)));
                this.isWayPointReached = false;
            } else {
                // Map house reached
                this.destroy();
            }
        }

    },
    postMoveAction: function () {
        this.isWayPointReached = true;
        this.curPosIndex = this.curPosIndex + 1;
    },

    updateMonsterAnimation: function () {
        if (this.nextMoveDirection !== this.moveDirection || this.isJustCreated) {
            this.stopAction(this.currentAnimation);
            var animationName = "animation" + this.monsterName + this.nextMoveDirection;
            var animation = cc.AnimationCache.getInstance().getAnimation(animationName);
            var animate = cc.animate(animation);
            this.currentAnimation = animate.repeatForever();
            this.runAction(this.currentAnimation);
            this.moveDirection = this.nextMoveDirection;
            if (this.isJustCreated) {
                this.isJustCreated = false;
            }
        }
    },
    initAnimation: function (arg) {
         for (var i = 0; i < TD.NUM_OF_MOVE_DIRECTIONS; i++) {
            var animationFrames = [];
            for (var j = 0; j < this.framesPerDirection; j++) {
                var frameIndex = (i * this.framesPerDirection + j);
                if (frameIndex < 10) {
                    frameIndex = "0" + frameIndex;
                }
                var frameName = this.frameNamePrefix + frameIndex + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(frameName);
                animationFrames.push(frame);
            }
            var animation = new cc.Animation(animationFrames, 0.05);
            var animationName = "animation" + this.monsterName + TD.MOVE_DIRECTION[i];
            cc.AnimationCache.getInstance().addAnimation(animation, animationName);
        }
    },
    updateNextMoveDirection: function () {
        this.currentMoveDirectionIndex = this.currentMoveDirectionIndex + 1;
        var newDirectionIndex = (this.currentMoveDirectionIndex) % TD.NUM_OF_MOVE_DIRECTIONS;
        this.nextMoveDirection = TD.MOVE_DIRECTION[newDirectionIndex];
    },
    destroy: function () {
        // Visual effect
        this.stopAllActions();
        this.unscheduleUpdate();
        this.reachMapHouseAction = cc.fadeOut(1.0);
        var fadeOutSequence = cc.sequence(this.reachMapHouseAction, cc.callFunc(this.postDestroy, this));
        this.runAction(fadeOutSequence);
    },
    postDestroy: function () {
        this.visible = false;
        this.active = false;
        TD.ACTIVE_MONSTERS--;
    },

    collideRect: function (x, y) {
        var w = this.width;
        var h = this.height;
        return cc.rect(x - w / 2, y - h / 2, w, h);
    }
});

Monster.create = function (arg, waypoints) {
    var monster = new Monster(arg, waypoints);
    g_sharedGameLayer.addChild(monster, TD.ZORDER.MONSTER, TD.UNIT_TAG.MONSTER);
    TD.CONTAINER.MONSTER.push(monster);
    return monster;
};

Monster.getOrCreate = function (arg, waypoints) {
    var selMonster = null;
    for (var j = 0; j < TD.CONTAINER.MONSTERS.length; j++) {
        selMonster = TD.CONTAINER.MONSTERS[j];

        if (selMonster.active === false && selMonster.type === arg.type) {
            selMonster.speed = arg.speed;
            selMonster.HP = arg.HP;
            selMonster.weight = arg.weight;
            selMonster.waypoints = waypoints;
            selMonster.framesPerDirection = arg.framesPerDirection;
            selMonster.frameNamePrefix = arg.frameNamePrefix;

            selMonster.visible = true;
            TD.ACTIVE_MONSTERS++;
            return selMonster;
        }
    }
    selMonster = Monster.create(arg, waypoints);
    TD.ACTIVE_MONSTERS++;
    return selMonster;
};

Monster.preset = function () {
    var monster = null;
    for (var i = 0; i < TD.PRESET_AMOUNT.MONSTER; i++) {
        for (var j = 0; j < MonsterType.length; j++) {
            monster = Monster.create(MonsterType[j]);
            TD.CONTAINER.MONSTERS.push(monster);
            monster.visible = false;
            monster.active = false;
        }
    }
}