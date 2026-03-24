// Styles
import "./ActorCard.scss";

// React hooks and features
import { useState, useEffect, Suspense, lazy } from "react";
import PropTypes from "prop-types";

// Backend data fetching utilities
import { getPeriodInfo, getActorTimeline } from "../../utils/queryBackend";

// MUI components 
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

// Internal components
import ActorStatsPanel from "../ActorCard/ActorStatsPanel/ActorStatsPanel";
import ActorEventsTab from "../ActorCard/ActorEventsTab/ActorEventsTab";
import ActorTabs from "../ActorCard/ActorTabs/ActorTabs";

// Global styles (SCSS variables)
import styles from "../../styles/global_variables.scss";

// Lazily loaded component
const ActorIcon = lazy(() => import("../ActorIcon/ActorIcon"));
export default function ActorCard(props) {
  const [actorInfo, setActorInfo] = useState(null);
  const [timelineInfo, setTimelineInfo] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [showFull, setShowFull] = useState(false);
  const [eventsPeriodChecked, setEventsPeriodChecked] = useState(false);
  const [relevantCollaborationsFull, setRelevantCollaborationsFull] = useState(
    []
  );
  const [relevantCollaborationsPeriod, setRelevantCollaborationsPeriod] =
    useState([]);
  const [displayCollaborations, setDisplayCollaborations] = useState([]);
  const [relevantOppositionsFull, setRelevantOppositionsFull] = useState([]);
  const [relevantOppositionsPeriod, setRelevantOppositionsPeriod] = useState(
    []
  );
  const [displayOppositions, setDisplayOppositions] = useState([]);

  useEffect(() => {
    // whenever the card is opened, fetch necessary data from API
    if (props.open && props.gw_number) {
      setActorInfo(null);
      queryActorInformation();
      getActorTimeline({ id: props.actor.id, gw_number: props.gw_number }).then(
        (responseData) => {
          setTimelineInfo(responseData);
        }
      );
    }
    if (props.fullPeriod) {
      setShowFull(true);
    }
  }, [props.open]);

  useEffect(() => {
    if (!props.actor || !props.open) return;

    const computeAndSetCollaborations = () => {
      const full = getSortedActors(props.actor.collaborations);
      setRelevantCollaborationsFull(full);

      if (actorInfo) {
        const period = getSortedActors(actorInfo.collaborations);
        setRelevantCollaborationsPeriod(period);
        if (!showFull) setDisplayCollaborations(period);
      }

      if (showFull) setDisplayCollaborations(full);
    };

    const computeAndSetOppositions = () => {
      const full = getSortedActors(props.actor.oppositions);
      setRelevantOppositionsFull(full);

      if (actorInfo) {
        const period = getSortedActors(actorInfo.oppositions);
        setRelevantOppositionsPeriod(period);
        if (!showFull) setDisplayOppositions(period);
      }

      if (showFull) setDisplayOppositions(full);
    };

    const getSortedActors = (interactionMap) => {
      return props.actors
        .filter((actor) => actor.getName() in interactionMap)
        .sort(
          (a, b) => interactionMap[b.getName()] - interactionMap[a.getName()]
        );
    };

    computeAndSetCollaborations();
    computeAndSetOppositions();
  }, [props.actor, props.open, actorInfo, showFull]);

  const handleClose = (event) => {
    // when card is closed, reset all settings
    setTabValue(0);
    setShowFull(true);
    setEventsPeriodChecked(false);
    setActorInfo(null);
    props.onClose();
  };

  function queryActorInformation() {
    if (props.gw_number) {
      getPeriodInfo(
        `?id=${props.actor.id}&start=${props.start}&end=${props.end}&gw_number=${props.gw_number}`
      ).then((responseData) => {
        setActorInfo(responseData);
      });
    }
  }

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  function handlePeriodChange() {
    // handle switch between period/full data display selection
    if (showFull) {
      //now show period
      setDisplayCollaborations(relevantCollaborationsPeriod);
      setDisplayOppositions(relevantOppositionsPeriod);
    } else {
      // now show full
      setDisplayCollaborations(relevantCollaborationsFull);
      setDisplayOppositions(relevantOppositionsFull);
    }
    setShowFull(!showFull);
  }

  function handleEventsPeriodChange() {
    setEventsPeriodChecked(!eventsPeriodChecked);
  }

  function getRelevantEventCounts(name, type) {
    if (type === "collabs") {
      if (showFull) {
        return props.actor.collaborations[name];
      } else {
        return actorInfo.collaborations[name];
      }
    } else {
      if (showFull) {
        return props.actor.oppositions[name];
      } else {
        return actorInfo.oppositions[name];
      }
    }
  }

  return (
    <div className="actor-card-dialog-wrapper">
      {actorInfo && timelineInfo && (
        <Dialog
          onClose={handleClose}
          PaperProps={{
            sx: {
              minWidth: "95%",
              height: { xs: "fit-content", md: "100%" },
              borderRadius: "20px",
            },
          }}
          open={props.open}
          container={props.container}
        >
          <DialogTitle sx={{ padding: "20px 20px 10px 20px" }}>
            <div className="actor-card-title-wrapper">
              <Suspense>
                <ActorIcon
                  dim={60}
                  actor={props.actor}
                  colour={styles.typeIconColor}
                  eventTypeColours={props.eventTypeColours}
                />
              </Suspense>
              <Typography
                fontSize="1.5rem"
                sx={{ marginLeft: "5px", marginRight: "10px" }}
              >
                {props.actor.getName()}
              </Typography>
            </div>
            {props.onClose && (
              <IconButton
                aria-label="close"
                onClick={props.onClose}
                sx={{ position: "absolute", right: 10, top: 10 }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          <DialogContent
            sx={{
              paddingLeft: { xs: "20", md: "20px" },
              paddingRight: { xs: "20", md: "20px" },
            }}
          >
            <div className="actor-card-wrapper">
              <ActorTabs
                tabValue={tabValue}
                onTabChange={handleTabChange}
                darkBlue={styles.darkBlue}
              />
              {tabValue === 0 && (
                <ActorStatsPanel
                  actor={props.actor}
                  actorInfo={actorInfo}
                  fullPeriod={props.fullPeriod}
                  start={props.start}
                  end={props.end}
                  eventTypeColours={props.eventTypeColours}
                  timelineInfo={timelineInfo}
                  gw_number={props.gw_number}
                  actors={props.actors}
                  displayCollaborations={displayCollaborations}
                  displayOppositions={displayOppositions}
                  showFull={showFull}
                  handlePeriodChange={handlePeriodChange}
                  getRelevantEventCounts={getRelevantEventCounts}
                />
              )}
              {tabValue === 1 && (
               <ActorEventsTab
               fullPeriod={props.fullPeriod}
               start={props.start}
               end={props.end}
               eventsPeriodChecked={eventsPeriodChecked}
               handleEventsPeriodChange={handleEventsPeriodChange}
               gw_number={props.gw_number}
               actors={props.actors}
               actor={props.actor}
               eventTypeColours={props.eventTypeColours}
             />             
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

ActorCard.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  actor: PropTypes.shape({
    getName: PropTypes.func.isRequired,
    eventTypeSummary: PropTypes.object.isRequired,
    eventReportIds: PropTypes.array.isRequired,
    collaborations: PropTypes.object,
    oppositions: PropTypes.object,
    id: PropTypes.number,
  }).isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  fullPeriod: PropTypes.bool.isRequired,
  gw_number: PropTypes.number.isRequired,
  actors: PropTypes.array.isRequired,
  eventTypeColours: PropTypes.object.isRequired,
};
