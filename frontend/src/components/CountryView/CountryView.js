
import './CountryView.scss';
import styles from '../../styles/global.scss';
import  React ,{Suspense} from "react";
// MUI components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
//Constants & Data
import { ENDPOINTS } from "../../constants/apiEndpoints";
//Hook functions
import useGet from '../../hooks/useGetAxios';
// Components
import NumberDisplay from '../NumberDisplay/NumberDisplay';
import BackButton from '../BackButton/BackButton';
const DyadCategory = React.lazy(() => import("../DyadCategory/DyadCategory"));
const DyadTimeline = React.lazy(() => import("../DyadTimeline/DyadTimeline"));

export default function CountryView(props) {

    const selectedCountryId = props.selectedCountry?.id;

    const { data: countryStats = {}} = useGet(
        selectedCountryId? ENDPOINTS.GET_COUNTRY_STATISTICS: null,
        { gw_number: selectedCountryId }
      );

    function resetSearch(){
        props.setSelectedCountry(null)
    }

    return (
        <Box className="country-view" sx={{padding: {xs:'0px 12px 0 12px', md:'0px 18px 0 18px'}, marginTop: {xs:'132px', md:'147px'}}}>
            <Box className='country-header' sx={{padding: {xs:'20px 12px 10px 12px', md:'20px 18px 25px 18px'},top: {xs:'58px'},minHeight: {xs:'40px', md:'50px'}, }}>
                <BackButton 
                className='button-wrapper' 
                searchParamName={props.searchParamName}
                resetSearch={resetSearch}
                buttonText={'Country view'}></BackButton>

                <div className="right"></div>
            </Box>

            <Box className='country-content' sx={{gap: {xs:'25px', md:'40px'}, flexDirection: {xs:'column', md:'row'}, display: {xs:'inline-block', md:'flex'}, overflowY: {xs:'auto', md:'visible'}}}>
                   <Typography
                    className='title'
                    color={styles.textMedium}
                    sx={{paddingBottom: {xs:'20px'}, fontSize: {xs:'25px'}, fontWeight: "600", backgroundColor: styles.textLight, display:{xs:'block', md:'none'}, position: "sticky", top: "0", textAlign: "center"}}
                    >
                    {props.selectedCountry?.name}
                    </Typography>
                <Box className='numbers-display' sx={{height: {xs:'min-content', md:'100%'}}}>
                    <Typography
                    className='title'
                    color={styles.textMedium}
                    sx={{paddingBottom: {md:'40px'}, fontSize: { md:'30px'}, fontWeight: "600", display:{xs:'none', md:'block'}}}
                    >{props.selectedCountry['name']}</Typography>
                    <Box className='total-numbers' sx={{padding: {xs:'15px 15px', md:'20px 20px'}, gap: {xs:'20px', md:'40px'}, justifyContent: {xs:'space-between', md:'flex-start'}, backgroundColor: "#FAFAFA"}}>
                        <NumberDisplay
                        amount={countryStats?.sumNegotiations}
                        subheader={'rounds of'}
                        name={'negotiations'}
                        />
                        <NumberDisplay
                        amount={countryStats?.sumAgreements}
                        subheader={'number of'}
                        name={'agreements'}
                        />
                        <NumberDisplay
                        amount={countryStats?.sumFatalities}
                        subheader={'recorded'}
                        name={'fatalities'}
                        />
                    </Box>
                    <Box className='timeline-numbers' sx={{marginBottom: {xs:'0px', md:'100px'}}}>
                       <Suspense >
                        <DyadTimeline
                        countryStats={countryStats||0}
                        gw_number={props.selectedCountry?.id}
                        ></DyadTimeline>
                        </Suspense>
                    </Box>
                </Box>

                <div className='dyad-list'>
                    <Typography
                            className='title'
                            color={styles.textMedium}                            
                            sx={{paddingBottom: {xs:'20px', md:'40px'}, fontSize: {xs:'20px', md:'24px', fontWeight: "600"}}}
                            >Dyads</Typography>
                    <div className='dyad-list-wrapper'>
                    {props.dyads?.length > 0 && <DyadCategory data={props.dyads} selectDyad={props.selectDyad} />}  
                    </div>
                </div>
            </Box>
        </Box>
    );
}
