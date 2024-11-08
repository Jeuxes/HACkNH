import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapsPage = () => {
  const center = { lat: 43.1340, lng: -70.9264 };
  console.log('Google Maps API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        loadingElement={<p>Loading map...</p>}
        onError={(e) => console.error('Error loading Google Maps:', e)}
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={12}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapsPage;
