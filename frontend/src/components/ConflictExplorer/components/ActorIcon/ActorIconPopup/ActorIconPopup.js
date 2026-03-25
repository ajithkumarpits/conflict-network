import './ActorIconPopup.scss';
import styles from '../../../styles/global_variables.scss';
import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
// MUI components
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
// utils
import interCodeToSVG from '../../../utils/interCodeToSVG';
import interCodeMapping from '../../../utils/interCodeMapping';
import wrapText from '../../../utils/wrapText';
import eventTypeToText from '../../../utils/eventTypeToText';
// external libraries
import { select } from "d3-selection";
import { arc } from "d3-shape";
import { scaleRadial, scaleBand } from "d3-scale";

export default function ActorIconPopup(props) {

    const actorIconBigWrapperRef = useRef();
    const actorIconPopupSVG = useRef();
    
    function handleClose() {
        props.onClose();
    }
    

    function mouseover(event, data, variant){
        // delete any remaining tooltips
        select("#ActorIconTooltip").remove();
        select(actorIconBigWrapperRef.current)
            .append("div")
            .style("position", "absolute")
            .style("opacity", 0)
            .attr("class", "ActorIconTooltip")
            .attr("id", "ActorIconTooltip")
            .style("background-color", styles.neutralColor)
            .style("border-radius", styles.mainBorderRadius)
            .style("padding", "5px")
    }

    function mousemove(event, data, variant){
        let tooltipText = ''
        if(variant === 'val'){
            tooltipText = (props.eventTypeSummary[data] * 100).toFixed(2) + '%';
        } else {
            tooltipText = interCodeMapping[props.actorType]
        }
        select("#ActorIconTooltip")
            .style("opacity", 1)
            .html(
                "<div className=ActorIconTooltip>" +
                    `<div className=line> ${tooltipText} </div>` +
                "</div>"
            )
            .style('font-size', '0.8rem')
            .style("left", (event.x) - 260 + "px")
            .style("top", (event.y) - 30 + "px")
    }

    function mouseleave(event, data, variant){
        select("#ActorIconTooltip")
            .style("opacity", 0)
        // remove the tooltip when hover leaves point
        select("#ActorIconTooltip").remove();
    }

    useEffect(()=>{
        
        setTimeout(function() { // timeout somehow needed for correct display of drawing
            // Resource: https://d3-graph-gallery.com/graph/circular_barplot_basic.html

        let iconSVG = select(actorIconPopupSVG.current)

        let textSpacer = 30; // leave space for the labels text
        let innerRadius = props.dim / 6;
        let outerRadius = (props.dim / 2) - textSpacer;   // the outerRadius goes from the middle of the SVG area to the border
        let scale = (2* innerRadius) / (Math.SQRT2 * 24); // 24px is the size of the SVG icon
        
        // remove all leftover elements
        iconSVG.selectAll("g").remove();
        iconSVG.selectAll("path").remove();
        iconSVG.selectAll("rect").remove();

        let svgGroup = iconSVG.append('g')
        .attr("transform", `translate(${props.dim/2},${props.dim/2})`);

        // X scale
        const x = scaleBand()
        .range([0, - 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)               
        .domain(Object.keys(props.eventTypeSummary))


        // Y scale
        const y = scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, 1]); // Domain of Y is from 0 to the max seen in the data

        // Add bars
        svgGroup.append("g")
        .selectAll("path")
        .data(Object.keys(props.eventTypeSummary))
        .join("path")
            .attr("fill", d => props.eventColours[d])
            .attr("d", arc()     // imagine your doing a part of a donut plot
                .innerRadius(innerRadius)
                .outerRadius(d => y(props.eventTypeSummary[d]))
                .startAngle(d => x(d))
                .endAngle(d => x(d) + x.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius))
            .style('cursor', 'pointer')
            .on("mouseover", (e, d) => mouseover(e, d, 'val'))
            .on("mousemove", (e, d) => mousemove(e, d, 'val'))
            .on("mouseleave", (e, d) => mouseleave(e, d, 'val'));

        // add center icon
        svgGroup.append('path')
        .attr('d', interCodeToSVG[props.actorType].path)
        .attr('fill', props.colour)
        .attr('stroke', props.colour)
        .attr('transform', "translate(" + (-(scale * 24)/2)+ ',' + (-(scale * 24)/2) +`)scale(${scale})`)
        .style('cursor', 'pointer')
        .on("mouseover", (e, d) => mouseover(e, d, 'type'))
        .on("mousemove", (e, d) => mousemove(e, d, 'type'))
        .on("mouseleave", (e, d) => mouseleave(e, d, 'type'));

        // Add the labels
        svgGroup.append("g")
        .selectAll("g")
        .data(Object.keys(props.eventTypeSummary))
        .join("g")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) { return "rotate(" + ((x(d) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + (y(props.eventTypeSummary[d])+textSpacer) + ",0)"; })
        .append("text")
            .text(function(d){return(eventTypeToText[d])})
            .attr('transform', function(d) {return "rotate(" + ((-1)**d)*(-90) + ")translate(0,"+((d%2==1)? (textSpacer-5) : 0)+")"})
            .style("font-size", styles.fontXSmall)
            .attr("alignment-baseline", "middle")
            .call(wrapText, 100) // wrap the text if wider than 100px
            .style('cursor', 'pointer')
            .on("mouseover", (e, d) => mouseover(e, d, 'val'))
            .on("mousemove", (e, d) => mousemove(e, d, 'val'))
            .on("mouseleave", (e, d) => mouseleave(e, d, 'val'));
        }, 1000)
        

    }, [actorIconPopupSVG.current, props.open])

    return (
        <Dialog 
        onClose={handleClose} 
        PaperProps={{ sx: { minWidth: {xs: "95%", md: "75%"},  height: "100%", borderRadius: "20px" } }}
        open={props.open}
        >
            <DialogTitle sx={{padding: "20px 20px"}}>
                <Typography fontSize='1rem' sx={{marginRight:'10px'}}>Actor Glyph Explanation:</Typography>
                <Typography fontSize='1.5rem' sx={{marginRight:'10px'}}>{props.actor_name}</Typography>
            {props.onClose ? (
            <IconButton
            aria-label="close"
            onClick={props.onClose}
            sx={{
                position: 'absolute',
                right: 10,
                top: 10,
            }}
            >
            <CloseIcon />
            </IconButton>
        ) : null}
            </DialogTitle>
            <DialogContent sx={{padding: "20px 20px", overflowY: "visible"}}>
            <div className='actor-icon-big-wrapper' ref={actorIconBigWrapperRef}>
                <svg className='actor-icon-svg' ref={actorIconPopupSVG} style={{width: props.dim, height: props.dim}}></svg>
            </div>
            </DialogContent>
        </Dialog>
    );
}

ActorIconPopup.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    actor_name: PropTypes.string,
    eventTypeSummary: PropTypes.object.isRequired,
    eventColours: PropTypes.object.isRequired,
    actorType: PropTypes.number.isRequired,
    dim: PropTypes.number.isRequired,
    colour: PropTypes.string.isRequired,
};