import './AppDisplay.scss';
import {lazy ,Suspense } from "react";
import { Routes, Route } from "react-router-dom";
// components
import Box from "@mui/material/Box";
import Page from '../SkeletonUI/Page'
import Error from '../Error/Error'
import NotFound from '../NotFound/NotFound'
// Lazy load components
const ConflictView = lazy(() => import("../ConflictView/ConflictView"));

export default function AppDisplay() {

  return (
    <Box className="app-display" sx={{ minHeight: {xs:'calc(100vh - 57px)', md: 'calc(100vh - 76px)'} }}>
      <div className='display-wrapper'>
      <Suspense fallback={<Page/>}>
        <Routes>
            <Route path="/" element={ <ConflictView/>}/>
            <Route path="/conflict-networks" element={<ConflictView/>}/>
            <Route path="/error" element={<Error/>}/>
            <Route path="*" element={<NotFound/>} />
        </Routes>
        </Suspense>
      </div>
    </Box>
  );
}

