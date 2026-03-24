import { select } from "d3-selection";

// Adapted from resource: https://bl.ocks.org/mbostock/7555321

function wrapRelText(text, width) {
    /**
     * function to wrap text for graph nodes
     */
    text.each(function() {
        let text = select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1, // ems
            y = text.attr("y"),
            x = text.attr("x"),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", 0 + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + "em").text(word);
            }
        }
    });
  }

export default wrapRelText;