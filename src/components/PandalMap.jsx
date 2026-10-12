import { useEffect, useMemo } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const BANGAON_CENTER = [23.045, 88.832];

const pandalIcon = L.divIcon({
  className: 'pandal-marker-shell',
  html: '<span class="pandal-marker"><span></span></span>',
  iconSize: [28, 34],
  iconAnchor: [14, 30],
  popupAnchor: [0, -28],
});

const liveLocationIcon = L.divIcon({
  className: 'live-location-shell',
  html: '<span class="live-location-pulse"><span></span></span>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function MapController({ currentPosition, selectedPandal }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPandal?.latitude != null && selectedPandal?.longitude != null) {
      map.flyTo([selectedPandal.latitude, selectedPandal.longitude], Math.max(map.getZoom(), 16), { duration: 0.55 });
      return;
    }
    if (currentPosition) {
      map.flyTo([currentPosition.latitude, currentPosition.longitude], Math.max(map.getZoom(), 16), { duration: 0.55 });
    }
  }, [map, currentPosition?.latitude, currentPosition?.longitude, selectedPandal?.id]);

  return null;
}

export default function PandalMap({ pandals, selectedId, onSelect, currentPosition, language, t }) {
  const validPandals = useMemo(
    () => pandals.filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude)),
    [pandals],
  );

  return (
    <MapContainer
      center={BANGAON_CENTER}
      zoom={14}
      minZoom={11}
      maxZoom={19}
      scrollWheelZoom
      preferCanvas
      className="leaflet-map"
      aria-label={language === 'bn' ? 'বনগাঁর দুর্গাপুজোর প্যান্ডেলের মানচিত্র' : 'Map of Durga Puja pandals in Bangaon'}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MapController currentPosition={currentPosition} selectedPandal={validPandals.find((p) => p.id === selectedId)} />

      {validPandals.map((pandal) => (
        <Marker
          key={pandal.id}
          position={[pandal.latitude, pandal.longitude]}
          icon={pandalIcon}
          eventHandlers={{ click: () => onSelect(pandal.id) }}
          zIndexOffset={pandal.id === selectedId ? 1000 : 0}
        >
          <Popup>
            <div className="map-popup">
              <strong>{pandal.name || t.unnamedPandal}</strong>
              {pandal.address && <span>{pandal.address}</span>}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                {t.getDirections} ↗
              </a>
            </div>
          </Popup>
        </Marker>
      ))}

      {currentPosition && (
        <>
          {Number.isFinite(currentPosition.accuracy) && (
            <Circle
              center={[currentPosition.latitude, currentPosition.longitude]}
              radius={currentPosition.accuracy}
              pathOptions={{ color: '#2583f4', fillColor: '#2583f4', fillOpacity: 0.09, weight: 1.5 }}
            />
          )}
          <Marker
            position={[currentPosition.latitude, currentPosition.longitude]}
            icon={liveLocationIcon}
            zIndexOffset={2000}
            keyboard
            title={t.yourLiveLocation}
          >
            <Popup>{t.yourLiveLocation}</Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
}
