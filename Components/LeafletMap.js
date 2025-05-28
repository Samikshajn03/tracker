'use client';
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import NavBar from './NavBar';
import '../styles/map.scss';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

export default function LeafletMap() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [savedMarkers, setSavedMarkers] = useState([]);
  const [pendingMarker, setPendingMarker] = useState(null); // {latitude, longitude}
  const [label, setLabel] = useState('');
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchMarkers();
  }, []);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [pendingMarker]);

  const fetchMarkers = async () => {
  const user_id = sessionStorage.getItem('id');
  if (!user_id) {
    console.error('User ID not found in sessionStorage.');
    return;
  }

  try {
    const res = await fetch('/api/markers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id })
    });
    const data = await res.json();

    if (res.ok) {
      setSavedMarkers(data);
    } else {
      console.error('Error fetching markers:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Failed to fetch markers:', error);
  }
};


  const saveMarkerToDB = async (latitude, longitude, label) => {
    const user_id = sessionStorage.getItem('id');
    if (!user_id) {
      alert('User ID not found in session. Please log in.');
      return false;
    }

    try {
      await fetch('/api/markers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, label, user_id }),
      });
      fetchMarkers();
      return true;
    } catch (error) {
      console.error('Failed to save marker:', error);
      return false;
    }
  };

  const onMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setPendingMarker({ latitude: lat, longitude: lng });
    setLabel('');
  };

  const onSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchSuggestions(val), 500);
  };

  const fetchSuggestions = async (q) => {
    if (!q) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}&addressdetails=1&limit=5&accept-language=en`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to fetch search suggestions', error);
    }
  };

  const onSearchSelect = (place) => {
    const latitude = parseFloat(place.lat);
    const longitude = parseFloat(place.lon);
    setPendingMarker({ latitude, longitude });
    setLabel('');
    setQuery('');
    setSearchResults([]);

    if (mapRef.current) mapRef.current.setView([latitude, longitude], 13);
  };

  const onSaveLabel = async () => {
    if (!label.trim()) {
      alert('Please enter a label');
      return;
    }
    if (!pendingMarker) return;

    const { latitude, longitude } = pendingMarker;
    const success = await saveMarkerToDB(latitude, longitude, label.trim());
    if (success) {
      setPendingMarker(null);
      setLabel('');
    }
  };

  const onCancelLabel = () => {
    setPendingMarker(null);
    setLabel('');
  };

  const onMapCreated = (mapInstance) => {
    mapRef.current = mapInstance;
    mapInstance.on('click', onMapClick);
  };

  return (
    <div className='map-container'>
      <NavBar />
      <div className='maps-portion'>
      <h2>Mark your footsteps </h2>
        <div>
          
          <input
            type='text'
            placeholder='Search places...'
            value={query}
            onChange={onSearchChange}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
          {searchResults.length > 0 && (
            <ul className='search-options'>
              {searchResults.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => onSearchSelect(place)}
                  style={{ width: '80%', padding: '6px 10px', cursor: 'pointer' }}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={4}
          style={{ height: '700px', width: '100%' }}
          whenCreated={onMapCreated}
          className='map'
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          {pendingMarker && (
            <Marker
              position={[pendingMarker.latitude, pendingMarker.longitude]}
              ref={markerRef}
            >
              <Popup className='dialog-box' autoPan={true}>
                <div>
                  <label>
                    Label: <br />
                    <input
                      name='label-input'
                      type='text'
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      style={{ width: '100%', marginBottom: '8px' }}
                      autoFocus
                    />
                  </label>
                  <button
                    onClick={() => {
                      if (!label.trim()) {
                        alert('Please enter a label');
                        return;
                      }
                      onSaveLabel();
                    }}
                    style={{ marginRight: '8px' }}
                  >
                    Save
                  </button>
                  <button onClick={onCancelLabel}>Cancel</button>
                </div>
              </Popup>
            </Marker>
          )}

          {savedMarkers.map((marker, idx) => (
            <Marker key={idx} position={[marker.latitude, marker.longitude]}>
              <Popup>
                <strong>{marker.label || 'Saved location'}</strong>
                <br />
                Added on: {new Date(marker.created_at).toLocaleString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
