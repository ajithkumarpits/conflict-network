import './WorldMap.scss';
import { useEffect, useState, useRef } from "react";
//MUI
import Box from '@mui/material/Box';
//Hooks
import useIsMobile from '../../hooks/useIsMobile';
import useIsExtraLargeScreen from '../../hooks/useIsExtraLargeScreen';
// Components
import MapLegend from '../MapLegend/MapLegend';
// External libraries
import { MapContainer,GeoJSON} from 'react-leaflet';
import {scaleLinear} from "d3-scale";

import styles from '../../styles/global.scss';

export default function WorldMap(props) {
  const worldRef = useRef();
  const [binColours, setBinColours] = useState([])
  const [mapBins, setMapBins] = useState(props.colourData[props.selectedOption])
  const colourMapping = mapBins? scaleLinear().domain([0, mapBins.length]).range(["#bfd9e7", "#091f32"]) : []
  const isMobile  = useIsMobile()
  const isExtraLargeScreen = useIsExtraLargeScreen();

  const resizeMap = (mapRef) => {
    const resizeObserver = new ResizeObserver(() => mapRef.current?.invalidateSize())
    const container = document.getElementById('mapcontainer')
    if (container) {
        resizeObserver.observe(container)
    }
  }

  useEffect(() => {
    const colours = {};
    setMapBins(props.colourData[props.selectedOption])
    if(binColours.length === 0){
      for(let i = 0; i <= props.colourData[props.selectedOption].length; i++){
        colours[i] = colourMapping(i)
      }
      setBinColours(colours)
    }
  }, [props.selectedOption])

  function getCountryColor(d){
    // for a given country, get its colour depending on its bin assignment
    let colour = styles.noDataColour;
    if(d.gw_number){
      const country_data = props.colourData[d.gw_number]
      if(country_data){
        const valueBin = props.colourData[d.gw_number][`${props.selectedOption}_bin`]

        // https://stackoverflow.com/questions/41779105/finding-the-index-position-of-an-array-inside-an-array-in-javascript
        mapBins.some((bin, i) => {
          if (bin.length === valueBin.length && bin.every(function (b, j) { return b === valueBin[j]; })) {
              colour = colourMapping(i)
              return true;
          } else return false;
      });
      }
    }
    return colour
  }


  function style(feature) {
    return {
        fillColor: getCountryColor(feature),
        color: styles.textLight,
        fillOpacity: 1,
        weight: 1,
        className: 'country-outline'
    };
  }

  function handleCountryClick(feature){
    props.handleCountryClick(feature);
  }

  useEffect(() => {
    // needed to update tooltip texts when display selection is changed
    if(worldRef.current){
      const layers = worldRef.current._layers;
      Object.keys(layers).forEach((key) => {
        const layer = layers[key]
        if(layer.feature){
          layer.setTooltipContent(`${layer.feature.properties.name} (${getTooltipInfo(layer.feature)})`)
        }
      })
    }
  }, [props.selectedOption])

  function getTooltipInfo(feature){
    let info = 'no data';
    const gw = feature.gw_number;
    if(gw){
      const country_data = props.colourData[gw]
      if(country_data){
        info = country_data[props.selectedOption] + ' ' + props.selectedOption;
      }
    }
    return info;
   
  }

  function onEachFeature(feature, layer) {
    layer.bindTooltip(()=>{
      return `${feature.properties.name} (${getTooltipInfo(feature)})`
    }, {
      className: "map-tooltip",
      sticky: true,
    });

    let prev_colour = '';

    //bind click
    layer.on({
      click: () => handleCountryClick(feature),
      // bind hover
      mouseover: (e) => {
        prev_colour = e.target.options.fillColor
        e.target.setStyle({ fillColor: styles.lightPrimary });
      },   
      mouseout: (e) => {
        e.target.setStyle({ fillColor: prev_colour  });
      },
    });
  }

  return (    
    <Box className='peace-display' sx={{ padding: { xs: '0px', md: '0px 18px 0px 18px'}, boxSizing: "border-box", margin: "0 0 18px 0"}}>
        <MapContainer 
        ref={worldRef} 
        id='mapcontainer' 
        className='map-container' 
        center={[0, 0]} 
        zoom={isExtraLargeScreen ? 3 : isMobile ? 1 : 2} 
       minZoom={isExtraLargeScreen ? 3 : isMobile ? 1 : 2} 
        preferCanvas={true}
        scrollWheelZoom={false}
        worldCopyJump={true}
        whenReady={() => resizeMap(worldRef)}
        attributionControl={false}
        >
            <GeoJSON 
            className='data-geojson'
            key='peace-data-geojson'
            data={props.world_data}
            style= {style}
            onEachFeature= {onEachFeature}
            ></GeoJSON>
            <MapLegend 
            dataName={props.selectedOption}
            binColours={binColours}
            bins={mapBins}
            ></MapLegend>
        </MapContainer>
    </Box>
  );
}
