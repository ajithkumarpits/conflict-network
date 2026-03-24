
import  Button  from "@mui/material/Button";
import  Container  from "@mui/material/Container";
import  Typography  from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Container  maxWidth="xl"
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center", 
        bgcolor: "#fff",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" color="error" gutterBottom  sx={{ fontSize: { xs: 18, md: 30 } }}>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" gutterBottom>
        We encountered an unexpected error. Please try again later.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")} sx={{m:2}}>
        Go to Home
      </Button>
    </Container>
  );
};

export default ErrorPage;
