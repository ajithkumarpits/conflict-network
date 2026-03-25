import './BackButton.scss';
import styles from '../../styles/global.scss';
import React ,{useCallback} from "react";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { BsArrowLeft } from "react-icons/bs";
// MUI components
import Button from '@mui/material/Button';

export default function BackButton(props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleButtonClick = useCallback(() => {
       /**
         * When a user clicks the button, the current specific search parameter 
         * should be deleted and the view should route back to the previous view.
         */
    searchParams.delete(props.searchParamName);
    setSearchParams(searchParams);
    props.resetSearch();
}, [searchParams, props]);

    return (
        <div className='back-button'>
            <Button            
            variant="text"
            startIcon={<BsArrowLeft size={24} color={styles.lightBlue250} height={20} sx={{ height: "20px"}} />}
            onClick={handleButtonClick}
            sx={{ color: styles.lightBlue250, 
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "500",
                minWidth: "130px",
                lineHeight: "20px",
                justifyContent: "flex-start",
                padding: "10px 0",
                '&:hover': {
                    backgroundColor: 'transparent'
                }
            }}
            >{props.buttonText}</Button>
        </div>
    );
}

BackButton.propTypes = {
    searchParamName: PropTypes.string.isRequired,
    resetSearch: PropTypes.func.isRequired,
    buttonText: PropTypes.string,
};


