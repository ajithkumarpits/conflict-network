import interactionToSVG from './interactionToSVG';
import L from "leaflet";

// tutorial: https://onestepcode.com/leaflet-markers-svg-icons/

function getMapIcon(code, colour, dim){
  /** 
   * Function to create an svg icon based on an interaction between two actor types (code) 
   * in the colour of the event type (colour) and with given dimension (dim)
   * 
   */
    const svgIcon = L.divIcon({
        html: `
      <svg
      width="${dim}" 
      height="${dim}" 
      viewBox="0 0 ${dim*2} ${dim*2}" 
      fill="none" 
      opacity="${colour.fillOpacity}"
      xmlns="http://www.w3.org/2000/svg"
      >
        <path d="${interactionToSVG(code)}" fill="${colour.fillColor}" stroke="${'#ffffff'}" stroke-width="${'0.8px'}"></path>
      </svg>`,
        className: "",
        iconSize: [dim, dim],
        iconAnchor: [dim/2, dim/2], //center of icon
      });
    return svgIcon
}

export default getMapIcon