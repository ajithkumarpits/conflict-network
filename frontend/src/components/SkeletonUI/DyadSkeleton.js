import React from "react";
import styles from '../../styles/global.scss';
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function DyadSkeleton() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        p: 1,
        boxShadow: 3,
      }}
    >
      <Box>
        <Skeleton width={320} style={{ marginBottom: 3, maxWidth: "100%" }} />
        <Skeleton width={350} style={{ marginBottom: 3, maxWidth: "100%" }} />
        <Skeleton width={550} style={{ marginBottom: 3, maxWidth: "100%" }} />
      </Box>

      <Box
        sx={{
          width: "100%",
          backgroundColor: styles.textLight,
          mt: 2,
        }}
      >
        <Skeleton variant="rectangular" height={40} sx={{ marginBottom: 2 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[...Array(12)].map((_, index) => (
            <Box
              key={index}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Skeleton variant="rectangular" width={50} height={20} />{" "}
              <Skeleton variant="rectangular" width={80} height={20} />{" "}
              <Skeleton variant="rectangular" width={80} height={20} />{" "}
              <Skeleton variant="rectangular" width={150} height={20} />{" "}
              <Skeleton variant="rectangular" width={100} height={20} />{" "}
              <Skeleton variant="rectangular" width={110} height={20} />{" "}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
