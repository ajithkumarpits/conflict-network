import './MapLegend.scss';
import styles from '../../styles/global.scss';
// MUI components
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircleIcon from '@mui/icons-material/Circle';

export default function MapLegend(props) {

    function getLegendText(bin){
        // display bin borders correctly
        if(props.bins[bin]){
            let min = props.bins[bin][0];
            if(min != 0){
                min += 1;
            }
            const max = props.bins[bin][1];
            return(min + ' - ' + max)
        }
    }

    return (
        <div className='world-map-legend'>
            <Paper className='legend-paper'>
                <div className='legend-wrapper'>
                    <Typography
                    sx= {{fontSize:styles.fontXXSmall}}
                    >number of {props.dataName}</Typography>
                    {Object.keys(props.binColours).map((key) => {
                        if(props.bins[Number(key)]){
                            return (
                                <div 
                                className='legend-item'
                                key={'legend-' + key}
                                >
                                    <CircleIcon 
                                    sx={{ color: props.binColours[key], 
                                        pr: '5px',
                                        stroke: '#000000',
                                        strokeWidth: "0.8px"
                                     }}
                                    fontSize='small'
                                    ></CircleIcon>
                                    <Typography
                                    sx= {{fontSize:styles.fontXXSmall}}
                                    >{getLegendText(Number(key))}</Typography>
                                </div>
                                )
                        }  else  { return null; }  
                    })}
                </div>
            </Paper>
        </div>
    );
}