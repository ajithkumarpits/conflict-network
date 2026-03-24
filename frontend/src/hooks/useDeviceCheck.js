import { isMobile, isTablet, isDesktop } from 'mobile-device-detect';
 
const useDeviceCheck = () => {
  return {
    isMobile: isMobile && !isTablet,
    isTablet,
    isDesktop,
  };
};
 
export default useDeviceCheck;