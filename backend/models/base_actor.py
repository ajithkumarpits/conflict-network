from .actor import Actor

class BaseActor(Actor):
    """
    Represents an actor created directly from the data set.
    """
    def __init__(self, actorId, dataBasedName, actorType, eventReportIds, eventTypeSummary, eventTypes, links, collaborations, oppositions):
        super().__init__(actorId, eventReportIds, eventTypeSummary, eventTypes, links, collaborations, oppositions, actorType)
        self.__dataBasedName = dataBasedName

    @property
    def id(self):
        return super().id

    @property
    def name(self):
        return self.__dataBasedName

    @property
    def originalName(self):
        return self.__dataBasedName

    def getDict(self):
        return {
            'id': super().id,
            'dataBasedName': self.__dataBasedName,
            'eventReportIds': super().events,
            'eventTypeSummary': super().eventSummary,
            'eventTypes': super().eventTypes,
            'collaborations': super().collaborations,
            'oppositions': super().oppositions,
            'links': super().links,
            'actorType': super().actorType,
        }
