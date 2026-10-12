# Data-quality notes

## Source used

`Durga_puja_locations(2).json` supplied with the conversation. The parsed file identifies 227 location records and includes names, addresses, jurisdiction, latitude, longitude, and source-layer metadata.

## Checks performed while preparing the web app data

- Records written to canonical `src/data/pandals.json`: **227**.
- Records with valid numeric latitude/longitude: **227**.
- Records with an empty name: **0**.
- Repeated exact coordinate pairs: **0 groups found**.
- Search and map both read the same canonical JSON file to avoid marker/card drift.
- Navigation URLs are generated from the record's latitude and longitude at runtime.

## Interpretation limits

These checks validate data shape and coordinate ranges only. They do not prove that a coordinate points to a pandal entrance, that the committee is active in 2026, that the dataset is exhaustive, or that the data can be republished under its source terms. The app therefore labels coordinates as not independently verified. No opening times, ratings, facilities, photos, road distances, or travel-time estimates have been invented.

## Before public launch

1. Confirm the source dataset can legally be republished.
2. Independently review a representative sample of pins in Google Maps or on the ground.
3. Confirm 2026 committee names, locations, and list completeness with a reliable local source.
4. Add verified Bengali name/address fields if native Bengali search and display are required.
5. Test map tiles and navigation links at expected production traffic levels.
