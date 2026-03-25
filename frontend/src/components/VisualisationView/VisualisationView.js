import './VisualisationView.scss';
import styles from '../../styles/global.scss';
// predefined data
import content from '../../content/content';
// MUI components
import Typography from '@mui/material/Typography';

export default function VisualisationView(props) {
  return (
    <div className="visualisation-view">
        <Typography 
        fontSize={styles.fontHuge}
        color={styles.textLight}>{content.PLACEHOLDER}</Typography>
    </div>
  );
}