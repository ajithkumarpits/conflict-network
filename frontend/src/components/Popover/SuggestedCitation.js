import { useState } from "react";
import './SuggestedCitation.scss';

import Typography from "@mui/material/Typography";
import Popover from '@mui/material/Popover'; 
import Button from '@mui/material/Button';
import { FaRegCopy } from "react-icons/fa6";
import { Stack } from "@mui/material";
import { GoInfo } from "react-icons/go";

export default function SuggestedCitation({ tooltipTexts , copyText}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'popover' : undefined;
    const [tooltipText, setTooltipText] = useState('Copy');
    
    const handleClick = (event) => {        
        setAnchorEl(event.currentTarget);  
        document.body.classList.add('body-popover');         
    };
    
    const handleClose = () => {       
        setAnchorEl(null);        
        document.body.classList.remove('body-popover');
    };

    const handleCopy = async () => {
        const textToCopy = copyText;
        try {
          await navigator.clipboard.writeText(textToCopy);
          setTooltipText('Copied!');
          setTimeout(() => setTooltipText('Copy'), 2000);
        } catch (err) {
          setTooltipText('Failed to copy');
        }
      };

  return (
    <>

        <Button 
            aria-describedby={id} 
            variant="text" 
            onClick={handleClick}
            endIcon={<GoInfo />}
            className="btn-sugst-citation"
            >
            <span>Suggested citation</span>
        </Button>        
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            // disablePortal={true}            
            disableScrollLock={false}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
            }}
            className="popover-sugst-citation"
            >
            <Stack direction={"row"} alignItems={"center"}>
            <Typography sx={{ p: 2 }}>   <span dangerouslySetInnerHTML={{ __html: tooltipTexts }} /></Typography>
            <Button title={tooltipText} onClick={handleCopy} sx={{
                backgroundColor: 'transparent',
                p: 0,
                '&:hover': {
                backgroundColor: 'transparent',
                boxShadow: 'none',
                },
                minWidth: 'auto'
            }}>
            <FaRegCopy className="icon-copy"/>
            </Button>
            
            </Stack>
            </Popover>
    
    

        </>
  )
}
