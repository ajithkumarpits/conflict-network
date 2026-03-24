import styles from "../../styles/global_variables.scss"
import "./LocationGraphConfiguration.scss";
// MUI components
import Stack from "@mui/material/Stack";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/system";
 
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: "none",
  textTransform: "none",
  color: "#667785",
  backgroundColor: "transparent",
  "&.Mui-selected": {
    color: styles.textWhite,
    backgroundColor: styles.lightBlue,
    borderRadius: 76,
    padding: '4px 11px 4px 11px'
  },
  "&.Mui-selected:hover": {
    backgroundColor: styles.catBlue50,
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  display: "flex",
  alignItems: "center",
  gap: "8px",  
}));
 
export default function DisplaySwitch(props) {
 
 
  return (
    <ToggleButtonGroup
      value={props.selectNeighbours}
      exclusive
      onChange={(event, newValue) => props.onChange(event, newValue)}
      sx={{
        backgroundColor: styles.lightGrey200,
        padding: "3px 3px",
        borderRadius: "76px",
        height: "40px",
        gap: "8px",
        boxSizing:'border-box',
        minWidth: '235px'
      }}
      className="toggle-switcher"
    >
        <StyledToggleButton className="switcher-item"
            value={false}
            style={{ textTransform: "none", borderRadius: "76px" }}
            sx={{ padding: { xs: '4px 11px 4px 4px', md: '4px 4px 4px 11px'}}}
        >
            <Stack direction={"row"} sx={{ justifyContent: "center", alignItems: "center", gap: { xs: '8px', md: '10px'}, fontSize: { xs: '12px'}}} className="switcher-item-block">
            node only
            </Stack>        
        </StyledToggleButton>
        <StyledToggleButton className="switcher-item"
            value={true}
            style={{ textTransform: "none", borderRadius: "76px"}}   
            sx={{ padding: { xs: '4px 11px 4px 4px', md: '4px 11px 4px 4px'}}}  
        >
            <Stack direction={"row"} sx={{ justifyContent: "center", alignItems: "center", gap: "10px", fontSize: { xs: '12px'}}} className="switcher-item-block">
                node and neighbours
            </Stack>
        </StyledToggleButton>
    </ToggleButtonGroup>    
  );
}