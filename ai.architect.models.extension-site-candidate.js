/**
 * Represents an area (represented as a bounding box) that is suitable for building energy extensions.
 *
 * @param numExtensionsSupported {number}   Number of extensions that can be built in this area.
 * @param boundingBox {BoundingBox}         Encloses the area where the extensions can be built.
 *
 */
function ExtensionSiteCandidate(numExtensionsSupported, boundingBox) {
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
     * Indication of how suitable this area is for building. Higher scores are better.
     */
    this.getScore = function () {
        return numExtensionsSupported * extensionScoreValue;
    };
}

module.exports = ExtensionSiteCandidate;
