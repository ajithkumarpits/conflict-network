import './FetchErrorView.scss';
import styles from '../../styles/global.scss';
// MUI components
import Typography from '@mui/material/Typography';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';

export default function FetchErrorView(props) {
  return (
    <div className="error-view-wrap">
        <SyncProblemIcon
        sx={{ color: styles.textLight, fontSize: styles.fontLarge }}
        ></SyncProblemIcon>
        <Typography
        color={styles.textLight}
        fontSize={styles.fontSmall}
        > 
            There was an error fetching the requested data from the backend. 
        </Typography>
        <Typography
        color={styles.textLight}
        fontSize={styles.fontSmall}
        > 
            Please refresh the website or try again later.
        </Typography>
    </div>
  );
}