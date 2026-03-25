import './ColourSettings.scss';
import { useState } from 'react';
// MUI components
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import { VscSettings } from "react-icons/vsc";
// components
import styles from "../../styles/global_variables.scss"
import OverallColourDialog from './OverallColourDialog/OverallColourDialog';

export default function ColourSettings(props){
    const [open, setOpen] = useState(false);

    function showColourDialog() {
        setOpen(true)
    }

    function hideColourDialog(){
        setOpen(false);
    };

    return (
        <FormGroup className='colour-setting-wrapper' sx={{ width: {xs:'50%', md:'inherit'}}}>
            <OverallColourDialog
                open={open}
                onClose={hideColourDialog}
                eventTypeColours={props.eventTypeColours}
                applyChangeEventTypeColours={props.applyChangeEventTypeColours}
                linkTypeColours={props.linkTypeColours}
                applyChangeGraphSettings={props.applyChangeGraphSettings}
            />
            <Button
            id="colour-settings"
            variant="outlined"
            disableElevation
            //sx={{ml: 2, py: 0, fontSize:'0.8rem', whiteSpace: 'nowrap' }} 
            sx={{padding: {xs:'9px 10px'}, fontSize: '16px', borderRadius: '10px', border: '2px solid #667785', background: styles.textWhite, color: styles.lightBlue250, textTransform: 'none', lineHeight: '28px', letterSpacing: { xs: "-0.3px", sm: "0"},
                '&:hover': {
                    border: '2px solid #3D76AB',
                    background: styles.textWhite,
                    color: styles.lightBlue
                }
            }}
            onClick={showColourDialog}
            startIcon={<VscSettings />}
            >
                Display Settings
            </Button>
        </FormGroup>
    )
}
