import React from "react";
import styles from '../../styles/global.scss';
import  Skeleton from "@mui/material/Skeleton";
import  Box from "@mui/material/Box";



const SearchFallback = () => {
  return (
    <Box
    sx={{
      display: "flex",
      alignItems: "center",
      width:"90%",
      maxWidth:"600px",
      height: {md:64 ,xs:51},
      borderRadius: "5px",
      backgroundColor: styles.textLight, 
      paddingX: 2,
      margin:1
    }}
  >
    <Skeleton variant="circular" width={24} height={24} />
    <Skeleton
      variant="text"
      width="80%"
      height={20}
      sx={{ marginLeft: 2, borderRadius: "4px" }}
    />
   
  </Box>
  );
};

export default SearchFallback;
