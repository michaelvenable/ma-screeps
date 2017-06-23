/**
 * Defines a square area.
 *
 * @param center {object}       Defines the center point of the square area.
 * @param center.x {number}     Defines the X (horizontal value of the center point.
 * @param center.y {number}     Defines the Y (veritical) value of the center point.
 * @param radius {number}       Defines the distance from the center point to the outer edge of the bounding
 *                              box.
 */
function BoundingBox(center, radius) {
    /**
     * The top-left corner of the bounding box.
     */
    this.topLeft = {
        x: center.x - radius,
        y: center.y - radius
    };

    /**
     * The bottom-right corner of the bounding box.
     */
    this.bottomRight = {
        x: center.x + radius,
        y: center.y + radius
    };

    /**
     * Calculates the center of this bounding box.
     *
     * @return {object} Object with X, Y values.
     */
    this.getCenter = function () {
        return {
            x: Math.floor((this.bottomRight.x + this.topLeft.x) / 2),
            y: Math.floor((this.bottomRight.y + this.topLeft.y) / 2)
        };
    };

    /**
     * Calculates the height of this bounding box.
     *
     * @return {number}     Height of this bounding box, specified in tiles.
     */
    this.getHeight = function () {
        return this.bottomRight.y - this.topLeft.y + 1;
    };

    /**
     * Returns the locations contained within this bounding box as an array.
     *
     * @example
     * let boundingBox = new BoundingBox({ x: 5, y: 5 }, 1);
     * boundingBox.getLocations();
     * => [{x: 4, y: 4}, {x: 4, y: 5}, {x: 4, y: 6},
     *     {x: 5, x: 4}, {x: 5, x: 5}, {x: 5, x: 6},
     *     {x: 6, x: 4}, {x: 6, x: 5}, {x: 6, x: 6}]
     */
    this.getLocations = function () {
        let locations = [];

        for (let x = this.topLeft.x; x <= this.bottomRight.x; x++) {
            for (let y = this.topLeft.y; y <= this.bottomRight.y; y++){
                locations.push({ x: x, y: y });
            }
        }

        return locations;
    };

    /**
     * Calculates the width of this bounding box.
     *
     * @return {number}     Width of this bounding box, specified in tiles.
     */
    this.getWidth = function () {
        return this.bottomRight.x - this.topLeft.x + 1;
    };

    /**
     * String representation.
     */
    this.toString = function () {
        return `(${this.topLeft.x}, ${this.topLeft.y}) - (${this.bottomRight.x}, ${this.bottomRight.y})`;
    }
}

BoundingBox.fromCoordinates = function (topLeft, bottomRight) {
    let box = new BoundingBox(0, 0);

    box.topLeft = topLeft;
    box.bottomRight = bottomRight;

    return box;
};

module.exports = BoundingBox;
