
//Where is the monsters moved?
var Monster = cc.Sprite.extend({
    active: true,
    monsterType: null,
    speed: null,
    HP: null,
    weight: null,

    ctor: function(arg) {
        this._super("#" + arg.textureName);
        this.monsterType = arg.monsterType;
        this.speed = arg.speed;
        this.HP = arg.HP;
        this.weight = arg.weight;
    },
    destroy: function() {
        this.visible = false;
        this.active = false;
        this.stopAllActions();
        TD.ACTIVE_MONSTERS--;
    },
    //some action. e.g: Follow specified path.
});

Monster.getOrCreateMonster = function(arg) {
    var selMonster = null;
    for (var j = 0; j < TD.CONTAINER.MONSTERS.length; j++) {
        selMonster = TD.CONTAINER.MONSTERS[j];

        if (selMonster.active === false && selMonster.monsterType === arg.monsterType) {
            selMonster.speed = arg.speed;
            selMonster.HP = arg.HP;
            selMonster.weight = arg.weight;

            // Schedule action

            selMonster.visible = true;
            TD.ACTIVE_MONSTERS++;
            return selMonster;
        }
    }
};

Monster.create = function(arg) {
    var monster = new Monster(arg);
    g_sharedGameLayer.add(monster, TD.ZORDER.MONSTER, TD.UNIT_TAG);
    TD.CONTAINER.MONSTER.push(monster);
    return monster;
};

Monster.preset = function() {
    var monster = null;
    for (var i = 0; i < TD.PRESET_AMOUNT.MONSTER; i++) {
        for (var j = 0; j < MonsterType.length; j++) {
            monster = Monster.create(MonsterType[j]);
            monster.visible = false;
            monster.active = false;
            monster.stopAllActions();
            // monster..unscheduleAllCallbacks();
        }
    }
}