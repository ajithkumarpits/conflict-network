import './ActorSpider.scss';
import {useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../styles/global_variables.scss';
// MUI components
import RectangleIcon from '@mui/icons-material/Rectangle';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// utils
import eventTypeToText from '../../../utils/eventTypeToText';
import wrapText from '../../../utils/wrapText';
// external libraries
import { select } from "d3-selection";
import { arc } from "d3-shape";
import { scaleBand, scaleLinear,scaleRadial} from "d3-scale";

export default function ActorSpider(props) {
    const spiderRef = useRef();
    const spiderWrapperRef = useRef();
    const actorIconRef = useRef();
    // keep track of selection of display in spider
    const [eventsSelection, setEventsSelection] = useState({'full': true, 'period': true})

    function handleLegendClick(event) {
        setEventsSelection(prevSelection => ({
            ...prevSelection,
            [event]: !prevSelection[event]
        }));
    }
    
    function mouseover(event, d){
        // delete any remaining tooltips
        select("#SpiderTooltipID").remove();
        // create new tooltip and append to svg
        select(spiderWrapperRef.current)
            .append("div")
            .style("position", "absolute")
            .style("opacity", 0)
            .attr("class", "spiderTooltip")
            .attr("id", "SpiderTooltipID")
            .style("background-color", styles.neutralColor)
            .style("border-radius", styles.mainBorderRadius)
            .style("padding", "5px")
    }

    function mousemove(event, d, value){
        // update tooltip with corresponding text
          select("#SpiderTooltipID")
            .style("opacity", 1)
            .html(
                "<div className=spiderTooltip>" +
                    `<div className=line> ${(value * 100).toFixed(2)}% </div>` +
                "</div>"
            )
            .style("left", (event.x) - 100  + "px")
            .style("top", (event.y) -65 + "px")
            .style('font-size', '0.8rem')
    }

    function mouseleave(event, d){
        // hide tooltip
        select("#SpiderTooltipID")
            .style("opacity", 0)
        // remove the tooltip when hover leaves point
        select("#SpiderTooltipID").remove();
    }

    function getEventsOpacity(type){
        // hide/show data based on the legend filtering selection
        if(eventsSelection){
            return eventsSelection[type]? 0.7:0
        } else {
            return 1
        }
    }

    useEffect(() => {
        // after example from https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
        const data = [props.event_counts_period, props.event_counts_full];
        const svg = select(spiderRef.current)
        svg.selectAll("circle").remove();
        svg.selectAll("text").remove();
        svg.selectAll("line").remove();
        svg.selectAll("path").remove();
        svg.selectAll("g").remove();

        let svgWidth = 200;
        let svgHeight = 400;

        if(spiderRef.current){
            const svgSize = spiderRef.current.getBoundingClientRect();
            svgWidth = svgSize.width;
            svgHeight = svgSize.height;
        }
        
       
        const minWidthHeight = svgWidth < svgHeight? svgWidth : svgHeight

        const innerRadius = 0;
        const outerRadius = minWidthHeight/2 - 30;   // the outerRadius goes from the middle of the SVG area to the border

        let mainData = {};
        let fullData = {};

        if(props.full){
            mainData = data[1]
        } else {
            mainData = data[0]
            fullData = data[1]
        }

        // X scale
        const xBars = scaleBand()
        .range([0, - 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)               
        .domain(Object.keys(mainData))

         // Y scale
         const yBars = scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, 1]); // Domain of Y is from 0 to the max seen in the data

        let ticks = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
        // draw circles
        svg.append("g")
        .selectAll("path")
        .data(ticks)
        .join("path")
            .attr("transform", `translate(${minWidthHeight/2},${minWidthHeight/2})`)
            .attr("fill",'none')
            .attr('stroke', styles.neutralColor)
            .attr("d", arc()
                .innerRadius(innerRadius)
                .outerRadius(d => yBars(d))
                .startAngle(0)
                .endAngle(- 2 * Math.PI)
                .padRadius(innerRadius))


        if(!props.full){
            // add bars for full data
            svg.append("g")
            .selectAll("path")
            .data(Object.keys(fullData))
            .join("path")
                .attr("transform", `translate(${minWidthHeight/2},${minWidthHeight/2})`)
                .attr("fill", styles.neutralColor)
                .attr('opacity', getEventsOpacity('full'))
                .style('cursor', 'pointer')
                .on("mouseover", (e, d) => mouseover(e, d))
                .on("mousemove", (e, d) => mousemove(e, d, fullData[d]))
                .on("mouseleave", (e, d) => mouseleave(e, d))
                .attr("d", arc()
                    .innerRadius(innerRadius)
                    .outerRadius(d => yBars(fullData[d]))
                    .startAngle(d => xBars(d))
                    .endAngle(d => xBars(d) + xBars.bandwidth())
                    .padAngle(0.01)
                    .padRadius(innerRadius))
        }

        // Add bars for period data
        svg.append("g")
        .selectAll("path")
        .data(Object.keys(mainData))
        .join("path")
            .attr("transform", `translate(${minWidthHeight/2},${minWidthHeight/2})`)
            .attr("fill", d => props.eventTypeColours[d])
            .attr('opacity', getEventsOpacity('period'))
            .style('cursor', 'pointer')
            .on("mouseover", (e, d) => mouseover(e, d))
            .on("mousemove", (e, d) => mousemove(e, d, mainData[d]))
            .on("mouseleave", (e, d) => mouseleave(e, d))
            .attr("d", arc()
                .innerRadius(innerRadius)
                .outerRadius(d => yBars(mainData[d]))
                .startAngle(d => xBars(d))
                .endAngle(d => xBars(d) + xBars.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius))


        // Add the labels
        svg.append("g")
        .attr("transform", `translate(${minWidthHeight/2},${minWidthHeight/2})`)
        .selectAll("g")
        .data(Object.keys(mainData))
        .join("g")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) { return "rotate(" + ((xBars(d) + xBars.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + (yBars(1) + 5) + ",0)"; })
        .append("text")
            .text(function(d){return(eventTypeToText[d])})
            .attr('transform', 'rotate(90)')
            .style("font-size", "11px")
            .attr("alignment-baseline", "middle")
            .call(wrapText, 100) // wrap the text if wider than 100px;

        let radialScale = scaleLinear()
            .domain([0,1])
            .range([0, (minWidthHeight / 2 - 30)]); // range of pixels the circles will take

        // function to map an angle and a value to svg coordinates
        function angleToCoordinate(angle, value){
            let x = Math.cos(angle) * radialScale(value);
            let y = Math.sin(angle) * radialScale(value);
            return {"x": (minWidthHeight / 2) + x, "y": (minWidthHeight / 2) - y};
        }

        // plot the axis for all event types
        const features = Object.keys(mainData)
        for (let i = 0; i < features.length; i++) {
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            let line_coordinate = angleToCoordinate(angle, 1);
        
            //draw axis line
            svg.append("line")
            .attr("x1", minWidthHeight / 2)
            .attr("y1", minWidthHeight / 2)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke",styles.neutralColor);
        
        }

    })

    useEffect(()=>{
        // whenever the event type colour assignment changes, redraw the spider
        // Resource: https://d3-graph-gallery.com/graph/circular_barplot_basic.html
        if(!props.full){

            const dim = 13

            let svg = select(actorIconRef.current)
            svg.selectAll("path").remove();
            svg.selectAll("g").remove();

            const innerRadius = 0;
            const outerRadius = dim/2;   

            let iconData = {}

            Object.keys(props.event_counts_period).forEach(event => {
                iconData[event] = 1;
            });
                
            // X scale
            const xBars = scaleBand()
            .range([0, - 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
            .align(0)               
            .domain(Object.keys(iconData))

                // Y scale
            const yBars = scaleRadial()
            .range([innerRadius, outerRadius])   // Domain will be define later.
            .domain([0, 1]); // Domain of Y is from 0 to the max seen in the data
                
                
            // Add bars
            svg.append("g")
            .selectAll("path")
            .data(Object.keys(iconData))
            .join("path")
            .attr("transform", `translate(${dim / 2},${dim / 2})`)
            .attr("fill", d => props.eventTypeColours[d])
            .attr("opacity", 1)
            .attr("d", arc()
                .innerRadius(innerRadius)
                .outerRadius(d => yBars(iconData[d] || 0))
                .startAngle(d => xBars(d))
                .endAngle(d => xBars(d) + xBars.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius)
            );
        }

    }, [props.eventTypeColours])

    return (
        <div className='actor-card-spider' ref={spiderWrapperRef}>
            <svg className='actor-card-svg' ref={spiderRef}></svg>
            {!props.full?
            <div className='spider-legend'>
                <Paper className='spider-legend-paper' sx={{maxWidth: '170px'}}>
                    <div className='spider-legend-wrapper'>
                        <button 
                        className={'spider-legend-item'+ (eventsSelection['full']? '' : ' unselected')}
                        key={'legend-full'}
                        onClick={() => handleLegendClick('full')}
                        >
                            <RectangleIcon
                            sx={{ color: styles.neutralColor, pr:'3px' }}
                            fontSize='8px'
                            ></RectangleIcon>
                            <Typography
                            sx= {{fontSize:'8pt' ,color:styles.textNeutral}}
                            >overall events</Typography>
                        </button>
                        <button 
                        className={'spider-legend-item'+ (eventsSelection['period']? '' : ' unselected')}
                        key={'legend-period'}
                        onClick={() => handleLegendClick('period')}
                        >
                            <svg className='legend-icon-svg' ref={actorIconRef} style={{width: '13px', height: '13px'}}></svg>
                            <Typography
                            sx= {{fontSize:'8pt', pl: '6px' ,color:styles.textNeutral}}
                            >period events</Typography>
                        </button>
                    </div>
                </Paper>
            </div>:null}  
        </div>
    );
}

ActorSpider.propTypes = {
    event_counts_period: PropTypes.object.isRequired,
    event_counts_full: PropTypes.object.isRequired,
    eventTypeColours: PropTypes.object.isRequired,
    full: PropTypes.bool.isRequired
};
