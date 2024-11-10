import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import { StyleSheet } from "react-native";

const GoogleMapWrapper = ({ radius, children }) => {
  const [coordinates, setCoordinates] = useState({ lat: 43.1340, lng: -70.9264 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        if (coords.lng !== coordinates.lng && coords.lat !== coordinates.lat) {
          setCoordinates({ lng: coords.lng, lat: coords.lat });
        }
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, [coordinates]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      loadingElement={<p>Loading map...</p>}
      onError={(e) => console.error('Error loading Google Maps:', e)}
    >
      <GoogleMap
        mapContainerStyle={{ marginLeft: "10%", marginTop: "5%", width: '100%', height: '100%' }}
        center={coordinates}
        zoom={20}
        options={{
          minZoom: 18,
          maxZoom: 20,
          fullscreenControl: false,
          disableDefaultUI: true,
        }}
      >
        {children}
        <Marker position={coordinates} title="User Location" />
        <Circle
          center={coordinates}
          radius={radius}
          fillColor="rgba(28, 117, 241, 0.4)"
          strokeColor="rgba(20, 59, 243, 0.8)"
        />
      </GoogleMap>
    </LoadScript>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  map_area: {
    backgroundColor: 'blue',
  },
  map_slider: {
    width: '80%',
    height: 40,
  },
});

export default GoogleMapWrapper;
