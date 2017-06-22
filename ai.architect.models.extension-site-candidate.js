let helpers = require('helpers');

/**
 * Represents an area (represented as a bounding box) that is suitable for building energy extensions.
 *
 * @param room {Room}                   Room that will contain the extensions.
 * @param boundingBox {BoundingBox}     Encloses the area where the extensions can be built.
 */
function ExtensionSiteCandidate(room, boundingBox) {
    let extensionScoreValue = 5;

    /**
     * Encloses the area where the extensions can be built.
     */
    this.boundingBox = boundingBox;

    /**
     * Determines the center of the area represented by this candidate.
     *
     * @param {object}  Object containing x and y properties.
     */
    this.getCenter = function () {
        return this.boundingBox.getCenter();
    }

    /**
     * Calculates the number of extensions that can be supported by this site. The calculated depends on the
     * size of the site.
     *
     * @return {number}     Number of extensions that can fit on this site while still ensuring creeps have
     *                      room to maneuver. Never less than zero.
     */
    this.getNumberOfExtensionsAllowed = function () {
        if (this.boundingBox.getWidth() === 3 && this.boundingBox.getHeight() === 3) {
            // A 3x3 grid can fit a single extension in the center.
            return 1;
        } else {
            console.error('An oddly shaped candidated was created for extensions.');
            return 0;
        }
    };

    /**
     * Indication of how suitable this area is for building. Higher scores are better.
     */
    this.getScore = function () {
        return this.getNumberOfExtensionsAllowed() * extensionScoreValue - getAverageDistanceToSpawns();
    };

    /**
     * Calculates the average distance from this site candidate to the spawns in this room.
     *
     * @return {number}     The average distance from the center of this candidate to each spawn in this room.
     *                      The number is not rounded, so it is possible it is not a whole number.
     */
    function getAverageDistanceToSpawns() {
        let sumOfDistance = 0;
        let numOfSpawns = 0;

        let center = boundingBox.getCenter();

        room.find(FIND_MY_SPAWNS)
            .forEach((spawn) => {
                sumOfDistance += helpers.distance(spawn.pos, center);
                numOfSpawns++;
            });

        if (numOfSpawns === 0) {
            console.error('You are trying to place extensions in a room with no spawns. Why?');
            return 0;
        }

        return sumOfDistance / numOfSpawns;
    }
}

/**
 * Compare function that can be used to sort extension site candidates.
 */
ExtensionSiteCandidate.compareFunction = function (a, b) {
    let aScore = a.getScore();
    let bScore = b.getScore();

    if (aScore > bScore) {
        return -1;
    } else if (aScore < bScore) {
        return 1;
    }

    return 0;
};

module.exports = ExtensionSiteCandidate;
