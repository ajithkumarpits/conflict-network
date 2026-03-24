
import "./LocationGraphConfiguration.scss";
import styles from "../../styles/global_variables.scss"
import React,{ useState ,useCallback ,useEffect } from "react";
// MUI components
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
//External Library
import { FixedSizeList} from "react-window";
//Hooks
import useIsBelowMd from "../../../../hooks/useIsBelowMd";

//Components
import NodeSwitch from "./NodeSwitch";
import LayoutSwitch from "./LayoutSwitch";

function LocationGraphConfiguration(props) {

  const [actorSelection, setActorSelection] = useState("");
  const [selectNeighbours, setSelectNeighbours] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const isBelowMd = useIsBelowMd()

// Handles the slider/toggle for degree of neighbors
const handleDegreeChange = useCallback((event, newValue) => {
  if (newValue !== null) {
    setSelectNeighbours(newValue); // Update the selected neighbor degree in local state
    props.setNeighbourDegree(newValue ? 1 : 0); // Update parent component with degree (1 if truthy, 0 otherwise)
  }
}, [props.setNeighbourDegree]);

// Handles actor selection from dropdown or input
function handleActorSelection(event) {
  const newActor = event.target.value;
  setActorSelection(newActor);
}

// Toggles highlight state for an actor
function highlightActor() {
  const newIsOn = !isOn;
  setIsOn(newIsOn);

  if (newIsOn) {
    // Highlight the selected actor
    props.findActor({ actorName: actorSelection, isHighlighted: true });
  } else {
    // Unhighlight everything
    props.findActor({ actorName: "", isHighlighted: false });
  }
}

// Resets the highlight state and clears selected actor
function resetHighlight() {
  setActorSelection(""); 
  props.findActor({ actorName: "", isHighlighted: false }); // Remove any highlights
  setIsOn(false); // Reset toggle to off
  
  // Also reset layout and peace data
  if (props.layoutAlgorithm !== "force-directed") {
    props.onLayoutChange("force-directed");
  }
  if (props.includePeaceData) {
    props.setIncludePeaceData(false);
  }
}

// Retrieves list of actor names from the graph data for search/autocomplete dropdown
function getSearchNames() {
  if (!props.graphData || !Array.isArray(props.graphData.nodes)) {
    return []; 
  }
  const names = props.graphData.nodes
    .map((node) => node?.actor_name) // Extract actor_name from each node
    .filter(Boolean);

  return names.sort();
}

// Effect: Whenever actorSelection or isOn changes, highlight the actor (if isOn is true)
useEffect(() => {
  if (isOn && actorSelection) {
    props.findActor({ actorName: actorSelection, isHighlighted: true });
  }
}, [actorSelection, isOn]);


const VirtualizedMenuList = React.forwardRef(function VirtualizedMenuList(props, ref) {
  const { children, style, ...other } = props;
  const itemData = React.Children.toArray(children).filter(Boolean);
  const itemCount = itemData.length;
  const ITEM_HEIGHT = 40;
  const MAX_VISIBLE_ITEMS = 6;
  const listHeight = Math.min(itemCount, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT;

  const Row = ({ index, style }) => {
    return <div style={style}>{itemData[index]}</div>;
  };

  return (
    <div ref={ref} style={{ ...style, height: listHeight, overflowY: 'auto' }} {...other}>
      <FixedSizeList
        height={listHeight}
        width="100%"
        itemSize={ITEM_HEIGHT}
        itemCount={itemCount}
        itemData={itemData}
      >
        {Row}
      </FixedSizeList>
    </div>
  );
});



  return (
    <Box
      className="location-graph-config"
      sx={{ padding: { xs: "20px 20px 20px 20px", md: "20px 18px 20px 18px" }, flexDirection: { xs: "row", md: "row" }, backgroundColor: styles.primaryColor, gap: '20px', marginBottom: { xs: "10px", md: "0" }}}
    >
      <Box className="location-graph-group" sx={{maxWidth: { xs: "100%", md: "302px" }, width: '100%'}}>
        <FormControl
          sx={{ p:0, m:0,width: '100%', flexDirection: 'row', alignItems: 'center', gap: '20px', justifyContent: 'space-between'}}
          size="small"
          color="secondary"
          className="degree"
        >
          <Typography
            variant="button"
            display="block"
            mx={1}
            sx={{
              fontSize: "16px",
              fontWeight: "700",
              margin: "0",
              display: { xs: "none", md: "block" },
              textTransform: 'none',              
              color: styles.darkBlue600,
              letterSpacing: '0.75px'
            }}
          >
            Filter 
          </Typography>

          <NodeSwitch
            selectNeighbours={selectNeighbours}
            onChange={handleDegreeChange}
          />
        </FormControl>
      </Box>

      <Box className="location-graph-group" sx={{maxWidth: { xs: "100%", md: "280px" }, width: '100%', minWidth: '200px'}}>
        <FormControl
          sx={{ p: 0, width: '100%'}}
          size="small"
          color="secondary"
          className="loc-graph-selector threshold"
        >
          <LayoutSwitch
            layoutAlgorithm={props.layoutAlgorithm}
            onLayoutChange={props.onLayoutChange}
          />
        </FormControl>
      </Box>

      <Box className="location-graph-group" sx={{maxWidth: { xs: "100%", md: "334px" }, width: '100%', minWidth: '200px'}}>
        <FormControl
          sx={{ p: 0, width: '100%'}}
          size="small"
          color="secondary"
          className="loc-graph-selector threshold"
        >
          <TextField
  id="node-threshold"
  select
  label="Min.event count"
  value={props.newThreshold}
  onChange={props.handleThresholdChange}
  fullWidth
  margin="normal"
  InputLabelProps={{
    shrink: true,
  }}
  SelectProps={{
    IconComponent: ExpandMoreIcon,
    MenuProps: {
      PaperProps: {
        style: {
          padding: 0,
          margin: 0,
          overflow: 'hidden',
        },
      },
      MenuListProps: {
        component: VirtualizedMenuList,
      },
    },
  }}
>
  {props.maxNode
    ? [...Array(props.maxNode).keys()].map((i) => (
        <MenuItem key={`threshold-${i + 1}`} value={i + 1}>
          {i + 1}
        </MenuItem>
      ))
    : null}
</TextField>

        </FormControl>
      </Box>

      <Box className="location-graph-group peace-data-toggle" sx={{maxWidth: { xs: "100%", md: "160px" }, width: '100%', flexDirection: { xs: "row", md: "row" }}}>
        <FormControl
          sx={{ p: 0, gap: '20px', width: '100%', flexDirection: { xs: "row", md: "row" }, alignItems: { xs: "center", md: "center"}}}
          size="small"
        >
          <Box className="toggle-container" sx={{ p: 0, width: '100%', minWidth: '150px' }}>
            <Button
              className={`toggle-switch ${props.includePeaceData ? "on" : "off"}`}
              onClick={() => props.setIncludePeaceData(!props.includePeaceData)}
            >
              <Box className="toggle-circle"></Box>
              <Typography component="span" className="toggle-text">
                {props.includePeaceData ? "Peace Data On" : "Peace Data Off"}
              </Typography>
            </Button>
          </Box>
        </FormControl>
      </Box>

      <Box className="location-graph-group find-actors" sx={{maxWidth: { xs: "100%", md: "491px" }, width: '100%', flexDirection: { xs: "row", md: "row" }}}>
        <FormControl
          sx={{ p: 0, gap: '20px', width: '100%', flexDirection: { xs: "row", md: "row" }, alignItems: { xs: "center", md: "center"}}}
          size="small"
          color="secondary"
          className="actor-graph-selector"
        >
          <TextField
            select 
            id="actor-graph-selector"
            value={actorSelection}
            onChange={handleActorSelection}
            label="Find actor"
            fullWidth
            InputLabelProps={{ shrink: true }}
            SelectProps={{
              displayEmpty: true,
              IconComponent: ExpandMoreIcon,
            }}
            sx={{ backgroundColor: styles.textWhite, minWidth: '200px' }}
          >
            <MenuItem disabled value="">
              Find actor
            </MenuItem>
            {getSearchNames().map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>


          {(isBelowMd ? actorSelection !== "" : true) && (
     <Box className="toggle-container" sx={{ p: 0, maxWidth: '130px', width: '100%', minWidth: '130px' }}>
    <Button
      className={`toggle-switch ${isOn ? "on" : "off"}`}
      onClick={highlightActor}
      disabled={actorSelection === ""}
    >
      <Box className="toggle-circle"></Box>
      <Typography component="span" className="toggle-text">
        {isOn ? "Highlight on" : "Highlight off"}
      </Typography>
    </Button>
  </Box>
)}

        </FormControl>
      </Box>

      <Button
        id="highlight-reset"
        variant="text"
        color="secondary"
        disableElevation
        onClick={resetHighlight}
        className="graph-select graph-reset-select"
        sx={{ fontSize: "16px", margin: { xs: "0 auto", md: "0 0 0 auto" },  padding: '0', cursor: 'pointer', color: styles.redMedium, textTransform: 'none', minWidth: '120px',
          "&.Mui-disabled": { color: styles.redMedium}
        }}
        size="small"
        disabled={actorSelection === "" && props.layoutAlgorithm === "force-directed" && !props.includePeaceData}
        >
        Reset selection
        </Button>

    </Box>
  );
}
export default React.memo(LocationGraphConfiguration);


