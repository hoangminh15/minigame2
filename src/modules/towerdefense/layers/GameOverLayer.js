var GameOverLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        this.init();
    },

    init: function() {
        cc.log("Gameover Layer")
        return true;
    }
})