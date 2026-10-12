# Test report — Bangaon Durga Puja 2026

## Checks completed during project assembly

- [x] Read the supplied master prompt and data notes.
- [x] Normalize 227 records from the provided JSON into one canonical dataset.
- [x] Validate latitude/longitude types and numeric bounds for every record.
- [x] Check for missing names and repeated exact coordinate pairs.
- [x] Use the same canonical records for result cards, map markers, distance sorting, and directions URLs.
- [x] Include graceful UI states for no search matches, denied/unavailable/timed-out location, unsupported geolocation, and map-loading errors.
- [x] Include English/Bengali UI labels and a mobile-responsive layout.
- [x] Include an explicit stop action that clears the location from the page and stops the geolocation watch.

## Not verified in this environment

The environment could not reach the npm registry while this project was assembled. Therefore dependencies could not be installed here, and a Vite production build, live browser test, Lighthouse test, and real-device geolocation test were **not run**. Run `npm install` and `npm run build` on a machine with internet access before deployment.

## Recommended final acceptance tests

- [ ] `npm install` completes and `npm run build` succeeds.
- [ ] Search for `Iron Gate Sporting Club`, `Shimultal`, and a non-existent term.
- [ ] Switch English → Bengali → English and inspect all UI strings on desktop/mobile.
- [ ] Grant, deny, and time out browser location access.
- [ ] Verify the blue location marker updates while live location is on, then disappears after stopping.
- [ ] Confirm nearest-first distance is labelled straight-line distance.
- [ ] Click several directions actions and confirm the exact source coordinates are used.
- [ ] Use browser share or clipboard fallback.
- [ ] Test narrow Android viewport, keyboard focus, zoom, and reduced-motion preferences.
- [ ] Verify representative destination pins and dataset reuse rights before publishing.

## Footer and help-line changes

- Added a prominent footer credit for Debjoitee Biswas in both language modes.
- Added responsive, click-to-call cards for 112, 1098, 1930, 100, 9147888230, and 7319224450.
- Added links to 112.gov.in, the official Child Helpline information page, and cybercrime.gov.in.
- Added disclosure that local numbers were taken from page 5 of the user-provided PDF and need verification before public release.
- Added a notice clarifying the website is an independent community guide, not an official police/government website.
- Responsive CSS includes a 3-column desktop, 2-column mobile, and 1-column narrow-phone help-line grid.

Build validation has not been run in this environment because project dependencies are not installed here. Run `npm install` and `npm run build` locally in VS Code before deployment.
