import './LocationEventPopup.scss';
import styles from '../../styles/global_variables.scss';
// MUI components
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box'
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import Circle from '@mui/icons-material/Circle';
// Components
import ActorIcon from '../ActorIcon/ActorIcon';
// Utils
import interCodeMapping from '../../utils/interCodeMapping';
import eventTypeToText from '../../utils/eventTypeToText';
//Hooks
import useIsBelowMd from '../../../../hooks/useIsBelowMd'
// External libraries
import moment from 'moment';

export default function LocationEventPopup(props) {


    function getActor(name){
        name = name.trim()
        const found_by_name = props.actors.find(actor => (actor.getName() === name));
        if(!found_by_name){
            return null
        }
        else{
            return found_by_name
        }
    }


  function getInteractionString(code){
    const inter1 = Math.floor(code /10 ) % 10;
    const inter2 = code % 10;

    const force1 = interCodeMapping[inter1]
    const force2 = interCodeMapping[inter2]

    let res = force1

    if(force2 && (inter2 !== 0)){
        res  =res + ' - ' + force2
    }
    res = `(${res})`
    
    return res
}

  const popupContent = (
    <div className='actor-map-popup-wrapper'>
    
      <div className='actor-map-header'>
        <div className='actor-map-header-icon'>
        <Circle
        sx={{
          color: props.markerColour,
          width: styles.mapPopUpInteraction,
          height: styles.mapPopUpInteraction,
        }}
        />
        </div>
        <div className='actor-map-header-text'>
          <Typography variant="overline">
            {moment(props.event?.date_start).format('DD.MM.YY')}{' '}
            {props.event?.date_start === props.event?.date_end ? '' : ' - ' + moment(props.event?.date_end).format('DD.MM.YY')}
            {' '} - ID: {props.event?.id} - FATALITIES: {props.event?.fatalities_best}
          </Typography>
          <div className='actor-map-header-type'>
            <Typography fontSize='0.8rem' fontWeight='bold' sx={{ pr: 1 }} className='no-margin'>
              {eventTypeToText[props.event?.event_type]}
            </Typography>
            <Typography fontSize='0.8rem' className='no-margin'>
              {getInteractionString(props.event?.interaction)}
            </Typography>
          </div>
        </div>
      </div>
      <div className='popup-text-wrapper'>
        <Typography fontSize='0.7rem' className='popup-text-info'>
          Source: {props.event?.source_origin} ({props.event?.source_date})
        </Typography>
        <Typography fontSize='0.8rem' className='popup-text-info'>
          Content: {props.event?.source_content}
        </Typography>
      </div>
      <div className='actor-popup-line'>
        <Typography variant="body2" fontSize='0.7rem' className='actor-line'>Side A</Typography>
        {props.event?.side_a.split(',').map((actor, idx) => (
          <div className='actor-wrapper' key={'actor-a-' + idx}>
            <ActorIcon 
              dim={50} 
              actor_name={actor} 
              colour={styles.typeIconColor}
              actor={getActor(actor)}
              eventTypeColours={props.eventTypeColours}
            />
            <Typography variant="body2" fontSize='0.8rem' className='actor-line'>
              {actor}
            </Typography>
            {(actor !== '' && actor !== '-') && (
              <IconButton onClick={() => props.showActorCard(actor)}>
                <InfoIcon sx={{ color: styles.infoIconColor }} fontSize='small' />
              </IconButton>
            )}
          </div>
        ))}
      </div>
      <div className='actor-popup-line'>
        <Typography variant="body2" fontSize='0.7rem' className='actor-line'>Side B</Typography>
        {props.event?.side_b.split(',').map((actor, idx) => (
          <div className='actor-wrapper' key={'actor-b-' + idx}>

            <ActorIcon 
              dim={50} 
              colour={styles.typeIconColor}
              actor={getActor(actor)}
              eventTypeColours={props.eventTypeColours}
            />


            <Typography variant="body2" fontSize='0.8rem' className='actor-line'>
              {actor}
            </Typography>
            {(actor !== '' && actor !== '-') && (
              <IconButton onClick={() => props.showActorCard(actor)}>
                <InfoIcon sx={{ color: styles.infoIconColor }} fontSize='small' />
              </IconButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
    return (
      <Dialog open={true} onClose={props.onClose} fullWidth maxWidth="sm"
      PaperProps={{
        sx: {          
          borderRadius: "20px",
        },
      }}
      >
         <IconButton
      aria-label="close"
      onClick={props.onClose}
      sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1,
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <CloseIcon />
    </IconButton>
    
        <DialogContent dividers sx={{ position: 'relative' }}>
     <Box sx={{pb:"25px"}} className='conflict-loc-event'>
    {popupContent}
    </Box>
  </DialogContent>
      </Dialog>
    );
  
}




