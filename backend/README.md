# Conflict Networks Library

A standalone Python library for visualizing conflict networks using FastAPI and Pandas.

## Project Structure
```
conflict_network_lib/
├── api/             # FastAPI routers
├── config/          # Data specifications
├── data/            # Sample dataset (Pakistan GW 770)
├── models/          # Actor and ActorPool models
├── utils/           # Core logic functions
├── main.py          # Application entry point
└── requirements.txt  # Dependencies
```

## Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Library as a Separate Service
To run the Conflict Networks library independently of the original system:

1. **Activate the environment**:
   ```bash
   source venv/bin/activate
   ```

2. **Ensure Redis is running**:
   The library requires a local Redis instance for caching graph computations.
   ```bash
   redis-cli ping
   # Expected output: PONG
   ```

3. **Start the API server**:
   Make sure you are in the directory containing `conflict_network_lib` and run:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

The standalone API will be available at `http://localhost:8000`.

## Testing standalone routes (examples)
- **Get Event Graph**: `http://localhost:8000/get-event-graph?start=2023-01-01&end=2023-12-31&gw_number=770`
- **Get Map Overlay**: `http://localhost:8000/get-map-overlay?gw_number=770`

## Data
The library includes a sample dataset for Pakistan (`ged_770.csv`). To add more countries, place their UCDP GED CSV files in the `data/by_country/` directory named as `ged_<GW_NUMBER>.csv` alongside their actor definitions in `data/actors/`.
