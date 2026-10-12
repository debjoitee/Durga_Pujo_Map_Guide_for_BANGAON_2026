# Bangaon Durga Puja 2026

A mobile-first, bilingual (English/Bengali) React website for finding Durga Puja pandals in Bangaon, West Bengal. It includes client-side search, an interactive map, optional live location, nearest-first sorting by straight-line distance, Google Maps directions, and sharing.

## Run locally in VS Code

1. Extract `bangaon-durga-puja-2026.zip` to a folder.
2. Install **Node.js 20 or newer** if it is not already installed: https://nodejs.org/
3. Open the extracted `bangaon-durga-puja-2026` folder in VS Code.
4. Open **Terminal → New Terminal**.
5. Run:

   ```bash
   npm install
   npm run dev
   ```

6. Open the local URL Vite prints, normally `http://localhost:5173`.
7. Tap **Use my location** to allow the browser to show your position on the map. The site will update the blue location marker while live location is enabled. Tap **Stop live location** to stop tracking and clear the location from the page.

The first `npm install` needs internet access to download project dependencies. The uploaded project is source code, not a prebuilt deployment bundle.

## Main features

- English/Bengali UI toggle. The page title becomes **বনগাঁ দুর্গাপুজো ২০২৬** in Bengali mode.
- Search by supplied pandal name, address/locality, jurisdiction, or record number.
- List/map view toggle, marker selection, and destination cards.
- Optional browser geolocation using `watchPosition`; permission is requested only when the visitor taps the location button.
- A live blue location marker and accuracy radius on the map; nearest pandals sorted by approximate straight-line distance.
- Directions opened through standard Google Maps URLs; no Google Maps API key is required for those links.
- Share via the device share sheet, or copy the directions URL where supported.
- Responsive banner images, mobile-friendly controls, map fallback, empty search state, and reduced-motion support.

## Data notes and limitations

- Canonical client-side data: `src/data/pandals.json` (227 records).
- This file was normalized from the uploaded `Durga_puja_locations(2).json`. The original pandal names and addresses are preserved as supplied.
- All 227 records in the supplied JSON had numerically valid latitude/longitude values when this project was prepared, and no exact duplicate coordinate pairs were found in that file.
- **Coordinate presence is not verification.** The supplied data notes say the coordinates have not been independently confirmed and do not guarantee that every pin is at the pandal entrance or that the list is complete/current. The site displays this warning.
- The dataset primarily supplies names and addresses in Latin script. The UI changes language, but names/addresses are intentionally not auto-translated or transliterated because no verified Bengali name fields were supplied.
- Confirm dataset reuse rights and test representative destination pins before public release.
- The interactive map uses OpenStreetMap tiles and displays contributor attribution. Follow the provider's tile usage policy, especially for public or high-traffic deployment.

## Footer and emergency information

- The bilingual footer credits **Debjoitee Biswas** as the website creator.
- The footer includes clickable phone links for 112, 1098, 1930, 100, 9147888230, and 7319224450, plus the National Cyber Crime Reporting Portal.
- The uploaded Bongaon Police District Puja Parikrama PDF (page 5) lists the local numbers 9147888230 (Bongaon Police District Control Room) and 7319224450 (Mahila Sahayata Number). These local numbers were not independently confirmed and should be verified with Bongaon Police District before the website is shared publicly.
- Official government pages support the 112 emergency response number, Child Helpline 1098, and Cyber Crime Helpline 1930. For immediate emergencies, the footer recommends 112.
- The footer explicitly says this is an independent community guide, not an official police or government website.

## Location privacy

The website does not send precise location to an application backend. Geolocation is used in the browser to display the user's current position and sort pandals locally. It is requested only after explicit user action, runs until stopped or the page closes, and is cleared from the page when stopped. Browsers generally require HTTPS for geolocation in production; `localhost` is treated as a secure context for local development.

## Deploy

- **Vercel:** Import the project folder/repository; framework preset **Vite**, build command `npm run build`, output directory `dist`.
- **Netlify:** Build command `npm run build`, publish directory `dist`.

After deployment, verify that location permission works on the HTTPS domain and test several Google Maps links on a real phone.

## Project structure

```text
bangaon-durga-puja-2026/
├── public/
│   └── images/                 # Responsive WebP banner variants
├── src/
│   ├── components/
│   │   ├── MapErrorBoundary.jsx
│   │   └── PandalMap.jsx
│   ├── data/
│   │   └── pandals.json        # Canonical dataset used by search and map
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.js
├── DATA_NOTES.md
└── TEST_REPORT.md
```
