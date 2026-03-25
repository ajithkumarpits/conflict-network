import React from "react";
import "./SplitWindow.scss";
import Box from "@mui/material/Box";
import LocationMap from "../LocationMap/LocationMap";
import LocationGraph from "../LocationGraph/LocationGraph";

function SplitWindow(props) {
  const loc = props.location;
  const window = props.windowState;

  function getClass() {
    if (loc === "left") {
      return window === "left" ? "hide" : "full";
    } else {
      return window === "right" ? "hide" : "full";
    }
  }

  return (
    <Box className={`split-wrapper ${getClass()}`} sx={{ minHeight: { xs: "410px", md: "565px" } }}>
      {loc === "left" ? (
        <LocationGraph
          gw_number={props.gw_number}
          start={props.start}
          end={props.end}
          graphData={props.graphData}
          minSize={props.minSize}
          selectedInGraph={props.selectedInGraph}
          neighbourDegree={props.neighbourDegree}
          updateFiltering={props.filterEvents}
          actors={props.actors}
          actorNames={props.actorNames}
          eventTypeColours={props.eventTypeColours}
          linkTypeColours={props.linkTypeColours}
          isSelectable={true}
          highlightState={props.highlightState}
          updateGraphSelection={props.updateGraphSelection}
          labelSize={props.labelSize}
          linkWidth={props.linkWidth}
          nodeThreshold={props.nodeThreshold}
          layoutAlgorithm={props.layoutAlgorithm}
          isFullscreen={props.isFullscreen}
          setIsFullscreen={props.setIsFullscreen}
          includePeaceData={props.includePeaceData}
          countryName={props.countryName}
        />
      ) : (
        <LocationMap
          gw_number={props.gw_number}
          start={props.start}
          end={props.end}
          events={props.events}
          actors={props.actors}
          actorNames={props.actorNames}
          eventTypeColours={props.eventTypeColours}
          countryName={props.countryName}
        />
      )}
    </Box>
  );
}

export default React.memo(SplitWindow);
