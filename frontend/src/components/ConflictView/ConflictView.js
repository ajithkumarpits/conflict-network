import './ConflictView.scss';
import { useState, useEffect ,useMemo} from "react";
import styles from '../../styles/global.scss';
import { useSearchParams } from "react-router-dom";
// API functions
import {getEventsFatalities} from '../../backend/queryBackend';
// predefined data
import world_data from '../../assets/worldGW.json';
import content from "../../content/content";
// MUI components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// components
import DisplayHeader from '../DisplayHeader/DisplayHeader';
import BackButton from '../BackButton/BackButton';
import WorldMap from '../WorldMap/WorldMap';
import ConflictExplorer from '../ConflictExplorer/ConflictExplorer';

export default function ConflictView() {
  // data to display on world map (events/fatalities per country)
  const [eventFatalities, setEventFatalities] = useState(null);
  // to prevent API call from being executed twice
  const [needFetching, setNeedFetching] = useState(false); 
  // keep track of country selection in variable and search parameters
  const [searchParams, setSearchParams] = useSearchParams();
  // controlling state of switch
  const options = ['fatalities', 'events']
  const [selectedOption, setSelectedOption] = useState(options[0])
  // key name to use for identifying countries
  const identification = 'name';

  useEffect(() => {
    // prevents API call from being executed twice
    if (needFetching) return;
    setNeedFetching(true);
  },[]);

  useEffect(() => {
    if (!needFetching) return;
    const fetchEventFatalities = async () => {
        try {
            const responseData = await getEventsFatalities();
            setEventFatalities(responseData || {}); 
        } catch (error) {
            setEventFatalities(null);
        }
    };
    fetchEventFatalities();
}, [needFetching]);


  function getSearchData(){
    // map the world data to {id, name} objects to have consistent data
    const mappedData = world_data['features'].map(feature => {
      return {
        'id': feature['gw_number'], 
        [identification]: feature['properties']['name'],
        'type': 'country'
      }
    })
    return mappedData
  }
  

  function handleSelect(selection){
    if(selection){
      if(selection['type'] === 'country'){
        // select the country that was clicked, and update the search parameters in URL 
        if (selection["id"] !== 0 && eventFatalities[selection["id"]]) {
          setSearchParams({ country: selection[identification] });
        }
        
      }
    } 
  }

  function resetSearch(){
    setSearchParams({});
  }
  const selectedCountry = useMemo(() => {
    let pathCountry = searchParams.get("country");
  
    if (pathCountry) {
      const matchedCountry = world_data["features"].find(
        (country) => country["properties"]["name"] === pathCountry
      );
  
      if (matchedCountry) {
        return {
          name: pathCountry,
          id: matchedCountry["gw_number"],
          type: "country",
        };
      }
    }
  
    return null;
  }, [searchParams]);


  function handleSwitchChange(selection){
    // change map display between events and fatalities
    setSelectedOption(selection)
  }

  function handleCountryClick(feature){
    // update the selected country 
    handleSelect({id: feature['gw_number'], name: feature['properties']['name'], 'type': 'country'})
  }
  return (
    <Box className="conflict-view">
      {selectedCountry?
      <Box className='conflict-explorer' sx={{padding: {xs:'0px'}, boxSizing: "border-box", marginTop: {xs:'132px', md:'153px'}}}>
        <Box className='conflict-explorer-header' sx={{padding: {xs:'20px 12px 10px 12px', md:'20px 18px 25px 18px'},top: {xs:'58px'},minHeight: {xs:'40px', md:'50px'}}}>
          <BackButton 
            className='button-wrapper' 
            searchParamName={'country'}
            resetSearch={resetSearch}
            buttonText={'World view'}>
          </BackButton>
          <div className="right"></div>
        </Box>
        <Box sx={{padding: {xs:'0px 12px 0px 12px', md:'0px 18px 0px 18px'}}}>
          <Typography
            className='title'
            color={styles.textMedium}
            sx={{paddingBottom: {xs:'30px'}, fontSize: {xs:'30px'}, lineHeight:"28px", fontWeight: "600", backgroundColor: styles.textLight, display:{xs:'block'}, position: "sticky", top: "0"}}
            fontSize={styles.fontMedium}
            >{selectedCountry[identification]}</Typography>

        </Box>
        <ConflictExplorer
        gw_number={selectedCountry['id']}
        countryName={selectedCountry[identification]}
        ></ConflictExplorer>
      </Box>
      :
      <Box className='world-view' sx={{marginTop: {xs: "58px"}}}>
        <DisplayHeader
        handleSwitchChange={handleSwitchChange}
        displayOptions={options}
        selectedOption={selectedOption}
        searchOptions={getSearchData()}
        handleSelect={handleSelect}
        identification={identification}
        optionsKeys={['type', identification]}
        switchImg1={{ active: "/fatalitiesActive.svg", deActive: "/fatalitiesDisable.svg" }}
        switchImg2={{ active: "/eventsActive.svg", deActive: "/eventsDisable.svg" }}
        searchLabel={{label1:content.SEARCH_COUNTRY_ONLY , label2:content.SEARCH_COUNTRY_ONLY}}
        />
        {eventFatalities && Object.keys(eventFatalities).length > 0 ? (
          <WorldMap
          world_data={world_data}
          options={['fatalities', 'events']}
          handleCountryClick={handleCountryClick}
          colourData={eventFatalities}
          selectedOption={selectedOption}
          ></WorldMap>
        ):null}        
      </Box>
      }
    </Box>
  );
}