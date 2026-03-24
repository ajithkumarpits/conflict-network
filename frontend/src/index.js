import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './styles/global.scss';
import { BrowserRouter as Router } from "react-router-dom";
import "inter-ui/inter.css";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';



const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: styles.darkPrimary,
    },
    secondary: {
      main: styles.lightPrimary,
    },
    neutral: {
      main: styles.lightSecondary,
    },
    border:{
      main: "#B9C2CA",
    },
    text: {
      lightGrey: "#667785",
      darkBlue: "#102A42",   
      white: "#FFFFFF",     
      coolGrey  :'#B9C2CA'   
    }
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
   
  components: {
      MuiCssBaseline: { /// If we need add new font we need to update in index.html inside publicfolder
        styleOverrides: `
          @font-face {
            font-family: 'Inter';
            src: url('/fonts/Inter-Regular.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
          }
          @font-face {
            font-family: 'Inter';
            src: url('/fonts/Inter-Bold.woff2') format('woff2');
            font-weight: 700;
            font-style: normal;
          }
          @font-face {
            font-family: 'Inter';
            src: url('/fonts/Inter-SemiBold.woff2') format('woff2');
            font-weight: 600;
            font-style: normal;
          }
          * {
            font-family: "Inter", sans-serif !important;
          }
        `,
      },
  
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  },
});
 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme={false} />
      <Router  future={{ v7_startTransition: true  , v7_relativeSplatPath: true,}}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Router>
      <ToastContainer position="bottom-center" autoClose={2000} />
    </ThemeProvider>

);
