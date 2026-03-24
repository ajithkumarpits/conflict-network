import {ActorPrototype} from './ActorPrototype';

export class BaseActor extends ActorPrototype {

    constructor(actorObject){
        // create actor prototype with ID
        super(actorObject['id'], 
        actorObject['eventReportIds'], 
        actorObject['actorType'], 
        actorObject['eventTypeSummary'], 
        actorObject['eventTypes'], 
        actorObject['links'], 
        actorObject['collaborations'], 
        actorObject['oppositions']); 
        // specify subclass specific attributes
        this.dataBasedName = actorObject['dataBasedName'];
    }

    // name logic
    getName(){
        return this.dataBasedName;
    }

    // for printing purposes
    toString() {
        return JSON.stringify(this);
    }
}