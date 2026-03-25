import './ActorNode.scss';
import {useState ,useCallback} from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/global_variables.scss';
// MUI components
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
// components
import ActorIcon from '../ActorIcon/ActorIcon';
import ActorCard from '../ActorCard/ActorCard';

export default function ActorNode(props) {
    const [openActorCard, setOpenActorCard] = useState(false);

    const showActorCard = useCallback(() => {
        setOpenActorCard(true);
      }, []);
    
      const hideActorCard = useCallback(() => {
        setOpenActorCard(false);
      }, []);
    return (
        <Card 
        sx={{width: '340px', minHeight: '100px', maxHeight: '100px', margin: '1px', backgroundColor: styles.textWhite}}>
            <ActorCard
            gw_number={props.gw_number}
            open={openActorCard}
            onClose={hideActorCard}
            actor={props.actor}
            actorName={props.actor.getName()}
            start={props.start}
            end={props.end}
            actors={props.actors}
            fullPeriod={props.fullPeriod}
            eventTypeColours={props.eventTypeColours}
            >
            </ActorCard>
            <CardContent className='actor-node-content'>
                <div className='actor-node-icon'>
                    <ActorIcon dim={60} actor={props.actor} colour={styles.typeIconColor} eventTypeColours={props.eventTypeColours}></ActorIcon>
                    {props.displayNumber? (<Chip sx={{margin:'3px', fontSize:'0.6rem', height:'15px'}} label={props.displayNumber} size="small"/>):null}
                </div>
                <div className='actor-node-info'>
                    <Typography sx={{ fontSize: '0.9rem' }} color="text.secondary" gutterBottom>
                    {props.actor.getName()}
                    </Typography>
                </div>
                <div className='actor-node-action'>
                    <div className='actor-node-action-buttons'>
                        <IconButton
                        onClick={() => showActorCard()}
                        sx={{padding: '2px'}}
                        >
                            <InfoIcon 
                            sx={{ padding: '2px'}}
                            fontSize='small'
                            color='secondary'
                            ></InfoIcon>
                        </IconButton>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

ActorNode.propTypes = {
    gw_number: PropTypes.number,
    actor: PropTypes.object.isRequired, 
    start: PropTypes.string,
    end: PropTypes.string,
    actors: PropTypes.array,
    fullPeriod: PropTypes.bool,
    eventTypeColours: PropTypes.object, 
    displayNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };
  