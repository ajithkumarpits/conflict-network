import './DisplayHeader.scss';
// MUI Components
import Box from '@mui/material/Box';
// components
import DisplaySwitch from '../DisplaySwitch/DisplaySwitch';
import SearchBox from '../SearchBox/SearchBox';

export default function DisplayHeader(props) {

 
  return (
    <Box className='display-controls'  sx={{ padding: { xs: '20px 12px', md: '40px 18px 30px 18px'}, alignItems: 'center', flexDirection: { xs: 'column', md: 'row'},gap: { xs: '15px', md: '0'},}}   >
        <DisplaySwitch  
        handleSwitchChange={props.handleSwitchChange}
        selectedOption={props.selectedOption}
        options={props.displayOptions}
        switchImg1={props.switchImg1}
        switchImg2={props.switchImg2}        
        ></DisplaySwitch>
       <SearchBox
        handleSelect={props.handleSelect}
        options={props.searchOptions}
        optionsKeys={props.optionsKeys}
        identification={props.identification}
        searchLabel={props.searchLabel}
        ></SearchBox>
    </Box>
  );
}
 