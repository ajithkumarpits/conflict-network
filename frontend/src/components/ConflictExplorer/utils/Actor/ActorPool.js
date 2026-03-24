import {BaseActor} from './BaseActor';

export class ActorPool{
    constructor(){
        this.baseActors = [];
    }

    getActors(){
        return this.baseActors;
    }

    addActor(actorObject){
        // create a base actor
        const actor = new BaseActor(actorObject)
        this.baseActors.push(actor)
    }

    updateBaseActor(actorObject){
        const idx = this.baseActors.findIndex((val, idx) => (val.id === actorObject['id']));
        if(idx !== -1){
            this.baseActors[idx] = new BaseActor(actorObject);
        }
    }

}