import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import interCodeMapping from "../../utils/interCodeMapping";
import TypeIcon from "../../components/TypeIcon/TypeIcon";
 
const InteractionLegend= () => {
 
      return (
        <Box className="actor-interaction-legend" sx={{ position:{xs: "inherit", md: "absolute"}, bottom:{xs: "0", md: "10px"}, right:{xs: "0", md: "10px"}, margin:{xs: "20px 12px 10px 12px", md: "0px"}, maxWidth:{xs: "100%", md: "310px"}, justifyContent:{xs: "space-between", md: "flex-end"}}}>
          {/* First Group (1 & 2) */}
          <div className="interaction-legend-group">
            {[1, 3].map((numCode) => (
              <div className="interaction-legend-item" key={`filter-type-${numCode}`}>
                <TypeIcon type={numCode} dim={14} />
                <Typography sx={{ marginX: "4px", textAlign: "center", marginY: "1px" }} fontSize="0.6rem">
                  {interCodeMapping[numCode]}
                </Typography>
              </div>
            ))}
          </div>
    
          {/* Second Group (3 & 4) */}
          <div className="interaction-legend-group">
            {[2, 4].map((numCode) => (
              <div className="interaction-legend-item" key={`filter-type-${numCode}`}>
                <TypeIcon type={numCode} dim={14} />
                <Typography sx={{ marginX: "4px", textAlign: "center", marginY: "1px" }} fontSize="0.6rem">
                  {interCodeMapping[numCode]}
                </Typography>
              </div>
            ))}
          </div>
        </Box>
      );
    };
    
export default InteractionLegend;