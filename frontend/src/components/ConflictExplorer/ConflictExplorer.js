import './ConflictExplorer.scss';
import { useEffect, useState ,useCallback} from "react";
import PropTypes from "prop-types";
import { trackPromise } from 'react-promise-tracker';
import styles from './styles/global_variables.scss';
// API functions
import {getFullActors,getEventTypeColours,updateEventTypeColours,getLinkTypeColours,updateLinkTypeColours} from './utils/queryBackend';
// MUI components
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// utils
import {ActorPool} from './utils/Actor/ActorPool';
// comp{onents
import  Exploration from './views/Exploration/Exploration'

const theme = createTheme({
// if you want to update palette, do so in styles/global_variables.scss
palette: {
  primary: {
    main: styles.primaryColor,
    dark: styles.primaryLight,
    light: styles.primaryLight,
    contrastText: styles.textPrimary,
  },
  secondary: {
    main: styles.secondaryColor,
    dark: styles.secondaryDark,
    light: styles.secondaryLight,
    contrastText: styles.textSecondary,
  },
  neutral: {
    main: styles.neutralColor,
    dark: styles.neutralLight,
    light: styles.neutralDark,
    contrastText: styles.textNeutral,
  },
  text: {
    main: styles.textPrimary,
    dark: styles.textNeutral,
    light: styles.textSecondary,
    contrastText: styles.textWhite,
  },
  help: {
    main: styles.helpMain,
    dark: styles.helpDark,
    light: styles.helpLight,
    contrastText: styles.textNeutral,
  }
},
});

export default function ConflictExplorer(props) {
    const [haveActors, setHaveActors] = useState(false);
    const [actors, setActors] = useState([]);
    const [actorNames, setActorNames] = useState([]);
    const [eventTypeColours, setEventTypeColours] = useState(null);
    const [linkTypeColours, setLinkTypeColours] = useState(null);
    const [requestedLinkTypeColours, setRequestedLinkTypeColours] = useState(false);
    const [requestedEventTypeColours, setRequestedEventTypeColours] = useState(false);
    const [needFetching, setNeedFetching] = useState(false);
    const [labelSize, setLabelSize] = useState('14pt');
    const [linkWidth, setLinkWidth] = useState(50);

    useEffect(() => {
      // Prevents API call from being executed twice
      if (needFetching) return;
      setNeedFetching(true);
  }, []);
  
  useEffect(() => {
      if (!needFetching) return;
  
      const fetchData = async () => {
          try {
              if (!haveActors) {
                  setHaveActors(true);
                  await getAllActors();
              }
              if (!eventTypeColours && !requestedEventTypeColours) {
                  setRequestedEventTypeColours(true);
                  try {
                      const responseData = await getEventTypeColours();
                      const colors = responseData?.event_type_colours || {};
                      if (!colors['mediation']) {
                          colors['mediation'] = "#1f77b4";
                      }
                      setEventTypeColours(colors);
                  } catch (error) {
                      setEventTypeColours({ 'mediation': "#1f77b4" });
                  }
              }
              if (!linkTypeColours && !requestedLinkTypeColours) {
                  setRequestedLinkTypeColours(true);
                  try {
                      const responseData = await getLinkTypeColours();
                      const colors = responseData?.link_type_colours || {};
                      if (!colors['mediation']) {
                          colors['mediation'] = { "colour": "#1565C0", "stroke": "" };
                      }
                      setLinkTypeColours(colors);
                  } catch (error) {
                      setLinkTypeColours({
                          'mediation': { "colour": "#1565C0", "stroke": "" }
                      });
                  }
              }
          } catch (error) {
          }
      };
  
      fetchData();
  }, [needFetching]);
  

  async function getAllActors() {
    if (props.gw_number) {
        try {
            const responseData = await trackPromise(getFullActors({ gw_number: props.gw_number }));
            const actorPool = new ActorPool();
            responseData.forEach(actor => actorPool.addActor(actor));
            setActors(actorPool.getActors());
            const names = actorPool.getActors()
            .map(actor => actor.getName())
            .sort((a, b) => a.localeCompare(b)); 
            setActorNames(names);
        } catch (error) {
            setActors([]);
            setActorNames([]);
        }
    }
}

const applyChangeEventTypeColours = useCallback(async(newColours)=>{
  try {
    const response = await updateEventTypeColours(newColours);
    setEventTypeColours(response?.event_type_colours || {});
} catch (error) {
}

},[])
 
  const applyChangeGraphSettings = useCallback(async (newColours, newLabelFontSize, newLinkWidth) => {
    try {
        const response = await updateLinkTypeColours(newColours);
        const colors = response?.link_type_colours || {};
        if (!colors['mediation']) {
            colors['mediation'] = newColours['mediation'] || { "colour": "#1565C0", "stroke": "" };
        }
        setLinkTypeColours(colors);
    } catch (error) {}

    setLabelSize(newLabelFontSize);
    setLinkWidth(newLinkWidth);
}, []);

  
    return (
        <Box className='conflict-explorer' sx={{paddingBottom: {md:'0px'}, height: { md: '100%'}, marginTop: {xs: "0", md: "0"}}}>
          <ThemeProvider theme={theme}>
           <Exploration 
            countryName={props.countryName}
            gw_number={props.gw_number}
            actors={actors} 
            actorNames={actorNames} 
            eventTypeColours={eventTypeColours}
            applyChangeEventTypeColours={applyChangeEventTypeColours}
            linkTypeColours={linkTypeColours}
            applyChangeGraphSettings={applyChangeGraphSettings}
            labelSize={labelSize}
            linkWidth={linkWidth}
            /> 
          </ThemeProvider>
        </Box>
    );
}

ConflictExplorer.propTypes = {
  gw_number: PropTypes.number, 
  countryName: PropTypes.string,
};

