import './LocationMapConfiguration.scss';
import styles from '../../styles/global_variables.scss';
// MUI components
import Typography from '@mui/material/Typography';

export default function LocationMapConfiguration(props) {

    return(
        <div className='location-map-config'>
            <div className='location-map-group'>
                <Typography 
                fontSize='0.8rem'
                sx={{ p: 1, color: 'primary.contrastText' }}
                backgroundColor={styles.colorNeutral}
                className='location-num-events'
                >{props.numEvents} events</Typography>
            </div>
        </div>
    );
}