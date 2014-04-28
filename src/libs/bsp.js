var rndInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * A completely disgusting BSP-type node tree implementation,
 * written by someone who doesn't really understand BSP or basic
 * maths.  Probably best if you just close the file and pretend
 * you never saw this.
 *
 * @author  njmcode
 */

var BSPNode = function(x, y, w, h, MIN_REGION_SIZE) {
    var self = this;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.splitType = null;

    this.childNodes = [];
    this.parent = null;

    this.area = function() {
        return self.w * self.h;
    };

    this.splitRandom = function() {

        if (self.w < MIN_REGION_SIZE * 2 && self.h < MIN_REGION_SIZE * 2) return false;

        var dir;

        if (self.w < MIN_REGION_SIZE * 2) {
            dir = 'horiz';
        } else if (self.h < MIN_REGION_SIZE * 2) {
            dir = 'vert';
        } else if (w > h) {
            dir = 'vert';
        } else {
            dir = rndInt(0, 9) % 2 === 0 ? 'horiz' : 'vert';
        }

        var hm = Math.floor(MIN_REGION_SIZE / 2);
        //var pos = (dir == 'horiz') ? Math.floor(self.h / 2) : Math.floor(self.w / 2);
        var pos = (dir == 'horiz') ? Math.floor(self.h / 2) + rndInt(-hm, hm) : Math.floor(self.w / 2) + rndInt(-hm, hm);
        console.log('bsp', x, y, w, h, MIN_REGION_SIZE, hm, pos);
        if (pos < 0) return false;

        var x1 = self.x;
        var y1 = self.y;
        var w1 = (dir == 'horiz') ? self.w : pos;
        var h1 = (dir == 'horiz') ? pos : self.h;

        var x2 = (dir == 'horiz') ? x1 : x1 + pos;
        var y2 = (dir == 'horiz') ? y1 + pos : y1;
        var w2 = (dir == 'horiz') ? self.w : self.w - (pos);
        var h2 = (dir == 'horiz') ? self.h - (pos) : self.h;

        var node1 = new BSPNode(x1, y1, w1, h1, MIN_REGION_SIZE);
        var node2 = new BSPNode(x2, y2, w2, h2, MIN_REGION_SIZE);
        node1.parent = self;
        node2.parent = self;

        self.childNodes.push(node1);
        self.childNodes.push(node2);
        self.splitType = dir;

        return true;
    };

    this.splitRandomRecursive = function(recursionsLeft) {
        //console.log('split recursion: ' + recursionsLeft);
        if (recursionsLeft <= 0) return false;

        self.splitRandom();
        if (self.childNodes.length) {
            recursionsLeft--;
            self.childNodes[0].splitRandomRecursive(recursionsLeft);
            self.childNodes[1].splitRandomRecursive(recursionsLeft);
        }
    };

}

module.exports = BSPNode;