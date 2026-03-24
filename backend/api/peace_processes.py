import os
import logging
import json
from fastapi import APIRouter, status
from config.specifications import (
    DATA_NOT_FOUND,
    INTERNAL_SERVER_ERROR_MSG,
    FATALITIES_FILE,
    NEGOTIATIONS_FILE
)
from utils.responses import success_response, error_response

router = APIRouter()
logger = logging.getLogger("conflict_network")
LIB_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(LIB_DIR, "data")

@router.get("/get-events-fatalities")
async def get_events_fatalities():
    """
    Get the number of events and fatalities for each country, indexed by its Gleditsch-Ward number.

    Args:
        None

    Returns:
        dict: {gw-number: {'events': int, 'fatalities': int, 'events_bin': int, 'fatalities_bin': int}}
    """
    try:
        with open(file=DATA_DIR+'/'+FATALITIES_FILE) as data_file:
            data = json.load(data_file)
            return success_response(
                data=data,
                message="Successfully retrieved event and fatality counts by country.",
                status_code=status.HTTP_200_OK,
            )
    except Exception as e:
        logger.error(f"Error Results:{e}")
        return error_response(
            message=INTERNAL_SERVER_ERROR_MSG,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
@router.get("/get-negotiations-agreements")
async def get_negotiations_agreements():
    """
    Get the number of negotiations and agreements for each country, indexed by its Gleditsch-Ward number.

    Args:
        None

    Returns:
        dict: {gw-number: {'negotiations': int, 'agreements': int, 'negotiations_bin': int, 'agreements_bin': int}}
    """
    try:
        with open(file=DATA_DIR+'/'+NEGOTIATIONS_FILE) as data_file:
            data = json.load(data_file)
            return success_response(
                data=data,
                message="Successfully retrieved negotiations_agreements.",
                status_code=status.HTTP_200_OK,
            )
    except Exception as e:
        logger.error(f"Error Results:{e}")
        return error_response(
            message=INTERNAL_SERVER_ERROR_MSG,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

# --- Internal Helpers ---
from config.specifications import FULL_PEACE_DATA

def get_full_peace_data():
    """
    Get and return the complete data for 'African Peace Processes'.
    """
    try:
        import pandas as pd
        peace_data = pd.read_excel(os.path.join(DATA_DIR, 'peace_observatory.xlsx')).fillna(0)
        return peace_data
    except Exception as e:
        logger.error(f"Error loading full peace data: {e}")
        return None

def get_filtered_gw(gw_number, df):
    """
    Get and return the subset of data for 'African Peace Processes' whose conflict location is assigned to given GW number.
    """
    try:
        import pandas as pd
        GW_COLUMN = 'gwno_loc_conflict' # from global_variables.py
        df_copy = df.copy()
        df_copy["found"] = df_copy[GW_COLUMN].apply(
            lambda entry_gwno: (str(gw_number) in str(entry_gwno).split(", "))
        )
        return df.loc[df_copy["found"] == True]
    except Exception as e:
        logger.error(f"Error filtering peace data: {e}")
        return None