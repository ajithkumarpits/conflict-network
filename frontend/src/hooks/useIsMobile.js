import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
 
const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
};
 
export default useIsMobile;
