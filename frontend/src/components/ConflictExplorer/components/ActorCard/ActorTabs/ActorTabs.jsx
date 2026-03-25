import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from '../../../styles/global_variables.scss';


export default function ActorTabs({ tabValue, onTabChange }) {
  return (
    <Tabs
      value={tabValue}
      onChange={onTabChange}
      textColor="secondary"
      indicatorColor="secondary"
      sx={{
        minHeight: "inherit",
        position: "relative",
        marginBottom: '40px',
        '&:after': {
          content: '""',
          position: "absolute",
          left: "0",
          bottom: "0",
          width: "100%",
          borderColor: "divider",
          borderBottom: "4px solid #F3F3F3",
        }
      }}
      TabIndicatorProps={{
        sx: {
          height: "4px",
          zIndex: "1",
          backgroundColor: styles.darkBlue,
        }
      }}
    >
      <Tab
        label="Actor"
        id="actor-card-actor-tab"
        sx={{
          padding: "0 0 20px 0",
          lineHeight: "24px",
          minWidth: "inherit",
          minHeight: "inherit",
          fontSize: "18px",
          color: styles.darkBlue,
          fontWeight: "400",
          textTransform: "none",
          "&.Mui-selected": {
            fontWeight: '600',
            color: styles.darkBlue
          },
        }}
      />
      <Tab
        label="Events"
        id="actor-card-events-tab"
        sx={{
          padding: "0 0 20px 0",
          lineHeight: "24px",
          minWidth: "inherit",
          minHeight: "inherit",
          fontSize: "18px",
          color: styles.darkBlue,
          fontWeight: "400",
          textTransform: "none",
          "&.Mui-selected": {
            fontWeight: '600',
            color: styles.darkBlue
          },
        }}
      />
    </Tabs>
  );
}

ActorTabs.propTypes = {
  tabValue: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

