export class ActorPrototype{
    constructor(id, eventReportIds, actorType, eventTypeSummary, eventTypes, links, collaborations, oppositions){
        this.id = id;
        this.eventReportIds = eventReportIds;
        this.actorType = actorType;
        this.eventTypeSummary = eventTypeSummary;
        this.eventTypes = eventTypes
        this.links = links
        this.collaborations = collaborations
        this.oppositions = oppositions
    }

    getId() {
        return this.id
    }

    // report IDs logic
    getReportIds(){
        return this.eventReportIds;
    }

    // actor type logic
    getActorType(){
        return this.actorType;
    }

    getEventTypeSummary(){
        return this.eventTypeSummary;
    }

    // for printing purposes
    toString() {
        return JSON.stringify(this);
    }
}