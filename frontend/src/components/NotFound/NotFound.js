
import  Button  from "@mui/material/Button";
import  Container  from "@mui/material/Container";
import  Typography  from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "#fff",
      }}
    >
      <Typography variant="h4" color="error" gutterBottom sx={{ fontSize: { xs: 20, md: 30 } }}>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")} sx={{ mt: 2 }}>
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFoundPage;



