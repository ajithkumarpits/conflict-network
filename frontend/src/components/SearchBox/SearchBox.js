
import './SearchBox.scss';
// React and Core Libraries
import React, { useState} from "react";
// Third-party Libraries
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// Hooks
import useIsMobile from '../../hooks/useIsMobile';

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall .MuiAutocomplete-input": {
    padding:0
  },
  "& .MuiOutlinedInput-root": {
    borderColor: theme.palette.border.main,
    color: theme.palette.text.coolGrey,
 
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.border.main,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.border.main,
      borderWidth: "1px", 
    },
  },
  "& .MuiInputLabel-outlined": {
    color: theme.palette.text.coolGrey,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.palette.text.white + " !important",
  },
  "& .MuiAutocomplete-inputRoot": {
    color: theme.palette.text.coolGrey,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.border.main,
    },
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.text.white,
  },
}));
 
 
export default function SearchBox(props) {

  const filterOptions = (options, { inputValue }) => {
    const searchTerm = inputValue.trim().toLowerCase();
    if (searchTerm.length < 3) {
      return options;
    }
    return options.filter(option =>
      option[props.identification].toLowerCase().includes(searchTerm)
    );
  };

  const [focused, setFocused] = useState(false);
  const isMobile  = useIsMobile()

  
  return (
    <StyledAutocomplete
      disablePortal
      id="text-search-box"
      options={props.options}
      getOptionDisabled={option => option.id === 0}
      size="small"
      groupBy={(option) => option.type}
      // sx={{ width: getNavigationWidth}}
      sx={{
        width: {
          xs: "100%",
          md: "100%",
          lg: "100%"
        },
        maxWidth: {
          xs: "100%",
          md: "50%",
          lg: "600px"
        },
      }}
      className='search-box'      
      filterOptions={filterOptions}
      getOptionLabel={(option) => (option[props.identification] + (option['type']==='dyad'? ` (${option.id}) `:''))}      
      renderInput={(params) => (
        <TextField
        
          {...params}
          label={
            focused
              ? props.searchLabel.label1
              :  isMobile ? props.searchLabel.label1 :props.searchLabel.label2
          } 
          variant="outlined"
          onFocus={() => setFocused(true)}          
          onBlur={(event) => {
            if (!event.target.value) {
              setFocused(false);
            }
          }}
          InputLabelProps={{
            shrink: focused,
            sx:{
              lineHeight: {
                xs: focused ? "23px" : "30px",
                md: focused ? "23px" : "45px",
              },
              fontSize: {
                xs: focused ? "19px" : "16px",
                
              }   
            },     
            className: !focused ? "custom-label" : "", 
                    
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start" >
                <img src='/searchIcon.svg' width={20} height={21} alt='searchIcon' />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" >
               {focused  ?  <FaAngleUp color='white'/> :<FaAngleDown color='white'/> }
              </InputAdornment>
            ),
            sx:{borderRadius: "8px", padding: {xs: '14px 15px 14px 15px !important', md: '20px 15px 20px 15px !important'}}
          }}
        />
      )}
      onChange={(event, newValue) => {
        props.handleSelect(newValue)
      }}
    />
  );
}


