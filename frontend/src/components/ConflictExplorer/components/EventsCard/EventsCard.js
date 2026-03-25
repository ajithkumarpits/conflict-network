import './EventsCard.scss';
import {useState, useEffect} from 'react';
import styles from '../../styles/global_variables.scss';
// API functions
import {getReportsByFilters} from '../../utils/queryBackend';
// MUI components
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ActorCard from '../ActorCard/ActorCard';
import InfoIcon from '@mui/icons-material/Info';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Circle from '@mui/icons-material/Circle';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CircularProgress from '@mui/material/CircularProgress';
//components
import TypeIcon from '../TypeIcon/TypeIcon';
// utils
import interactionToSVG from '../../utils/interactionToSVG';
import interCodeMapping from '../../utils/interCodeMapping';
import eventTypeToText from '../../utils/eventTypeToText';
// external libraries
import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';
import moment from 'moment';
import { BsCheckCircleFill } from "react-icons/bs";

export default function EventsCard(props) {

    const [reports, setReports] = useState([]);
    const [fullReports, setFullReports] = useState([]);
    const [openReportID, setOpenReportID] = useState(null);
    const [openActorCard, setOpenActorCard] = useState(false);
    const [selectedActor, setSelectedActor] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState([]);
    const [allRelatedActors, setAllRelatedActors] = useState([])
    const [selectedActors, setSelectedActors] = useState([]);
    const [colourSettings, setColourSettings] = useState({})
    const [eventIds, setEventIds] = useState([]);
    const [loader ,setLoader]=useState(false)
    const [conflictBackground, setConflictBackground] = useState("");

    function selectFilter(code){
        const newFilter = cloneDeep(selectedFilter);
        const idx = selectedFilter.indexOf(code);
        if(idx !== -1){
            newFilter.splice(idx, 1)
        } else {
            newFilter.push(code)
        }
        setSelectedFilter(newFilter)
        queryReportById(eventIds, newFilter, selectedActors)
    }

    function updateReportIds(){

        let allIds

        if(props.link){
            allIds = props.link.reports;
        } else {
            const actor = props.mainActors[0]
            allIds = actor['eventReportIds']
        }
        
        allIds = uniq(allIds)
        setEventIds(allIds);
        queryReportById(allIds, selectedFilter, selectedActors)
    }

    useEffect(() => {
        setColourSettings(props.eventTypeColours)
    }, [props.eventTypeColours])

    useEffect(() =>{
        const collabs = props.mainActors.reduce((ac, actor) => ac.concat(Object.keys(actor['collaborations'])), [])
        const oppos = props.mainActors.reduce((ac, actor) => ac.concat(Object.keys(actor['oppositions'])), [])
        let related = uniq(collabs.concat(oppos))
        related = related.sort()

        const mainActorIds = props.mainActors.map(actor => related.indexOf(actor.getName()))

        mainActorIds.forEach(idx => related.splice(idx, 1))
        setAllRelatedActors(related)
        updateReportIds()
    }, [...props.mainActors])

    function queryReportById(ids, selectedFilter, selectedActors){
        let start = ''
        let end = ''
        if (props.start && props.end){
            start = props.start
            end = props.end
        }
        if (props.gw_number) {
            setLoader(true);
            const periodDataPromise = getReportsByFilters(
                `?main_actors=${props.mainActors.map(actor => actor.getName())}&start=${start}&end=${end}&event_types=${selectedFilter}&actor_names=${selectedActors}&gw_number=${props.gw_number}`
            ).then((responseData) => {
                setReports(responseData.event_data);
                if (responseData.background && responseData.background.length > 0) {
                    setConflictBackground(responseData.background[0].backgrounds);
                } else {
                    setConflictBackground("");
                }
            });
            const fullDataPromise = getReportsByFilters(
                `?main_actors=${props.mainActors.map(actor => actor.getName())}&start=&end=&event_types=${selectedFilter}&actor_names=${selectedActors}&gw_number=${props.gw_number}`
            ).then((responseData) => {
                if (responseData) {
                    setFullReports(responseData.event_data);
                }
            });
            Promise.allSettled([periodDataPromise, fullDataPromise]).finally(() => {
                setLoader(false);
            });
        }
        
    }

    function controlOpenReportID(clickedID){
        if(openReportID === clickedID){
            // close the info if it is already open
            setOpenReportID(null);
        }  else {
            // open the info
            setOpenReportID(clickedID);
        }
    }

    function showActorCard(actor){
        actor = actor.trim()
        setSelectedActor(actor)
        setOpenActorCard(true)
    }

    function hideActorCard(){
        setOpenActorCard(false);
    };

    function getActor(name){
        const found_by_name = props.actors.find(actor => (actor.getName() === name));
        if(!found_by_name){
            return null
        }
        else{
            return found_by_name
        }
    }

    function handleActorSelection(event){
        const newSelection = event.target.value
        setSelectedActors(newSelection)
        queryReportById(eventIds, selectedFilter, newSelection)
    }

    return (
        <div className='events-card'>
            {getActor(selectedActor)? 
            <ActorCard
            gw_number={props.gw_number}
            open={openActorCard}
            onClose={hideActorCard}
            actor={getActor(selectedActor)}
            actorName={selectedActor}
            start={props.start}
            end={props.end}
            actors={props.actors}
            fullPeriod={false}
            eventTypeColours={props.eventTypeColours}
            >
            </ActorCard>
            :null}
            <div className='events-card-wrapper'>
                <div className='events-card-filter'>
                <AppBar position='static' sx={{backgroundColor: styles.textWhite }} className='event-type-wrapper' elevation={0}>
                    <Toolbar variant="dense" className='event-type-toolbar' sx={{ flexWrap: {xs: "wrap", sm: "nowrap"}}}>
                    <Box sx={{ display: "flex", gap: {xs: "10px", sm: "20px"}, alignItems: {xs: "flex-start", sm: "center"}, flexDirection: {xs: "column", sm: "row"}, width: "100%"  }}>
                        <Typography
                            mx={1}
                            sx={{
                            fontSize: "16px",
                            fontWeight: "700",
                            margin: "0",
                            display: { xs: "flex", md: "flex" },
                            textTransform: 'none',
                            color:styles.darkBlue600,
                            letterSpacing: '0.75px'
                            }}
                        >
                            Filter   
                        </Typography>
                        <Box className="filter-event" sx={{display: "flex", flexFlow: "wrap", gap: {xs: "10px", sm: "20px"}, flexDirection: {xs: "column", sm: "row"}, width: {xs: "100%"}}}>
                            {Object.keys(eventTypeToText).map((code) => (
                                <Chip
                                key={"filter-type-" + code}
                                label={eventTypeToText[code]}
                                onClick={() => selectFilter(code)}
                                sx={{                                  
                                    fontSize: "16px",
                                    borderRadius: "10px",
                                    border: selectedFilter.includes(code)
                                    ? '1px solid #17344E'
                                    : '1px solid #F3F3F3',
                                    padding: "10px 15px",
                                    height: "50px",
                                    gap: "10px",
                                    backgroundColor: styles.textWhite,
                                    minWidth: "220px"
                                }}
                                color="primary"
                                icon={
                                    <Box
                                    sx={{ display: "flex", alignItems: "center", gap: "4px", margin: "0", padding: "0" }}
                                    >
                                    {selectedFilter.includes(code) && (
                                        <BsCheckCircleFill size={20} fill={styles.darkPrimary} />
                                    )}                                    
                                    <Circle
                                        key={"filter-type-icon-" + code}
                                        sx={{ "&&": { color: colourSettings[code] } }}                                        
                                        size={20} />
                                    </Box>
                                }
                                />
                            ))}
                        </Box>
                    </Box>
                    <Box className='event-choose-act' sx={{width: {xs: "100%", sm: "auto"},marginLeft: {xs: "0", sm: "auto"} }}>
                    <FormControl size="small" variant="outlined" sx={{width: {xs: "100%"}}}>
                    <InputLabel
                    shrink
                    id="demo-simple-select-label"                    
                    >
                    Choose Actor
                    </InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    className="name-setting-elem"
                    sx={{maxWidth: {xs: "100%", sm: "300px"}}}
                    value={selectedActors}
                    label="Choose Actor"
                    onChange={handleActorSelection}
                    multiple
                    displayEmpty
                    IconComponent={KeyboardArrowDownIcon}
                    renderValue={() => {
                        if (!selectedActors?.length) {
                        return null;
                        }
                        return (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            <Chip
                            sx={{ maxHeight: 24, fontSize: "0.7rem" }}
                            key="num-actors"
                            label={`${selectedActors.length} selected`}
                            className="selection-chip"
                            />
                        </Box>
                        );
                    }}
                    MenuProps={{ sx: { maxHeight: "50%" } }}
                    >
                    {allRelatedActors.map((item) => (
                        <MenuItem key={"filter-events-" + item} value={item}>
                        <Checkbox
                            checked={selectedActors.includes(item)}
                            color="secondary"
                        />
                        <ListItemText primary={item} />
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Box>

                        <Box className='event-report-number-wrapper' sx={{display: 'none'}}>
                            <Typography 
                            fontSize='0.8rem'
                            sx={{ px: 1, color: 'primary.contrastText' }}
                            className='event-report-number'
                            >{(props.full? fullReports?.length : reports?.length)} events</Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
                </div>
                <div className='events-card-scroll-area'>
                <Box className='interaction-type-legend'
                    sx={{marginBottom: {xs: "40px"}, flexWrap: "wrap"}}>
                    {Object.keys(interCodeMapping).map((code) => {
                    const numCode = Number(code)
                    if(numCode !== 0){
                    return(
                        <div 
                        className='interaction-legend-item'
                        key={'filter-type-' + numCode}>
                            <TypeIcon
                            type={numCode}
                            dim={15}
                            color={styles.textDark}
                            ></TypeIcon>
                            <Typography sx={{margin: '0px', textAlign:'center', color: styles.darkBlue600}} fontSize='13px' >{interCodeMapping[numCode]}</Typography>
                        </div> 
                    )} else { return null; }
                    })}
                </Box>

                {conflictBackground && (
                    <Box className='conflict-background-wrapper' sx={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', marginBottom: '20px', borderLeft: `5px solid ${styles.darkPrimary}` }}>
                        <Typography fontSize='16px' fontWeight='700' color={styles.darkBlue600} gutterBottom>
                            Conflict Background
                        </Typography>
                        <Typography fontSize='14px' color={styles.darkBlue}>
                            {conflictBackground}
                        </Typography>
                    </Box>
                )}

                {loader ? <Stack  direction="row" justifyContent={"center"} alignItems={"center"} height={"100vh"}>
                   <CircularProgress sx={{ color: '#3D76AB' }}  disableShrink /> 
                   </Stack>:

                     <List className='events-card-list' sx={{padding: '0'}}>
                    {((props.full && fullReports?.length === 0) || (!props.full && reports?.length === 0))? 
                    (<div className='no-data-events'>
                        <Typography fontSize='1.5rem'> {'no data ' + (props.full? 'in full data set' : 'in selected period')+ ' for this filter configuration'} </Typography>
                    </div>
                    ) 
                    : null}
                    {(props.full? fullReports : reports).map((report, index) => (
                        <ListItem 
                            key={'events-info-' + report.id}
                            className='list-item-wrapper'
                            sx={{py: '3px', width: {xs: "100vw", md: "100%"},minWidth:"440px"}}
                        >
                            <div key={report.id + '-item'} className={'events-item-wrapper' + ((openReportID === report.id)? ' open' : '')} onClick={() => controlOpenReportID(report.id)} role='button'  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      controlOpenReportID(report.id);
    }
  }}>
                                <Typography className='event-item' fontWeight='300' sx={{mx: '10px'}}>{report.id}</Typography>
                                <Typography className='event-item' sx={{mx: '10px'}}>{moment(report.date_start).format('DD.MM.YY')} {(report.date_start === report.date_end)? '' : (' - ') + moment(report.date_end).format('DD.MM.YY')}</Typography>
                                <div className='event-item type'>
                                <Circle  sx={{color: colourSettings[report.event_type] }}/>
                                    <Typography sx={{mx: '10px'}}>
                                    {eventTypeToText[report.event_type]}
                                    </Typography>
                                </div>
                                <Typography className='event-item' sx={{mx: '10px', whiteSpace:'nowrap'}}>{report.admin1}, {report.admin2}, {report.location_name}</Typography>
                                <Typography sx={{ margin: '0 5px', cursor: 'pointer', minWidth: '20px' }}>
                                    {openReportID === report.id ?  <ExpandLessIcon />  :<ExpandMoreIcon />}
                                </Typography>
                            </div>
                            {(openReportID === report.id)? 
                                <div className='events-all-info'>
                                    <div className='events-info notes'>
                                        <div className='events-info-group'>
                                            <div className='events-line'>
                                                <Typography fontSize='16px' lineHeight='28px' sx={{mx: '10px', color: styles.darkBlue}}>Source </Typography>
                                                <Typography fontSize='16px' sx={{mx: '10px', color: styles.darkBlue}}>{report.source_reference} ({report.source_origin}, {report.source_date})</Typography>
                                            </div>
                                            <div className='events-line'>
                                                <Typography fontSize='16px' sx={{mx: '10px', color: styles.darkBlue}}>Content </Typography>
                                                <Typography sx={{mx: '10px', fontWeight:'bold', color: styles.darkBlue}}>{report.source_content}</Typography>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className='events-info actor'>
                                        <div className='events-info-group'>
                                            {report.side_a.split(',').map((actor, index) => (
                                                <div className='events-line' key={`sideA-${report.id}-${index}`}>
                                                    <Typography fontSize='16px' sx={{mx: '10px'}}>{index === 0? 'Side A' : ''}</Typography>
                                                    <Typography sx={{mx: '10px'}}>{actor} ({interCodeMapping[Math.floor(report.interaction / 10) % 10]})</Typography>
                                                    <IconButton focusRipple={false}
                                                    onClick={() => showActorCard(actor)}
                                                    sx={{
                                                        py: 0,
                                                        "&:hover": {
                                                          backgroundColor: "transparent"
                                                        }
                                                      }}
                                                    >
                                                        <InfoIcon 
                                                        sx={{ color: styles.infoIconColor, fontSize:'16px',
        
                                                        }}
                                                        ></InfoIcon>
                                                    </IconButton>
                                                </div>
                                            ))}
                                            {report.side_b.split(',').map((actor, index) => (
                                                <div className='events-line' key={`sideB-${report.id}-${index}`}>
                                                    <Typography fontSize='16px' sx={{mx: '10px'}}>{index === 0? 'Side B' : ''}</Typography>
                                                    <Typography sx={{mx: '10px'}}>{actor} ({interCodeMapping[report.interaction % 10]})</Typography>
                                                    <IconButton focusRipple={false}
                                                    onClick={() => showActorCard(actor)}
                                                    sx={{py: 0, "&:hover": {
                                                        backgroundColor: "transparent"
                                                      }}}
                                                    >
                                                        <InfoIcon 
                                                        sx={{ color: styles.infoIconColor, fontSize:'1rem'}}
                                                        ></InfoIcon>
                                                    </IconButton>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className='events-info interaction'>
                                        <div className='events-info-group'>
                                            <div className='events-line'>
                                                <Typography fontSize='16px' sx={{mx: '10px'}}>Event Type</Typography>
                                                <Typography sx={{mx: '10px'}}>{eventTypeToText[report.event_type]}</Typography>
                                            </div>
                                            <div className='events-line'>
                                                <Typography fontSize='16px' sx={{mx: '10px'}}>Fatalities</Typography>
                                                <Typography sx={{mx: '10px'}}>{report.fatalities_best}</Typography>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className='events-info location'>
                                        <div className='events-info-group'>
                                            <div className='events-line'>
                                                <Typography fontSize='16px' sx={{mx: '10px'}}>Location</Typography>
                                                <Typography sx={{mx: '10px'}}>{report.admin1}, {report.admin2},  {report.location_name}, {report.location_detail}, {report.country_name}</Typography>
                                            </div>
                                            <div className='events-line'>
                                                <Typography fontSize='16px' sx={{mx: '10px'}}>Coordinates</Typography>
                                                <Typography sx={{mx: '10px'}}>{report.latitude}, {report.longitude}  (lat., long.), precision {report.location_precision}</Typography>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className='events-info time'>
                                        <div className='events-info-group'>
                                            <div className='events-line'>
                                                <Typography fontSize='16px' sx={{mx: '10px'}}>Event Date</Typography>
                                                <Typography sx={{mx: '10px'}}>{moment(report.date_start).format('DD.MM.YY')} {(report.date_start === report.date_end)? '' : (' - ') + moment(report.date_end).format('DD.MM.YY')}</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :null}
                        </ListItem>
                    ))}
                </List>}
                </div>
            </div>
        </div>
    );
}
