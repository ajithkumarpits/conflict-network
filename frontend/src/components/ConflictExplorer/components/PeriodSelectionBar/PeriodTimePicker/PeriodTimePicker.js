
import './PeriodTimePicker.scss';
import { useState} from 'react';
import styles from '../../../styles/global_variables.scss';
// MUI components
import  InputAdornment from "@mui/material/InputAdornment";
import  IconButton from "@mui/material/IconButton";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// external libraries
import moment from 'moment';
import 'moment/locale/en-gb';


export default function PeriodTimePicker(props) {

    const [selectedDate, setSelectedDate] = useState(props.initialTime);
    const [open, setOpen] = useState(false);
 
    function handleDateChange(newDate){
        if(props.kind === 'start'){
            // set to start of time unit
            const startDate = newDate.startOf('day')
            setSelectedDate(startDate);
            props.handleDateChange(startDate);
        } else {
            // set to end of time untit
            const endDate = newDate.endOf('day')
            setSelectedDate(endDate);
            props.handleDateChange(endDate);
        }
    }
 
    return (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <DatePicker
  label={props.kind}
  openTo="day"
  value={selectedDate}
  onChange={(newDate) => handleDateChange(newDate)}
   maxDate={moment('2023-12-31')}
  views={['year', 'month', 'day']}
  open={open}
  onOpen={() => setOpen(true)}
  onClose={() => setOpen(false)}
  className="date-picker-input time-picker"
  sx={{ width: { xs: '100%', md: 'inherit' } }}
  slotProps={{
    textField: {
      variant: "outlined",
      onClick: () => setOpen(true),
      sx: {
        '& .MuiInputBase-root': {
          backgroundColor: styles.textWhite,
          borderRadius: "8px",
        },
        '& .MuiInputLabel-root': {
          color: styles.darkBlue850,
          fontSize: "0.75rem",
        },
        '& .MuiInputBase-input': {
          padding: 0,
          fontSize: '10pt',
          color: styles.textPrimary
        }
      },
      InputProps: {
        endAdornment: null,
        startAdornment: (
          <InputAdornment position="start" sx={{ marginRight: { xs: '0' } }}>
            <IconButton onClick={() => setOpen(true)} sx={{ width: { xs: '22px', md: '22px' } }}>
              <img src='/calendarIcon.svg' width={'18px'} height={'22px'} alt='calendar' />
            </IconButton>
          </InputAdornment>
        ),
      }
    }
  }}
/>
    </LocalizationProvider>
    );
}

