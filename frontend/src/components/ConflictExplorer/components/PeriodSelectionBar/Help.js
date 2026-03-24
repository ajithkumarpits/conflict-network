import React ,{useEffect} from 'react'
// MUI components
import Button from '@mui/material/Button';
// external libraries
import { MdHelpOutline } from "react-icons/md";
import styles from "../../styles/global_variables.scss"
 
export default function Help({ setStepsEnabled }) {

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('helpPopupShown');
    if (!hasSeenPopup) {
      setStepsEnabled(true);
      sessionStorage.setItem('helpPopupShown', 'true');
    }
  }, [setStepsEnabled]);


  return (
    <Button
    onClick={(e) => {
      if ("ontouchstart" in window) return;
      e.stopPropagation();
      setStepsEnabled(true);
    }}
    onTouchStart={(e) => {
      e.preventDefault(); 
      setStepsEnabled(true);
    }}
    variant='outlined'
    color='help'
    disableElevation
    startIcon={<MdHelpOutline />}
    sx={{padding: {xs:'9px 10px'}, fontSize: '16px', borderRadius: '10px', border: '2px solid #667785', background: styles.textWhite, color: styles.lightBlue250, textTransform: 'none', lineHeight: '28px', minWidth: {xs:'inherit', md:'178px'}, width: {xs:'50%', md:'100%'}, letterSpacing: { xs: "-0.3px", sm: "0"},
    '&:hover': {
        border: '2px solid #3D76AB',
        background: styles.textWhite,
        color: styles.lightBlue
    }
    }}
    >
        Help
    </Button>
  )
}