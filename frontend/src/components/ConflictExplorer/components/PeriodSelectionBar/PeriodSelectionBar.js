import AppBar from '@mui/material/AppBar';
import './PeriodSelectionBar.scss';
import { useState, useEffect } from 'react';
// MUI components
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
//Constant & Content
import content from "../../../../content/content";
// components
import styles from "../../styles/global_variables.scss"
import PeriodTimePicker from './PeriodTimePicker/PeriodTimePicker';
import ColourSettings from '../ColourSettings/ColourSettings';
import Help from '../PeriodSelectionBar/Help';
import SuggestedCitation from "../../../Popover/SuggestedCitation";
// external libraries
import moment from 'moment';

export default function PeriodSelectionBar(props) {
    const [timeStart, setTimeStart] = useState(moment(props.initialStart, 'YYYY-MM-DD'));
    const [timeEnd, setTimeEnd] = useState(moment(props.initialEnd, 'YYYY-MM-DD'));
    const [isInvalid, setIsInvalid] = useState(false);
    const [needFetching, setNeedFetching] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    useEffect(() => {
        if (!props.gw_number || needFetching) return;
        setNeedFetching(true);
      }, [props.gw_number]);

    
    
    const handleStartChange = (event) => {
        const newStart = moment(event).startOf('day');
        setTimeStart(newStart);
    };   
    
    const handleEndChange = (event) => {
        const newEnd = moment(event).endOf('day');
        setTimeEnd(newEnd);
    }; 

    function applyChanges(){
        props.getByDate(timeStart, timeEnd);
    }

    useEffect(() => {
        if(timeEnd < timeStart){
            setIsInvalid(true);
        } else {
            setIsInvalid(false);
        }
    }, [timeStart, timeEnd]);

    return (
        <AppBar position='static' color='primary' className='period-selection-wrapper' elevation={0} sx={{marginBottom: {xs:'10px', md:'5px'}}}>
            <Toolbar variant="dense" className='period-selection-toolbar' sx={{padding: {xs:'20px 20px 20px 20px', md:'20px 18px 20px 18px'}, boxSizing: 'border-box'}}>
                <Box className='period-selection-items' sx={{gap: {xs:'20px'}, flexDirection: {xs:'column', md:'row'}, width: {xs:'100%', md:'inherit'}}}>
                    <Box className='time-start-selector' sx={{width: {xs:'100%', md:'inherit'}}}>
                        <FormControl 
                        sx={{ m: 1, ml:2, width: {xs:'100%', md:'inherit'} }} 
                        size="small"                        
                        className='period-selector date'
                        >
    
                            <PeriodTimePicker
                            initialTime={timeStart}
               
                            handleDateChange={handleStartChange}
                            kind={'Start date'}                                                        
                            ></PeriodTimePicker>
                        </FormControl>
                    </Box>
                    <Stack direction={'row'} sx={{gap: {xs:'20px'}, width: {xs:'100%', md:'inherit'}, flexDirection: {xs:'column', md:'row'}}}>
                        <div className='time-end-selector'>
                            <FormControl 
                            sx={{ m: 1, ml:2, width: {xs:'100%', md:'inherit'} }} 
                            size="small"
                            color='secondary'
                            className='period-selector date'
                            >
                                <PeriodTimePicker className='time-picker'
                                initialTime={timeEnd}
                          
                                handleDateChange={handleEndChange}
                                kind={'End date'}    
                                                            
                                ></PeriodTimePicker>
                            </FormControl>
                        </div>
                        <Button
                        id="apply-period"
                        variant="outlined" 
                        disableElevation
                        onClick={applyChanges}
                        sx={{padding: {xs:'8px 12px'}, fontSize: '16px', borderRadius: '10px', border: '2px solid #3D76AB', background: styles.textWhite, color: styles.lightBlue, lineHeight: '30px', textTransform: 'none', letterSpacing: '0', minWidth:'68px',
                        '&:hover': {
                            border: '2px solid #3D76AB',
                            background: styles.textWhite,
                            color: styles.lightBlue
                        }
                        }}
                        // disabled={isDisabled}
                        >
                            Apply
                        </Button>


                        { isInvalid?
                        <div className='warning-mismatch'>
                            <Typography color='error' sx={{fontSize:12}}>Start date is after end date</Typography>
                        </div>
                        :null
                    }
                    </Stack>
                   
                </Box>
                
                {!isMobile &&<Box className='period-end-items' sx={{gap: {xs:'20px'}}}>

                <SuggestedCitation  tooltipTexts={content.CONFLICT_TOOLTIP_CONTENT_TEXT} copyText={content.CONFLICT_TOOLTIP_COPY_TEXT} />

                    <Box className='period-colour-settings' sx={{ minWidth: {xs:'100%', md:'178px'}, letterSpacing: '0'}}>
                        <ColourSettings
                        eventTypeColours={props.eventTypeColours}
                        applyChangeEventTypeColours={props.applyChangeEventTypeColours}
                        linkTypeColours={props.linkTypeColours}
                        applyChangeGraphSettings={props.applyChangeGraphSettings}                        
                        ></ColourSettings>
                    </Box>
                    
                    <Help setStepsEnabled={props.setStepsEnabled}/>
                </Box>}
            </Toolbar>
            
        </AppBar>
    );
}
