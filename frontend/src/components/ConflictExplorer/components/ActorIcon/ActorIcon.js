import './ActorIcon.scss';
import {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types'; // Import PropTypes at the top
import styles from '../../styles/global_variables.scss';
// components
import ActorIconPopup from './ActorIconPopup/ActorIconPopup';
// utils
import interCodeToSVG from '../../utils/interCodeToSVG';
import interCodeMapping from '../../utils/interCodeMapping';
import useIsMobile from '../../../../hooks/useIsMobile'
// libraries
import { scaleBand  ,scaleRadial} from "d3-scale";
import { select } from "d3-selection";
import { arc } from "d3-shape";

  function ActorIcon(props) {
    const actorIconWrapperRef = useRef();
    const actorIconRef = useRef();
    const [actorEventCount , setActorEventCount] = useState({});
    const [actorType, setActorType] = useState(0);
    const [actorName, setActorName] = useState(null);
    const [openActorIconPopup, setOpenActorIconPopup] = useState(false);
    const [selectedGlyph, setSelectedGlyph] = useState({})
    const [colourSettings, setColourSettings] = useState({})
    const  isMobile = useIsMobile()
    useEffect(() => {
        // keep track of colour settings
        setColourSettings(props.eventTypeColours)
    }, [props.eventTypeColours])

    useEffect(()=>{
        // set variables depending on the actor who should be represented
        if(props.actor){
            setActorEventCount(props.actor['eventTypeSummary']);
            setActorType(props.actor['actorType']);
            setActorName(props.actor.getName());
        }
    }, [props.actor])

    function showActorIconPopup(){
        setOpenActorIconPopup(true); 
    }

    function hideActorIconPopup(){
        setOpenActorIconPopup(false);
    };

    useEffect(() => {
        let iconSVG = select(actorIconRef.current)
        iconSVG.selectAll("g").remove();
        iconSVG.selectAll("path").remove();
    }, [props.actor])


    function mouseover(event){
        // delete any remaining tooltips
        select("#ActorIconTooltip").remove();
        select(actorIconWrapperRef.current)
            .append("div")
            .style("position", "absolute")
            .style("opacity", 0)
            .attr("class", "ActorIconTooltip")
            .attr("id", "ActorIconTooltip")
            .style("background-color", styles.neutralColor)
            .style("border-radius", styles.mainBorderRadius)
            .style('z-index', 20)
            .style("padding", "5px")
    }

    function mousemove(event){
        let tooltipText = ''
        if(actorType === 0){
            tooltipText = 'No actor type, never appeared as main actor'
        } else {
            tooltipText = interCodeMapping[actorType]
        }
        select("#ActorIconTooltip")
            .style("opacity", 1)
            .html(
                "<div className=ActorIconTooltip>" +
                    `<div className=line> ${tooltipText} </div>` +
                "</div>"
            )
            .style('font-size', '0.8rem')
    }

    function mouseleave(event){
        select("#ActorIconTooltip")
            .style("opacity", 0)
        // remove the tooltip when hover leaves point
        select("#ActorIconTooltip").remove();
    }

    function showDetailInfo(){
        setSelectedGlyph(actorEventCount)
        showActorIconPopup();
    }

    useEffect(()=>{

        // Resource: https://d3-graph-gallery.com/graph/circular_barplot_basic.html

        let iconSVG = select(actorIconRef.current)
                    .append('g')
                    .attr("transform", `translate(${props.dim/2},${props.dim/2})`);

        let innerRadius = props.dim / 6;
        let outerRadius = props.dim / 2;   // the outerRadius goes from the middle of the SVG area to the border
        let scale = (2* innerRadius) / (Math.SQRT2 * 24); // 24px is the size of the svg icon

        iconSVG.selectAll("g").remove();
        iconSVG.selectAll("path").remove();
        iconSVG.selectAll("rect").remove();

        // X scale
        const x = scaleBand()
        .range([0, - 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)               
        .domain( Object.keys(actorEventCount))


         // Y scale
         const y = scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, 1]); // Domain of Y is from 0 to the max seen in the data

        // Add bars
        iconSVG.append("g")
        .selectAll("path")
        .data(Object.keys(actorEventCount))
        .join("path")
          .attr("fill", d => colourSettings[d])
          .attr("d", arc()     // imagine your doing a part of a donut plot
              .innerRadius(innerRadius)
              .outerRadius(d => y(actorEventCount[d]))
              .startAngle(d => x(d))
              .endAngle(d => x(d) + x.bandwidth())
              .padAngle(0.01)
              .padRadius(innerRadius))

        // add center icon
        iconSVG.append('path')
        .attr('d', interCodeToSVG[actorType].path)
        .attr('fill', props.colour)
        .attr('stroke', props.colour)
        .attr('transform', "translate(" + (-(scale * 24)/2) + ',' + (-(scale * 24)/2) +`)scale(${scale})`);

        if(Object.keys(actorEventCount).length > 0){
            iconSVG.append('g')
            .attr("transform", `translate(${- props.dim/2},${- props.dim/2})`)
            .append('rect')
            .attr('width', props.dim)
            .attr('height', props.dim)
            .attr('opacity', 0)
            .style('cursor', 'pointer')
            .on('click', showDetailInfo)
            .on("mouseover", (e) => mouseover(e))
            .on("mousemove", (e) => mousemove(e))
            .on("mouseleave", (e) => mouseleave(e));
        }

    }, [actorEventCount, colourSettings, actorType])

    return (
        <div className='actor-icon-wrapper' ref={actorIconWrapperRef} style={{width: props.dim, height: props.dim}}>
            {props.actor?(<ActorIconPopup 
            dim={isMobile ? 300 :500} 
            open={openActorIconPopup}
            onClose={hideActorIconPopup}
            actor_name={actorName}
            colour={props.colour}
            eventColours={colourSettings}
            eventTypeSummary={selectedGlyph}
            actorType={actorType}
            ></ActorIconPopup>):null}
            <svg className='actor-icon-svg' ref={actorIconRef} style={{width: props.dim, height: props.dim}}></svg>
        </div>
    );
}

ActorIcon.propTypes = {
    eventTypeColours: PropTypes.object,
    actor: PropTypes.shape({
        eventTypeSummary: PropTypes.object.isRequired,
        actorType: PropTypes.number.isRequired,
        getName: PropTypes.func.isRequired
    }), 
    dim: PropTypes.number.isRequired, 
    colour: PropTypes.string.isRequired 
};

export default ActorIcon;