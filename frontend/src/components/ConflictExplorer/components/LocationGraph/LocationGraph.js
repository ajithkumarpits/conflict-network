
import "./LocationGraph.scss";
import styles from "../../styles/global_variables.scss";
import { useEffect, useRef, useState } from "react";
// components
import GraphLegend from "../GraphLegend/GraphLegend";
import LinkCard from "../LinkCard/LinkCard";
import ActorCard from "../ActorCard/ActorCard";
import SnapshotButton from "../SnapshotButton/SnapshotButton";
//Hooks
import useIsBelowMd from "../../../../hooks/useIsBelowMd";
//MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Tooltip from "@mui/material/Tooltip";

// utils
import interCodeToSVG from "../../utils/interCodeToSVG";
import InterCodeMapping from "../../components/InteractionLegend/InteractionLegend";
import wrapRelText from "../../utils/wrapRelText";
import kamadaKawaiLayout from "../../utils/kamadaKawai";
import fruchtermanReingoldLayout from "../../utils/fruchtermanReingold";
import circleLayout from "../../utils/circleLayout";
// external libraries
import { select ,selectAll} from "d3-selection";
import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide, forceX, forceY } from "d3-force";
import { scaleBand, scaleRadial } from "d3-scale";
import { arc } from "d3-shape";
import { drag as d3Drag } from "d3-drag";
import { zoom } from "d3-zoom";
import "d3-transition";
import { easeCubicInOut } from "d3-ease";
import cloneDeep from "lodash/cloneDeep";
import uniq from "lodash/uniq";

export default function LocationGraph(props) {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const simulationRef = useRef(null);
  const cachedPositionsRef = useRef(null);
  const graphDataRef = useRef(null); // stores {nodes, links, node, link, containerSize}
  const prevLayoutAlgoRef = useRef('force-directed');
  const [forcePosition, setForceCenter] = useState([250, 350]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [colourSettings, setColourSettings] = useState({});
  const [linkColours, setLinkColours] = useState({});
  const [openCard, setOpenCard] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [selectedActor1, setSelectedActor1] = useState(null);
  const [selectedActor2, setSelectedActor2] = useState(null);
  const [linkSelection, setLinkSelection] = useState(null);
  const [selectedActor, setSelectedActor] = useState("");
  const [openActorCard, setOpenActorCard] = useState(false);
  const isBelowMd = useIsBelowMd();

  // Keep a reference to the latest props and states to avoid stale closures in D3 click handlers
  // without having to rebuild the entire SVG when they change.
  const latestPropsRef = useRef(props);
  const latestSelectedNodesRef = useRef(selectedNodes);
  const latestLinkSelectionRef = useRef(linkSelection);
  const defaultSimulationRef = useRef(null);

  useEffect(() => {
    latestPropsRef.current = props;
    latestSelectedNodesRef.current = selectedNodes;
    latestLinkSelectionRef.current = linkSelection;
  }, [props, selectedNodes, linkSelection]);

  useEffect(() => {
    setColourSettings(props.eventTypeColours);
  }, [props.eventTypeColours]);

  useEffect(() => {
    setLinkColours(props.linkTypeColours);
  }, [props.linkTypeColours]);

  useEffect(() => {
    setSelectedNodes(props.selectedInGraph);
  }, [JSON.stringify(props.selectedInGraph)]); // stringify to be able to use array as dependency

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const graph_height = entries[0].borderBoxSize[0].blockSize;
      const graph_width = entries[0].borderBoxSize[0].inlineSize;
      setForceCenter([graph_width / 2, graph_height / 2]);
    });
    resizeObserver.observe(wrapperRef.current);
  });

  function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
    // https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
    return (
      ((maxAllowed - minAllowed) * (unscaledNum - min)) / (max - min) +
      minAllowed
    );
  }

  function getLinkWidth(d) {
    let maxLinkWidth = props.linkWidth;
    let minLinkWidth = 3;
    let maxLinkSize = props.graphData.max_link;
    const linkCount = d["count"]; 
    let scaled = scaleBetween(
        linkCount,
        minLinkWidth,
        maxLinkWidth,
        1,
        maxLinkSize
    );
    return scaled;
}



  function getLinkColour(d) {
    const currentLinkColours = latestPropsRef.current.linkTypeColours;
    if (currentLinkColours) {
      if (d["linkType"] === 0) {
        return currentLinkColours["cooperation"]?.["colour"] || "#000000";
      } else if (d["linkType"] === 1) {
        return currentLinkColours["opposition"]?.["colour"] || "#000000";
      } else if (d["linkType"] === 2) {
        return currentLinkColours["mediation"]?.["colour"] || "#1565C0"; // Default colour for mediation if undefined
      } else {
        return currentLinkColours["other"]?.["colour"] || "#000000";
      }
    } else {
      return "#000000";
    }
  }

  function getLinkStyle(d) {
    const currentLinkColours = latestPropsRef.current.linkTypeColours;
    if (currentLinkColours) {
      if (d["linkType"] === 0) {
        return currentLinkColours["cooperation"]?.["stroke"] || "";
      } else if (d["linkType"] === 1) {
        return currentLinkColours["opposition"]?.["stroke"] || "";
      } else if (d["linkType"] === 2) {
        return currentLinkColours["mediation"]?.["stroke"] || "";
      } else {
        return currentLinkColours["other"]?.["stroke"] || "";
      }
    } else {
      return "";
    }
  }

  function getLinkOpacity(d) {
    const currentLinkSelection = latestLinkSelectionRef.current;
    if (currentLinkSelection) {
      if (d["linkType"] === 0) {
        return currentLinkSelection["cooperation"] ? 1 : 0;
      } else if (d["linkType"] === 1) {
        return currentLinkSelection["opposition"] ? 1 : 0;
      } else if (d["linkType"] === 2) {
        return currentLinkSelection["mediation"] ? 1 : 0;
      } else {
        return currentLinkSelection["other"] ? 1 : 0;
      }
    } else {
      return 1;
    }
  }

  function getNodeColour(d) {
    if (!d || !d.actor_id) return styles.primaryLight;
    if (selectedNodes.includes(d["actor_id"])) {
      return styles.highlightColor;
    } else return styles.primaryLight;
  }

  function mouseoverLink(event, d) {
    if (d["linkType"] === 2) return;
    select(
      "#graph-link-" + d["source"].actor_id + "-" + d["target"].actor_id
    ).attr("stroke", function (d) {
      return styles.linkHighlight;
    });
  }

  function mousemoveLink(event, d) {
    if (d["linkType"] === 2) return;
    select(
      "#graph-link-" + d["source"].actor_id + "-" + d["target"].actor_id
    ).attr("stroke", function (d) {
      return styles.linkHighlight;
    });
  }

  function mouseleaveLink(event, d) {
    if (d["linkType"] === 2) return;
    select(
      "#graph-link-" + d["source"].actor_id + "-" + d["target"].actor_id
    ).attr("stroke", function (d) {
      return getLinkColour(d);
    });
  }

  function handleClickNode(event, d) {
    if (d.node_type === "third_party") return;
    const currentProps = latestPropsRef.current;
    const currentSelectedNodes = latestSelectedNodesRef.current;

    if (currentProps.isSelectable) {
      let selected = cloneDeep(currentSelectedNodes);
      if (selected.includes(d.actor_id)) {
        // get index of element
        const idx = selected.indexOf(d.actor_id);
        // remove item from selected
        selected.splice(idx, 1);
      } else {
        // add item to selected
        selected.push(d.actor_id);
        if (currentProps.neighbourDegree === 1) {
          const relLinks = currentProps.graphData.links.filter((link) => {
            return link.source === d || link.target === d;
          });
          const allIds = relLinks.map((link) => {
            return [link.source.actor_id, link.target.actor_id];
          });
          const combined = selected.concat(allIds);
          selected = uniq(combined.flat());
        }
      }

      setSelectedNodes(selected);
      currentProps.updateFiltering(selected);
      currentProps.updateGraphSelection(selected);
    } else {
      // open actor card
      showActorCard(d.actor_name);
    }
  }

  function handleClickLink(link) {
    if (link["linkType"] === 2) return;
    const currentLinkSelection = latestLinkSelectionRef.current;
    if (currentLinkSelection) {
      if (link["linkType"] === 0) {
        if (currentLinkSelection["cooperation"]) {
          showEventCard(link);
        }
      } else if (link["linkType"] === 1) {
        if (currentLinkSelection["opposition"]) {
          showEventCard(link);
        }
      } else if (link["linkType"] === 2) {
        if (currentLinkSelection["mediation"]) {
          showEventCard(link);
        }
      } else {
        if (currentLinkSelection["other"]) {
          showEventCard(link);
        }
      }
    } else {
      showEventCard(link);
    }
  }

  function getLinkCursorType(link) {
    if (link["linkType"] === 2) return "default";
    const currentLinkSelection = latestLinkSelectionRef.current;
    if (!currentLinkSelection) return "pointer";

    const typeMapping = {
        0: "cooperation",
        1: "opposition",
        2: "mediation",
        other: "other"
    };
    const linkTypeKey = typeMapping[link["linkType"]] || "other";
    return currentLinkSelection[linkTypeKey] ? "pointer" : "default";
}


  useEffect(() => {
    if (props.isSelectable) {
      props.updateFiltering(selectedNodes);
    }
  }, [props.minSize]);

  // ---- Fast style updates (no rebuild) ----
  useEffect(() => {
    const svg = select(svgRef.current);
    if (svg.empty()) return;

    // Update node background colours (selected state)
    // We use .selectAll(".node-group").select(".graph-node") to guarantee D3 data propagation
    svg.selectAll(".node-group")
      .select(".graph-node")
      .attr("fill", (d) => getNodeColour(d));

    // Update node highlight rings (highlightState from map hover)
    svg.selectAll(".node-group")
      .select("circle:first-child")
      .style("opacity", (d) => {
        if (!d) return 0;
        if (props.highlightState && props.highlightState.isHighlighted && props.highlightState.actorName === d.actor_name) {
          return 1;
        }
        return 0;
      });

    // Update link opacities/cursors/colours
    svg.selectAll(".graph-link-path")
      .style("cursor", (d) => getLinkCursorType(d))
      .style("opacity", (d) => getLinkOpacity(d))
      .attr("stroke", (d) => getLinkColour(d))
      .attr("stroke-dasharray", (d) => getLinkStyle(d));

    // Update radial bar colours
    svg.selectAll(".radial-bar")
      .attr("fill", (d) => {
        if (colourSettings) {
          return colourSettings[d["key"]];
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodes, props.highlightState, linkSelection, colourSettings, linkColours]);

  useEffect(() => {
    // after example from https://observablehq.com/@d3/force-directed-graph

    // Skip full rebuild if only layoutAlgorithm changed (morph useEffect handles it)
    const currentLayout = props.layoutAlgorithm || 'force-directed';
    if (currentLayout !== prevLayoutAlgoRef.current && graphDataRef.current) {
      prevLayoutAlgoRef.current = currentLayout;
      return;
    }
    prevLayoutAlgoRef.current = currentLayout;

    const data = props.graphData;
    const svg = select(svgRef.current);

    if (props.eventTypeColours && props.linkTypeColours) {
      const highlightWidth = 5;

      let containerSize = 45;
      const innerRadius = containerSize / 6;
      const outerRadius = containerSize / 2 - highlightWidth;
      const scale = (2 * innerRadius) / (Math.SQRT2 * 24);
      const transAmount = (containerSize - scale * 24) / 2;
      const eventsTransAmount = containerSize / 2;

      // filter nodes and links to only contain items above threshold (>= minSize)
      const filteredNodes = data.nodes.filter(
        (node) => node["appearance"] >= props.minSize
      );
      const filteredNodesIds = filteredNodes.map((node) => {
        return node["actor_id"];
      });

      const filteredLinks = data.links.filter((link) => {
        const withIDs =
          filteredNodesIds.includes(link["source"]) &&
          filteredNodesIds.includes(link["target"]);
        const withNodes =
          filteredNodes.includes(link["source"]) &&
          filteredNodes.includes(link["target"]);

        const shouldKeep = withIDs || withNodes;

        return shouldKeep;
      });

      // prevent graph from being drawn multiple times
      svg.selectAll("circle").remove();
      svg.selectAll("g").remove();
      svg.selectAll("line").remove();
      svg.selectAll("text").remove();
      svg.selectAll("svg").remove();

      // ---- Shared helper functions for both layouts ----
      function getIconPathByID(id) {
        const found = props.actors.find((actor) => actor.id === id);
        if (found) {
          return interCodeToSVG[found.actorType].path;
        } else {
            // Third party node fallback
            // We use interCodeToSVG[2].path for demonstration or a default icon.
          return interCodeToSVG['mediation']?.path || ""; 
        }
      }

      function getEventTypeSummaryById(id) {
        const found = props.actors.find((actor) => actor.id === id);
        if (found) {
          return found.eventTypeSummary;
        } else {
            // Third party node fallback
          return { "mediation": 1 };
        }
      }

      function getBars(id) {
        const summary = getEventTypeSummaryById(id);
        let bars = [];
        Object.keys(summary).forEach((name) => {
          let obj = {
            key: name,
            id: id,
            val: summary[name],
          };
          bars.push(obj);
        });
        return bars;
      }

      const eventTypes = props.actors[0]
        ? props.actors[0].eventTypeSummary
        : {};

      // X scale for radial bars
      const x = 
        scaleBand()
        .range([0, -2 * Math.PI])
        .align(0)
        .domain(Object.keys(eventTypes));

      // Y scale for radial bars
      const y =
        scaleRadial()
        .range([innerRadius, outerRadius])
        .domain([0, 1]);

      // ---- Always start with force-directed layout ----
      // Stop any previous simulation
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }

      // Resolve link source/target IDs → node objects via forceLink
      const linkSimulationForce =
        forceLink(filteredLinks)
        .id(function (d) {
          return d.actor_id;
        })
        .distance(200);

      // Preserve existing node positions if possible to avoid jumps
      // For completely new nodes (like toggled peace data), default them to the center
      // so they don't awkwardly fly in from the top-left (0,0) corner.
      filteredNodes.forEach(n => {
        if (cachedPositionsRef.current && cachedPositionsRef.current[n.actor_id]) {
          n.x = cachedPositionsRef.current[n.actor_id].x;
          n.y = cachedPositionsRef.current[n.actor_id].y;
        } else {
          // Initialize at the center so the force layout pushes them outwards naturally
          n.x = forcePosition[0] + (Math.random() - 0.5) * 10;
          n.y = forcePosition[1] + (Math.random() - 0.5) * 10;
        }
      });

      // Force-directed simulation
      const forceNode = forceManyBody().strength(-300).distanceMax(400);

      const simulation =
        forceSimulation(filteredNodes)
        .force("link", linkSimulationForce)
        .force("charge", forceNode)
        .force("center", forceCenter().x(forcePosition[0]).y(forcePosition[1]))
        .force("collision", forceCollide().radius(containerSize / 2))
        .on("tick", ticked);

      // Only fire simulation if we are in force-directed mode
      if (currentLayout !== 'force-directed') {
          simulation.stop();
      }

      simulation
        .force("forceX", forceX(forcePosition[0]).strength(0.1))
        .force("forceY", forceY(forcePosition[1]).strength(0.1));

      simulationRef.current = simulation;
      defaultSimulationRef.current = simulation;

      // Cache positions after 1 second of simulation warmup
      setTimeout(function () {
        if (simulationRef.current === simulation) {
          const positions = {};
          filteredNodes.forEach((n) => {
            positions[n.actor_id] = { x: n.x, y: n.y };
          });
          cachedPositionsRef.current = positions;
        }
      }, 1000);

      // Stop simulation after 2s
      setTimeout(function () {
        if (simulationRef.current === simulation) {
          simulation.stop();
        }
      }, 2000);

      // ---- Initialize the links ----
      const link = svg
        .append("g")
        .selectAll(".graph-link-path")
        .data(filteredLinks)
        .join("path")
        .attr("class", "graph-link-path")
        .attr("fill", "none")
        .attr(
          "id",
          (d) => {
            const sId = typeof d["source"] === "object" ? d["source"].actor_id : d["source"];
            const tId = typeof d["target"] === "object" ? d["target"].actor_id : d["target"];
            return "graph-link-" + sId + "-" + tId;
          }
        )
        .on("mouseover", mouseoverLink)
        .on("mousemove", mousemoveLink)
        .on("mouseleave", mouseleaveLink)
        .style("cursor", (d) => getLinkCursorType(d))
        .on("click", (e, d) => handleClickLink(d))
        .style("opacity", (d) => getLinkOpacity(d))
        .attr("stroke", function (d) {
          return getLinkColour(d);
        })
        .attr("stroke-width", function (d) {
          return getLinkWidth(d);
        })
        .attr("stroke-dasharray", function (d) {
          return getLinkStyle(d);
        });

      // ---- Initialize the nodes ----
      const node = svg
        .append("g")
        .attr("id", "nodesContainer")
        .selectAll("g")
        .data(filteredNodes)
        .join("g")
        .attr("class", "node-group")
        .style("cursor", (d) => (d.node_type === "third_party" ? "default" : "pointer"))
        .on("click", handleClickNode)
        .call(drag(simulation));

      let nodeItem = node.append("g");

      nodeItem
        .append("text")
        .text((d) => d.actor_name)
        .attr("x", 2 * outerRadius + 10)
        .attr("y", outerRadius)
        .style("font-size", props.labelSize)
        .call(wrapRelText, 100);

      // Highlight circles
      nodeItem
        .append("g")
        .append("circle")
        .attr("r", outerRadius + highlightWidth - 1)
        .attr(
          "transform",
          `translate(${eventsTransAmount},${eventsTransAmount})`
        )
        .attr("fill", styles.multipleAppearanceColor)
        .attr("stroke", styles.secondaryDark)
        .style("opacity", (d) => {
          if (props.highlightState && props.highlightState.isHighlighted && props.highlightState.actorName === d.actor_name) {
            return 1;
          }
          return 0;
        });

      // Background circles
      nodeItem
        .append("g")
        .append("circle")
        .attr("r", outerRadius)
        .attr("class", "graph-node")
        .attr(
          "transform",
          `translate(${eventsTransAmount},${eventsTransAmount})`
        )
        .attr("fill", (d) => getNodeColour(d));

      // Actor type icons
      nodeItem
        .append("g")
        .attr(
          "transform",
          `translate(${transAmount},${transAmount})scale(${scale})`
        )
        .append("path")
        .attr("d", (d) => getIconPathByID(d["actor_id"]))
        .attr("fill", (d) => "#000000")
        .attr("stroke", (d) => "#000000");

      // Radial event type bars
      nodeItem
        .append("g")
        .attr(
          "transform",
          `translate(${eventsTransAmount},${eventsTransAmount})`
        )
        .selectAll("path")
        .data((d) => getBars(d["actor_id"]))
        .join("path")
        .attr("class", "radial-bar")
        .attr("fill", (d) => {
          if (colourSettings) {
            return colourSettings[d["key"]];
          }
        })
        .attr(
          "d",
          
            arc()
            .innerRadius(innerRadius)
            .outerRadius((d) => y(d["val"]))
            .startAngle((d) => x(d["key"]))
            .endAngle((d) => x(d["key"]) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius)
        );

      // Store references for the layout-switch useEffect
      graphDataRef.current = {
        nodes: filteredNodes,
        links: filteredLinks,
        nodeSelection: node,
        linkSelection: link,
        containerSize: containerSize,
      };

      // This function is run at each iteration of the force algorithm, updating the nodes position.
      function ticked() {
        link.attr("d", (d) => {
          return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
        });

          node.attr("transform", (d) => `translate(${d.x - containerSize / 2},${d.y - containerSize / 2})`);
      }

      // zooming
      // resource: https://www.d3indepth.com/zoom-and-pan/
      function handleZoom(event) {
        // apply transform to the chart
        selectAll("svg g .graph-link-path").attr("transform", event.transform);

        selectAll("#nodesContainer").attr("transform", event.transform);
      }

      let zoomGraph = zoom().on("zoom", handleZoom);

      svg.call(zoomGraph);


      function drag(sim) {
        function dragstarted(event) {
            if (sim) {
              if (!event.active) sim.alphaTarget(0.3).restart();
            }
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
    
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
            if (!sim) {
              // Kamada-Kawai: update positions directly during drag
              event.subject.x = event.x;
              event.subject.y = event.y;
              ticked();
            }
        }
    
        function dragended(event) {
            if (sim) {
              if (!event.active) sim.alphaTarget(0);
            }
        }
    
        return d3Drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.graphData, props.actors, props.minSize, props.nodeThreshold, props.labelSize, props.includePeaceData]);

  // ---- Layout morph effect: transitions existing elements when layout changes ----
  useEffect(() => {
    const layoutAlgo = props.layoutAlgorithm || 'force-directed';
    const gd = graphDataRef.current;
    if (!gd) return; // graph not yet built

    const { nodes, links, nodeSelection, linkSelection: linkSel, containerSize } = gd;
    if (!nodes || nodes.length === 0) return;

    const svgEl = svgRef.current;
    const wrapperEl = wrapperRef.current;
    const drawWidth = (svgEl?.clientWidth || wrapperEl?.clientWidth || forcePosition[0] * 2);
    const drawHeight = (svgEl?.clientHeight || wrapperEl?.clientHeight || forcePosition[1] * 2);

    // Save current positions as startX/startY so static physics can morph from them
    nodes.forEach(n => {
      n.startX = n.x;
      n.startY = n.y;
    });

    // ---- Stop current simulation before doing any morphing ----
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    if (layoutAlgo === 'force-directed') {
      const defSim = defaultSimulationRef.current;
      
      // Ensure the simulation is running if we are in force-directed mode
      if (defSim) {
          if (defSim.alpha() < 0.05) {
              defSim.alpha(1);
          }
          defSim.restart();
      }

      // If we have cached positions, restore them and restart simulation
      if (cachedPositionsRef.current) {
        nodes.forEach((n) => {
          const cached = cachedPositionsRef.current[n.actor_id];
          if (cached) {
            n.x = cached.x;
            n.y = cached.y;
            n.fx = null;
            n.fy = null;
          }
        });

        // Animate to cached positions
        const t = select(svgRef.current).transition()
          .duration(750)
          .ease(easeCubicInOut);

        linkSel.transition(t)
          .attr("d", (d) => {
              return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
          });

        nodeSelection.transition(t)
          .attr("transform", (d) => `translate(${d.x - containerSize / 2},${d.y - containerSize / 2})`);

        // RESTORE the original Force-Directed drag behavior so clicks don't resurrect the old static layout physics
        const defSim = defaultSimulationRef.current;
        simulationRef.current = defSim;
        
        nodeSelection.call(
          d3Drag()
            .on("start", function (event) {
              if (defSim && !event.active) defSim.alphaTarget(0.3).restart();
              event.subject.fx = event.subject.x;
              event.subject.fy = event.subject.y;
            })
            .on("drag", function (event) {
              event.subject.fx = event.x;
              event.subject.fy = event.y;
            })
            .on("end", function (event) {
              if (defSim && !event.active) defSim.alphaTarget(0);
            })
        );
      }
      return;
    }

    // Compute positions with the chosen algorithm
    // (This updates n.x and n.y temporarily)
    if (layoutAlgo === 'kamada-kawai') {
      kamadaKawaiLayout(nodes, links, drawWidth, drawHeight);
    } else if (layoutAlgo === 'fruchterman-reingold') {
      fruchtermanReingoldLayout(nodes, links, drawWidth, drawHeight);
    } else if (layoutAlgo === 'circle') {
      circleLayout(nodes, links, drawWidth, drawHeight);
    }

    // Save these computed positions as targets, and restore the previous positions 
    // to allow the simulation to visibly "morph" from current -> target
    nodes.forEach(n => {
      n.targetX = n.x;
      n.targetY = n.y;
      n.x = n.startX;
      n.y = n.startY;
      n.fx = null;
      n.fy = null;
    });

    // Start a fresh, targeted force simulation for this static layout
    const simulation = forceSimulation(nodes)
      .alpha(1)
      .alphaDecay(0.015) // Slightly slower decay for a nice visible settle
      .force("charge", forceManyBody().strength(-100).distanceMax(250)) // Light repulsion
      .force("collision", forceCollide().radius(containerSize / 2))
      .force("x", forceX(d => d.targetX).strength(0.15)) // Moderate pull to target
      .force("y", forceY(d => d.targetY).strength(0.15))
      .on("tick", () => {
        linkSel.attr("d", (d) => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);
        nodeSelection.attr("transform", (d) => `translate(${d.x - containerSize / 2},${d.y - containerSize / 2})`);
      });

    simulationRef.current = simulation;

    // Update drag to work with this targeted simulation
    nodeSelection.call(
      d3Drag()
        .on("start", function (event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on("drag", function (event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on("end", function (event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.layoutAlgorithm, props.graphData, props.minSize, props.actors, props.includePeaceData]); // fires when layout selection OR data changes

  function showEventCard(link) {
    setSelectedLink(link);
    setSelectedActor1(findActor(0, link));
    setSelectedActor2(findActor(1, link));
    setOpenCard(true);
  }

  function hideEventCard() {
    setOpenCard(false);
  }

  function setLinkFilter(newFilter) {
    setLinkSelection(newFilter);
  }

  function findActor(type, link) {
    let found;
    if (type === 0) {
      found = props.actors.find(
        (actor) => actor.id === link["source"].actor_id
      );
    } else {
      found = props.actors.find(
        (actor) => actor.id === link["target"].actor_id
      );
    }
    return found;
  }

  function getActor(name) {
    const found_by_name = props.actors.find(
      (actor) => actor.getName() === name
    );
    if (!found_by_name) {
      return null;
    } else {
      return found_by_name;
    }
  }

  function showActorCard(actor) {
    actor = actor.trim();
    setSelectedActor(actor);
    setOpenActorCard(true);
  }

  function hideActorCard() {
    setOpenActorCard(false);
  }

  return (
    <Box className={`location-graph-wrapper ${props.isFullscreen ? "fullscreen-mode" : ""}`} id="graph_vis" ref={wrapperRef} sx={{minHeight: { xs: "410px", md: "565px" }, paddingTop: { xs: "32px", md: "28px" }, position: "relative"}}>
      <SnapshotButton 
        targetRef={wrapperRef} 
        label="graph" 
        filename={props.countryName ? `ConflictNetwork_${props.countryName}_${new Date().toISOString().split('T')[0]}` : undefined}
        sx={{ right: props.isFullscreen ? 56 : 8 }}
      />
      {!isBelowMd && (
        <Tooltip title={props.isFullscreen ? "Exit Fullscreen" : "Fullscreen"} placement="left">
          <IconButton
            id="peor-fullscreen-button"
            onClick={() => props.setIsFullscreen(!props.isFullscreen)}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: props.isFullscreen ? 96 : 48,
              zIndex: 900,
              backgroundColor: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,1)",
              },
            }}
          >
            {props.isFullscreen ? (
              <FullscreenExitIcon fontSize="small" />
            ) : (
              <FullscreenIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      )}
      {getActor(selectedActor) ? (
        <ActorCard
          gw_number={props.gw_number}
          open={openActorCard}
          onClose={hideActorCard}
          actor={getActor(selectedActor)}
          actorName={selectedActor}
          start={props.start}
          end={props.end}
          actors={props.actors}
          fullPeriod={false}
          eventTypeColours={props.eventTypeColours}
          container={() => wrapperRef.current}
        ></ActorCard>
      ) : null}
      {
        <LinkCard
          gw_number={props.gw_number}
          actor1={selectedActor1}
          actor2={selectedActor2}
          actors={props.actors}
          open={openCard}
          onClose={hideEventCard}
          start={props.start}
          end={props.end}
          fullPeriod={false}
          eventTypeColours={props.eventTypeColours}
          link={selectedLink}
          linkTypeColours={props.linkTypeColours}
          container={() => wrapperRef.current}
        ></LinkCard>
      }
      <svg className="location-graph-view" ref={svgRef}></svg>

      <GraphLegend
        linkTypeColours={props.linkTypeColours}
        setLinkFilter={setLinkFilter}
      ></GraphLegend>

      <Typography
        fontSize="0.8rem"
        sx={{ p: 1, color: "primary.contrastText", top: { xs: '5px', md: '0'}}}
        className="graph-num-events"
      >
        {
          props.graphData.nodes.filter(
            (node) => node["appearance"] >= props.nodeThreshold
          ).length
        }{" "}
        nodes
      </Typography>  
      {!isBelowMd  &&<InterCodeMapping/>}
    </Box>
  );
}


