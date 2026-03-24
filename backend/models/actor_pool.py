from .base_actor import BaseActor

class ActorPool:
    """
    Represents all actors that are created from the data set.
    """
    def __init__(self):
        self.__baseActors = []

    @property
    def actors(self):
        return self.__baseActors

    def addBaseActor(self, actorId, dataBasedName, actorType, eventReportIds, eventTypeSummary, eventTypes, links, collaborations, oppositions):
        newActor = BaseActor(actorId, dataBasedName, actorType, eventReportIds, eventTypeSummary, eventTypes, links, collaborations, oppositions)
        self.__baseActors.append(newActor)
