import { select } from "d3-selection";

// Adapted from resource: https://bl.ocks.org/mbostock/7555321

function wrapText(text, width) {
    text.each(function() {
        let text = select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1, // ems
            offset_from_bar = (-1),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", offset_from_bar + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", ++lineNumber * lineHeight + offset_from_bar + "em").text(word);
            }
        }
    });
  }

export default wrapText;