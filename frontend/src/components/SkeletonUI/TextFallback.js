
import React from 'react'
// MUI components
import  Stack from '@mui/material/Stack';
import  Skeleton from "@mui/material/Skeleton";

export default function TextFallback() {
  return (
    <Stack direction="column"> 
    <Skeleton width="220px" variant="text" height="20px" />
    <Skeleton width="170px" variant="text" height="20px" />
    </Stack>
  )
}

