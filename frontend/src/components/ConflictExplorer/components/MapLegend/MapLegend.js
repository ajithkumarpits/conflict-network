import './MapLegend.scss';
import { useEffect, useState } from 'react';
import styles from '../../styles/global_variables.scss';
// MUI components
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircleIcon from '@mui/icons-material/Circle';
// utils
import eventTypeToText from '../../utils/eventTypeToText';

export default function MapLegend(props) {
    const [colourSettings, setColourSettings] = useState(props.eventTypeColours);
    const [typeSelection, setTypeSelection] = useState(null);

    useEffect(() => {
        if(!typeSelection && colourSettings){
            const selection = {};
            Object.keys(colourSettings).forEach(colour => {
                selection[colour] = true
            })
            setTypeSelection(selection);
        }
    })

    useEffect(() => {
        setColourSettings(props.eventTypeColours)
    }, [props.eventTypeColours])

    function handleLinkClick(eventType){
        const newSelection = Object.assign({}, typeSelection)
        newSelection[eventType] = !newSelection[eventType]
        setTypeSelection(newSelection)
        props.setEventTypeFilter(newSelection)
    }

    function getIconColor(eventType){
        if(typeSelection){
            return typeSelection[eventType]? colourSettings[eventType] : styles.neutralColor
        } else {
            return styles.neutralColor
        } 
    }

    return(
        <div className='location-map-legend'>
            <Paper className='legend-paper'>
                <div className='legend-wrapper'>
                    {Object.keys(eventTypeToText).map(eventType => {
                        return (
                        <button 
                        className={'legend-item' + (typeSelection? (typeSelection[eventType]? '' : ' unselected'):'')}
                        key={'legend-' + eventType}
                        onClick={() => handleLinkClick(eventType)}
                        >
                            <CircleIcon 
                            sx={{ 
                                color: getIconColor(eventType), 
                                pr: '5px' }}
                            fontSize='small'
                            ></CircleIcon>
                            <Typography
                            sx= {{fontSize:'12px'}}
                            color={'#000'}
                            >{eventTypeToText[eventType]}</Typography>
                        </button>
                        )
                    })}
                </div>
            </Paper>
        </div>
    );
}
