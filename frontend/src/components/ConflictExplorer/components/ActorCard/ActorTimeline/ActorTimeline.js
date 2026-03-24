
import './ActorTimeline.scss';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../styles/global_variables.scss';

import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { scaleLinear, scaleTime } from "d3-scale";
import { extent } from "d3-array";
import { timeParse } from "d3-time-format";
import moment from 'moment';

export default function ActorTimeline({ timelineInfo, start, end }) {
  const timelineRef = useRef(null);
  const timelineWrapperRef = useRef(null);

  function mouseover(event, key, val) {
    select("#TimelineTooltipID").remove();
    select(timelineWrapperRef.current)
      .append("div")
      .style("position", "absolute")
      .style("opacity", 0)
      .attr("class", "timelineTooltip")
      .attr("id", "TimelineTooltipID")
      .style("background-color", styles.neutralColor)
      .style("border-radius", styles.mainBorderRadius)
      .style("padding", "5px");
  }

  function mousemove(event, date, val) {
    let dateFormatted = new Date(date);
    const options = { year: 'numeric', month: 'long' };
    dateFormatted = dateFormatted.toLocaleDateString("en-GB", options);

    select("#TimelineTooltipID")
      .style("opacity", 1)
      .html(
        `<div class="timelineTooltip">
            <div class="line">${val} (${dateFormatted})</div>
         </div>`
      )
      .style("left", event.x - 200 + "px")
      .style("top", event.y - 65 + "px")
      .style('font-size', '0.8rem');
  }

  function mouseleave() {
    select("#TimelineTooltipID").style("opacity", 0).remove();
  }

  const drawChart = () => {
    if (!timelineInfo || !timelineRef.current) return;

    const svg = select(timelineRef.current);
    svg.selectAll("*").remove();

    const data = timelineInfo.map(entry => ({
      date: timeParse("%Y-%m")(`${entry.year}-${entry.month}`),
      value: entry.value
    }));

    const svgSize = timelineRef.current.getBoundingClientRect();
    const svgWidth = svgSize.width;
    const svgHeight = svgSize.height;

    const graphPadding = 50;
    const yPadding = 5;
    const maxEntry = Math.max(...data.map(entry => entry.value));

    const timelineScale = scaleTime()
      .domain(extent(data, d => d.date))
      .range([0, svgWidth - graphPadding - yPadding]);

    const xAxis = axisBottom(timelineScale);
    svg.append("g")
      .attr("transform", `translate(${graphPadding},${svgHeight - graphPadding + yPadding})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-40)")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em");

    const yAxisScale = scaleLinear()
      .domain([0, maxEntry + 2])
      .range([svgHeight - graphPadding, 0]);

    const yAxis = axisLeft(yAxisScale);
    svg.append("g")
      .attr("transform", `translate(${graphPadding},${yPadding})`)
      .call(yAxis);

    const barWidth = (svgWidth - graphPadding - yPadding) / data.length;

    const startDate = moment(start, 'YYYY-MM-DD').startOf('month');
    const endDate = moment(end, 'YYYY-MM-DD').endOf('month');

    svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => graphPadding + timelineScale(d.date))
      .attr("y", d => yAxisScale(d.value) + yPadding)
      .attr("width", barWidth)
      .attr("height", d => d.value === 0 ? 0 : svgHeight - graphPadding - yAxisScale(d.value))
      .attr("fill", d => {
        return moment(d.date).isBetween(startDate, endDate)
          ? styles.timelineHighlight
          : styles.neutralDark;
      })
      .style('cursor', 'pointer')
      .on("mouseover", (event, d) => mouseover(event, d.date, d.value))
      .on("mousemove", (event, d) => mousemove(event, d.date, d.value))
      .on("mouseleave", mouseleave);
  };

  useEffect(() => {
    drawChart();
    const observer = new ResizeObserver(() => {
      drawChart();
    });
    if (timelineWrapperRef.current) {
      observer.observe(timelineWrapperRef.current);
    }
    return () => observer.disconnect();
  }, [timelineInfo, start, end]);

  return (
    <div ref={timelineWrapperRef} className="actor-card-timeline-wrapper">
      <svg className="actor-card-timeline-svg" ref={timelineRef}></svg>
    </div>
  );
}

ActorTimeline.propTypes = {
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  timelineInfo: PropTypes.array.isRequired
};
