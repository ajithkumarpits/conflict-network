import './GraphLegend.scss';
import { useEffect, useState } from 'react';
import styles from '../../styles/global_variables.scss';
// MUI components
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function GraphLegend(props) {
    const [colourSettings, setColourSettings] = useState(props.linkTypeColours)
    const [linkTypes, setLinkTypes] = useState([])
    const [linkSelection, setLinkSelection] = useState({'cooperation': true, 'opposition': true, 'mediation': true, 'other': false})

    useEffect(() => {
        setColourSettings(props.linkTypeColours)
        if(props.linkTypeColours){
            setLinkTypes(Object.keys(props.linkTypeColours))
        }
    }, [props.linkTypeColours])

    function handleLinkClick(link){
        const newSelection = Object.assign({}, linkSelection)
        newSelection[link] = !newSelection[link]
        setLinkSelection(newSelection)
        props.setLinkFilter(newSelection)
    }

    return(
        <div className='location-graph-legend'>
            <Paper className='legend-paper'>
                <div className='legend-wrapper'>
                    {linkTypes.map(linkType => {return (
                        (linkType !== 'other')?
                        (<Button 
                        className={'legend-item' + (linkSelection[linkType]? '' : ' unselected')}
                        key={'legend-' + linkType}
                        onClick={() => handleLinkClick(linkType)}
                        sx={{color:styles.textSecondary ,textTransform:"capitalize"}}
                        >
                            <svg className='dash-icon'>
                                <line 
                                stroke={linkSelection[linkType]? colourSettings[linkType].colour : styles.neutralColor}
                                strokeDasharray={colourSettings[linkType].stroke}
                                x1='0'
                                y1='0'
                                x2='40'
                                y2='0'
                                strokeWidth='10'
                                transform='translate(0,5)'
                                ></line>
                            </svg>
                            <Typography
                            sx= {{fontSize:'12px'}}
                            >{linkType}</Typography>
                        </Button>
                        ): null)}
                    )}
                </div>
            </Paper>
        </div>
    );
}