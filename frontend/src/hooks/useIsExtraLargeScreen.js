import useMediaQuery from "@mui/material/useMediaQuery";

const useIsExtraLargeScreen = () => {
  return useMediaQuery(`(min-width:1400px)`);
};

export default useIsExtraLargeScreen;
