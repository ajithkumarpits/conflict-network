import styles from '../../styles/global.scss';
import "./DisplaySwitch.scss";
import { useState } from "react";
// MUI components
import Stack from "@mui/material/Stack";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/system";
 
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: "none",
  textTransform: "none",
  color: "#7A8CA2",
  backgroundColor: "transparent",
  "&.Mui-selected": {
    color: styles.textLight,
    backgroundColor: styles.lightPrimary,
    borderRadius: 100,
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
  const [selected, setSelected] = useState(props.options[0]); 
  function handleChange(event, newValue) {
    if (newValue !== null) {
      setSelected(newValue);
      props.handleSwitchChange(newValue);
    }
  }
 
  return (
    <ToggleButtonGroup
      value={selected}
      exclusive
      onChange={handleChange}
      sx={{
        backgroundColor: styles.darkBlue600,
        borderRadius: "100px",
        gap: {
          xs: "8px",
          md: "10px"
        },
        padding: {
          xs: "4px",
          md: "5px"
        },
      }}
      className="toggle-switcher"
    >
        <StyledToggleButton className="switcher-item"
            value={props.options[0]}
            style={{ textTransform: "none", borderRadius: "100px" }}
            sx={{ padding: { xs: '4px 15px 4px 4px', md: '5px 15px 5px 5px'} }}
        >
            <Stack direction={"row"} sx={{ justifyContent: "center", alignItems: "center", gap: { xs: '8px', md: '10px'}, fontSize: { xs: '14px', md: '16px'}}} className="switcher-item-block">
                <img src={selected === props.options[0] ? props.switchImg1.active : props.switchImg1.deActive} width={45} height={46} alt='icon' />
                {props.options[0]}
            </Stack>        
        </StyledToggleButton>
        <StyledToggleButton className="switcher-item"
            value={props.options[1]}
            style={{ textTransform: "none", borderRadius: "100px" }}              
            sx={{ padding: { xs: '4px 15px 4px 4px', md: '5px 15px 5px 5px'} }}            
        >
            <Stack direction={"row"} sx={{ justifyContent: "center", alignItems: "center", gap: "10px", fontSize: { xs: '14px', md: '16px'}}} className="switcher-item-block">
                <img src={selected === props.options[1] ? props.switchImg2.active : props.switchImg2.deActive}  width={45} height={46} alt='icon'/>
                {props.options[1]}
            </Stack>
        </StyledToggleButton>
    </ToggleButtonGroup>    
  );
}