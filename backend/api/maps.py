import os
import logging
import json
import shapely as shp
import geopandas as gpd
import pandas as pd
from fastapi import APIRouter, status
from config.specifications import (
    DATA_NOT_FOUND,
    INTERNAL_SERVER_ERROR_MSG,
    COUNTRIES_GW_FILE,
    COUNTRIES_SHIP,
    OVERLAY_DIR
)
from pathlib import Path
from utils.responses import success_response, error_response

router = APIRouter()
logger = logging.getLogger("conflict_network")
LIB_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(LIB_DIR, "data")

def compute_map_overlay(gw_number):
    """
    Provides the world shape but minus the form of the selected country.

    Args:
        gw_number (int):    Gleditsch-Ward number of selected country.

    Returns:
        geojson: The requested geojson shape.
    """
    try:
        # https://www.naturalearthdata.com/downloads/10m-cultural-vectors/
        shapes = gpd.read_file(os.path.join(DATA_DIR, COUNTRIES_SHIP))

        world = shp.geometry.Polygon(
            [[-360, -90], [-360, 90], [360, 90], [360, -90], [-360, -90]]
        )
        countries = pd.read_csv(os.path.join(DATA_DIR, COUNTRIES_GW_FILE))
        gw_number = int(gw_number)
        iso2 = countries.loc[countries["gw_number"] == gw_number]["ISO"].item()
        if countries.loc[countries["gw_number"] == gw_number]["gw_number"].item() == 565:
            iso2='NA'
        else:
            iso2 = countries.loc[countries["gw_number"] == gw_number]["ISO"].item()
        print("iso2", iso2)
        print("shapes", list(shapes["ISO_A2"]))

        country = shapes[shapes["ISO_A2"] == iso2]["geometry"].item()
        result = world.difference(country)
        outline = shp.to_geojson(result)

        # also store file for future reference
        output_file = os.path.join(DATA_DIR, OVERLAY_DIR, f"{gw_number}.json")
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, "w") as fp:
            json.dump(json.loads(outline), fp, indent=2)

        return outline
    except Exception as e:
        logger.error(f"Error Results:{e}")
        

@router.get("/get-map-overlay")
async def get_map_overlay(gw_number):
    """
    Provides the world shape but minus the form of the selected country.

    Args:
        gw_number (int):    Gleditsch-Ward number of selected country.

    Returns:
        geojson: The requested geojson shape.
    """
    try:
        filename = os.path.join(DATA_DIR, OVERLAY_DIR, f"{gw_number}.json")
        overlay_file = Path(filename)
        
        if overlay_file.exists():
            # path exists
            with open(file=filename, mode="r") as data_file:
                outline = json.load(data_file)

        else:
            # create and store the overlay file
            outline = json.loads(compute_map_overlay(gw_number))
                
        return success_response(
            data=outline,
            message="Successfully retrieved world shape without the selected country.",
            status_code=status.HTTP_200_OK,
        )
    except Exception as e:
        logger.error(f"Error Results:{e}")
        return error_response(
                message=INTERNAL_SERVER_ERROR_MSG,
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
