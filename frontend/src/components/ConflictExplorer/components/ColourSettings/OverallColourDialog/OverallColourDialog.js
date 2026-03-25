import './OverallColourDialog.scss';
import { useState, useEffect, useRef } from 'react';
import styles from '../../../styles/global_variables.scss';
// MUI components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// utils
import eventTypeToText from '../../../utils/eventTypeToText';
// external libraries
import cloneDeep from 'lodash/cloneDeep';
import { select } from "d3-selection";
import { arc } from "d3-shape";
import { scaleBand, scaleRadial } from "d3-scale";
import { HexColorPicker, HexColorInput } from "react-colorful";

export default function OverallColourDialog(props) {
    const svgRef = useRef();
    const linkCollabRef = useRef();
    const linkOppRef = useRef();
    const [ pickerTarget, setPickerTarget ] = useState(null);
    const [ pickerColour, setPickerColour ] = useState('');
    const [ storedColours, setStoredColours] = useState({});
    const [ tempColours, setTempColours] = useState({});
    const [ linkPickerTarget, setLinkPickerTarget ] = useState(null);
    const [ linkPickerColour, setLinkPickerColour ] = useState('');
    const [ linkStoredColours, setLinkStoredColours] = useState({});
    const [ linkTempColours, setLinkTempColours] = useState({});
    const [ selectedDash, setSelectedDash ] = useState('');
    const [ labelSize, setLabelSize ] = useState('14pt');
    const [ maxLinkWidth, setMaxLinkWidth ] = useState(50);
    const theme = useTheme();
    const isMediumDevice = useMediaQuery(theme.breakpoints.down('md')); 
    const dashChoices = ['', '10,5', '10,10', '20,10']

    function saveSettings(){
        // colours for event types 
        setStoredColours(tempColours)
        setPickerColour(tempColours[Object.keys(tempColours)[0]])
        setPickerTarget(Object.keys(tempColours)[0])
        props.applyChangeEventTypeColours(tempColours)

        // colours for link types
        setLinkStoredColours(linkTempColours)
        setLinkPickerColour(linkTempColours[Object.keys(linkTempColours)[0]]['colour'])
        setPickerTarget(Object.keys(linkTempColours)[0])
        props.applyChangeGraphSettings(linkTempColours, labelSize, maxLinkWidth)

        // close dialog
        props.onClose();
    }

    function handleClose(){
        // reset event type colours
        setTempColours(storedColours);
        setPickerColour(storedColours[Object.keys(storedColours)[0]]);
        setPickerTarget(Object.keys(storedColours)[0])

        // reset link type colours
        setLinkTempColours(linkStoredColours);
        setLinkPickerColour(linkStoredColours[Object.keys(linkStoredColours)[0]]['colour']);
        setLinkPickerTarget(Object.keys(linkStoredColours)[0])

        // close dialog
        props.onClose();
    }

    useEffect(() => {
        setStoredColours(props.eventTypeColours)
        setTempColours(props.eventTypeColours)
        if(props.eventTypeColours){
            setPickerTarget(Object.keys(props.eventTypeColours)[0])
            setPickerColour(props.eventTypeColours[Object.keys(props.eventTypeColours)[0]])
        }
    }, [props.eventTypeColours])

    useEffect(() => {
        setLinkStoredColours(props.linkTypeColours);
        setLinkTempColours(props.linkTypeColours);
        if(props.linkTypeColours){
            setLinkPickerTarget(Object.keys(props.linkTypeColours)[0])
            setSelectedDash(props.linkTypeColours[Object.keys(props.linkTypeColours)[0]]['stroke'])
            setLinkPickerColour(props.linkTypeColours[Object.keys(props.linkTypeColours)[0]]['colour'])
        }
    }, [props.linkTypeColours])

    useEffect(()=>{
        setTimeout(function() {
        // Resource: https://d3-graph-gallery.com/graph/circular_barplot_basic.html
        const dim = isMediumDevice ? 275 : 390;  // Reduced dim value for mobile;

        let iconSVG = select(svgRef.current)

        const innerRadius = isMediumDevice ? dim / 6 - 38 : dim / 6 - 35;
        const outerRadius = isMediumDevice ? dim / 2 - 38 : dim / 2 - 35;
        
        iconSVG.selectAll("g").remove();
        iconSVG.selectAll("path").remove();
        iconSVG.selectAll("rect").remove();

        let svgGroup = iconSVG.append('g')
        .attr("transform", `translate(${dim/2},${dim/2})`);

        // X scale
        const x = scaleBand()
        .range([0, - 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)               
        .domain(Object.keys(tempColours))


        // Y scale
        const y = scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, 1]); // Domain of Y is from 0 to the max seen in the data

        // Add bars
        svgGroup.append("g")
        .selectAll("path")
        .data(Object.keys(tempColours))
        .join("path")
            .attr("fill", d => tempColours[d]) 
            .attr("d", arc()     // imagine your doing a part of a donut plot
                .innerRadius(innerRadius)
                .outerRadius(d => y(1))
                .startAngle(d => x(d))
                .endAngle(d => x(d) + x.bandwidth())
                .padAngle(0.1)
                .padRadius(innerRadius))
            .style('cursor', 'pointer')
            .on('click', setColourPicker)
            .attr('stroke', d => styles.primaryDark)
            .attr('stroke-width', d => getStrokeWidth(d))
        

        // Add the labels
        svgGroup.append("g")
        .selectAll("g")
        .data(Object.keys(tempColours))
        .join("g")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) { return `rotate(${((x(d) + x.bandwidth() / 2) * 180 / Math.PI - 88)})translate(${(y(1)+10)},0)`; })
        .append("text")
            .text(function(d){return(eventTypeToText[d])})
            .attr('transform', function(d) {return "rotate(" + ((-1)**d)*(-88) + ")"})
            .style("font-size", styles.fontXSmall)
            .attr("alignment-baseline", "middle")
        }, 1000)

    }, [svgRef.current, props.open, pickerColour, pickerTarget])

    useEffect(()=>{
        setTimeout(function() {
        // Resource: https://d3-graph-gallery.com/graph/circular_barplot_basic.html

        const collab = [{name: 'cooperation', coordinates: [0, 400]}]
        const opp = [{name: 'opposition', coordinates: [0, 400]}]

        let collabSVG = select(linkCollabRef.current)
        let oppSVG = select(linkOppRef.current)

        collabSVG.selectAll("g").remove();
        collabSVG.selectAll("line").remove();
        collabSVG.selectAll("rect").remove();


        oppSVG.selectAll("g").remove();
        oppSVG.selectAll("line").remove();
        oppSVG.selectAll("rect").remove();

        const height = maxLinkWidth
        const strokeWidth = 10

        // Initialize the links
        collabSVG.append("g")
        .selectAll("line")
        .data(collab)
        .join("line")
            .attr("x1", d => d.coordinates[0] + strokeWidth /2)     // x position of the first end of the line
            .attr("y1", 0)      // y position of the first end of the line
            .attr("x2", d => d.coordinates[1] - strokeWidth/2)     // x position of the second end of the line
            .attr("y2", 0)
            .attr("transform", `translate(${0},${height/2 + strokeWidth})`)
            .attr("stroke", d => linkTempColours[d.name].colour)
            .attr("stroke-width", height + strokeWidth)
            .attr("stroke-dasharray", d => linkTempColours[d.name].stroke);

        oppSVG.append("g")
        .selectAll("line")
        .data(opp)
        .join("line")
            .attr("x1", d => d.coordinates[0] + strokeWidth/2)     // x position of the first end of the line
            .attr("y1", 0)      // y position of the first end of the line
            .attr("x2", d => d.coordinates[1] - strokeWidth/2)     // x position of the second end of the line
            .attr("y2", 0)
            .attr("transform", `translate(${0},${height/2 + strokeWidth})`)
            .attr("stroke", d => linkTempColours[d.name].colour)
            .attr("stroke-width", height + strokeWidth)
            .attr("stroke-dasharray", d => linkTempColours[d.name].stroke);

        }, 1000)

    }, [linkCollabRef.current, linkOppRef.current, props.open, linkPickerColour, linkPickerTarget, selectedDash, maxLinkWidth])

    function getStrokeWidth(d){
        if(d === pickerTarget){
            return '2%'
        } else {
            return '0'
        }
    }

    function setLinkColourPicker(name){
        setLinkPickerTarget(name)
        setLinkPickerColour(linkTempColours[name].colour)
        setSelectedDash(linkTempColours[name].stroke)
    }

    function setColourPicker(e, d){
        setPickerTarget(d)
        setPickerColour(tempColours[d])
    }

    function setNewColour(newHex){
        if(pickerTarget){
            setPickerColour(newHex);
            let temp =  cloneDeep(tempColours);
            temp[pickerTarget] = newHex;
            setTempColours(temp);
        }
    }

    function setNewLinkColour(newHex){
        if(linkPickerTarget){
            setLinkPickerColour(newHex);
            let temp =  cloneDeep(linkTempColours);
            temp[linkPickerTarget]['colour'] = newHex;
            setLinkTempColours(temp);
        }
    }

    function selectDashType(dash){
        const link = linkPickerTarget;
        linkTempColours[link]['stroke'] = dash;
        setSelectedDash(dash);
    }

    const handleFontSize = (event) => {
        setLabelSize(event.target.value);
      };

    const handleMaxLinkWidth = (event) => {
        setMaxLinkWidth(event.target.value);
    }
  
    return (
      <Dialog 
      PaperProps={{ sx: { minWidth: "90%", height: '100%', borderRadius: '20px', backgroundColor: styles.lightGrey } }}
      open={props.open}
      onClose={handleClose} 
      >
        <DialogTitle sx={{padding: {xs:'20px 12px', md:'20px 24px'}}}>
            <Typography fontSize='30px' fontWeight={600} color={styles.darkBlue}>Change Display Settings</Typography>
            {props.onClose ? (
                <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    color: styles.darkBlue600
                }}
                >
                <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
        <DialogContent sx={{padding: {xs:'20px 12px', md:'20px 24px'}}}>
            <Box className='overall-colour-dialog-wrapper' sx={{height: {xs:'inherit', md:'100%'}}}>
                <Box className='colours-wrapper' sx={{flexDirection: {xs:'column', md:'row'}, overflow: {xs:'visible', md:'hidden'}, gap:{xs:'40px', md:'40px'} }}>
                    <div className='event-colours-wrapper'>
                        <Typography fontSize='20px' fontWeight={600} color={styles.darkBlue}>Event Type Colour</Typography>
                        <Box className='svg-wrapper'>
                            <svg className='colour-dialog-svg' ref={svgRef}
                            ></svg>
                        </Box>
                        <div className='custom-colour-wrapper'>
                            <Typography>Custom Event Type Colour</Typography>
                            <HexColorInput color={pickerColour} onChange={setNewColour} prefixed />
                            <HexColorPicker color={pickerColour} onChange={setNewColour} />
                        </div>
                    </div>
                    <Box className='link-colours-wrapper' gap={'20px'}>
                        <Typography fontSize='20px' fontWeight={600} color={styles.darkBlue}>Actor Graph Settings</Typography>
                        <div className='fontsize-wrapper'>
                            <Typography fontSize={labelSize} mr={2} >Label Size for Actor Nodes</Typography>
                            <Select
                                id="select-labelsize"
                                value={labelSize}
                                onChange={handleFontSize}
                                size="small"
                            >
                                <MenuItem value={'10pt'}>small</MenuItem>
                                <MenuItem value={'14pt'}>medium</MenuItem>
                                <MenuItem value={'18pt'}>big</MenuItem>
                            </Select>
                        </div>
                        <div className='linkwidth-wrapper'>
                            <Typography>Maximum Width for Graph Links</Typography>
                            <Slider 
                            className='linkwidth-slider'
                            step={5}
                            marks
                            min={5}
                            max={60}
                            value={maxLinkWidth} 
                            onChange={handleMaxLinkWidth} />
                            <Typography minWidth={'55px'} marginLeft={'5px'}>{maxLinkWidth} px</Typography>
                        </div>
                        <Box className='link-svg-wrapper' width={'100%'}>
                            <button 
                            onClick={() => setLinkColourPicker('cooperation')}
                            className={'link-selection-wrapper' + (('cooperation' === linkPickerTarget)? ' selected' : '')}>
                                <Typography sx={{textAlign:"left"}}>Collaborations</Typography>
                                <svg className='link-dialog-svg' ref={linkCollabRef}></svg>
                            </button>
                            <button 
                            onClick={() => setLinkColourPicker('opposition')}
                            className={'link-selection-wrapper' + (('opposition' === linkPickerTarget)? ' selected' : '')} paddingLeft={'0!important'} paddingRight={'0!important'}>
                                <Typography sx={{textAlign:"left"}}>Oppositions</Typography>
                                <svg className='link-dialog-svg' ref={linkOppRef}></svg>
                            </button>
                        </Box>
                        <div className='link-dash-wrapper'>
                            {dashChoices.map((dash) => {
                            return(
                                <Chip 
                                key={'dash-type-' + dash}
                                label={(dash === '')? 'solid' : dash}
                                onClick={() => {selectDashType(dash)}}
                                sx={{
                                    paddingX: '5px', 
                                    backgroundColor: ((selectedDash === dash)? styles.primaryDark:styles.colorWhite), 
                                    fontSize: '0.8rem',
                                }}
                                color='neutral'
                                icon={
                                    <svg className='dash-icon'>
                                        <line 
                                        stroke={linkPickerColour}
                                        strokeDasharray={dash}
                                        x1='0'
                                        y1='0'
                                        x2='40'
                                        y2='0'
                                        strokeWidth='10'
                                        transform='translate(0,5)'
                                        ></line>
                                    </svg>
                                }
                                >
                                </Chip>
                            )
                        })}
                        </div>
                        <div className='custom-colour-wrapper'>
                            <Typography>Custom Link Colour</Typography>
                            <HexColorInput color={linkPickerColour} onChange={setNewLinkColour} prefixed />
                            <HexColorPicker color={linkPickerColour} onChange={setNewLinkColour} />
                        </div>
                    </Box>
                </Box>
                <Button 
                onClick={saveSettings}
                variant="outlined" 
                sx={{padding: {xs:'12px 12px'},fontSize: '16px', borderRadius: '10px', border: '2px solid #3D76AB', background: styles.textWhite, color: styles.lightBlue, minWidth: '200px', margin: '0 auto',
                '&:hover': {
                    border: '2px solid #3D76AB',
                    background: styles.textWhite,
                    color: styles.lightBlue
                }
                }}             

                >
                    Apply
                </Button>
            </Box>
        </DialogContent>
      </Dialog>
    );
  }