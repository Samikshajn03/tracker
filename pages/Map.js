import { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import NavBar from '../Components/NavBar';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const MapPage = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const onLoad = () => {
    setMapLoaded(true);
  };

  const onUnmount = () => {
    setMapLoaded(false);
  };

  const markers = [
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { lat: 40.7128, lng: -74.0060 },  // New York
  ];

  return (
    <div className="map-page">
      <NavBar/>
      <h1>Google Map Page</h1>

      <LoadScript googleMapsApiKey="AIzaSyAP6kxG8JSDCOM7dcEidilN8UM4mtb0ePk">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={4} // Zoomed out to show all markers
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Render multiple markers */}
          {markers.map((position, index) => (
            <Marker key={index} position={position} />
          ))}
        </GoogleMap>
      </LoadScript>

      {!mapLoaded && <p>Loading Map...</p>}
    </div>
  );
};

export default MapPage;
