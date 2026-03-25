class Actor:
    """
    Represents an actor created from the event data.
    """
    def __init__(self, actorId, eventReportIds, eventTypeSummary, eventTypes, links, collaborations, oppositions, actorType):
        self.__actorId = actorId
        self.__eventReportIds = eventReportIds
        self.__eventTypeSummary = eventTypeSummary
        self.__eventTypes = eventTypes
        self.__links = links
        self.__collaborations = collaborations
        self.__oppositions = oppositions
        self.__actorType = actorType

    @property
    def id(self):
        return self.__actorId

    @property
    def events(self):
        return self.__eventReportIds

    @property
    def eventSummary(self):
        return self.__eventTypeSummary

    @property
    def eventTypes(self):
        return self.__eventTypes

    @property
    def links(self):
        return self.__links

    @property
    def collaborations(self):
        return self.__collaborations

    @property
    def oppositions(self):
        return self.__oppositions

    @property
    def actorType(self):
        return self.__actorType
