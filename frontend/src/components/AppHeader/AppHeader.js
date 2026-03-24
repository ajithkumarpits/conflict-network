import "./AppHeader.scss";
import styles from "../../styles/global.scss";

import React, { lazy, Suspense ,useState} from "react";
// MUI components
import Navigation from "./Navigation/Navigation";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
const Drawer = lazy(() => import("@mui/material/Drawer"));

const menuItems = [
  { label: "Conflict Networks", path: "/conflict-networks" }
];

 
export default function AppHeader() {
 
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
 
  const toggleDrawer = (state) => {
    document.activeElement?.blur(); 
    const isOpen = typeof state === 'boolean' ? state : !open;
    setOpen(isOpen);
    if (isOpen) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
    document.body.classList.remove('drawer-open');
  };
 
  return (
    <Box className="app-header" sx={{ backgroundColor: styles.extraDarkBlue, position: {xs: "fixed"}, top: {xs: "0"}}}>
      <Navigation toggleDrawer={toggleDrawer} open={open}/> 
      <Suspense fallback={null}>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => toggleDrawer(false)}
        className="toggle-nav-mob"
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            height: "100%",
            justifyContent: 'center'
          },
        }}
      >
        <Box className="toggle-nav-block">   
          <List className="toggle-nav-items" 
            sx={{              
              display: 'flex',
              flexDirection: "column",
              gap: '19pt',
              justifySelf: 'center',
              margin: '0 auto'
            }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{              
                  py: '0'           
                }}
              >
                <ListItemText primary={item.label} className="toggle-nav-item" />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      </Suspense>
    </Box>
  );
}
