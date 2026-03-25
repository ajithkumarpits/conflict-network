import * as React from "react";
import styles from '../../styles/global.scss';
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function Page() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: styles.textLight,
        p:1
      }}
    >
      <Box sx={{ flex: 1, width: "100%" }}>
        <Skeleton height="100%" width="100%"  variant="rectangular" />
      </Box>
    </Box>
  );
}
