/**
 * Decides where structures will be placed.
 * 
 * @param room {StructureRoom}  The room where this architect will focus its efforts. The architect will only place construction
 *                              sites in this room.
 */
let Architect = function (room) {
    /**
     * 
     */
    this.establishConstructionSites = function () {
        establishRoadsFromSpawnsToEnergySources();
        establishRoadsFromEnergySourcesToController();
    }
    
    function establishRoadsFromSpawnsToEnergySources() {
        let spawns = room.find(FIND_MY_SPAWNS);
        let sources = room.find(FIND_SOURCES);
        
        for (let i = 0; i < spawns.length; i++) {
            let spawn = spawns[i];
            
            for (let i = 0; i < sources.length; i++) {
                let source = sources[i];
                
                establishRoad(spawn.pos, source.pos);
            }
        }
    }
    
    function establishRoadsFromEnergySourcesToController() {
        let sources = room.find(FIND_SOURCES);
        
        for (let i = 0; i < sources.length; i++) {
            let source = sources[i];
            establishRoad(source.pos, room.controller.pos);
        }
        
    }
    
    function establishRoad(from, to) {
        let path = room.findPath(from, to, { ignoreCreeps: true, ignoreRoads: true });
        
        for (let i = 0; i < path.length; i++) {
            let location = path[i];
            if (!isSomethingHere(location)) {
                establishRoadConstructionSite(location);
            }
        }
    }
    
    function isSomethingHere(location) {
        let objects = room.lookAt(location.x, location.y);
        return objects.length > 1;
    }
    
    function establishRoadConstructionSite(location) {
        let result = room.createConstructionSite(location.x, location.y, STRUCTURE_ROAD);

        if (result === OK) {
            console.log(`Road destined for ${location.x}, ${location.y}.`);
        } else {
            console.log(`Can't build road at ${location.x}, ${location.y}, because ${result}.`);
        }
    }
}

module.exports = Architect;