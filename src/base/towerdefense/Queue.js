
var Queue = cc.Class.extend({
    ctor: function() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    },
    enqueue: function(element) {
        this.elements[this.tail] = element;
        this.tail++;
    },
    dequeue: function() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    },
    peek: function() {
        return this.elements[this.head];
    },
    size: function() {
        return this.tail - this.head;
    },
    isEmpty: function() {
        return this.size() === 0;
    }
})