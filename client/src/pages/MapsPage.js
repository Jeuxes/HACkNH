import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import SearchBar from "../components/map/SearchBar";
import * as styles_ from "../styles";
import { api } from '../services/apiController';

const MapsPage = ({ userId }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [radius, setRadius] = useState(91.44); // 300 feet in meters
  const [isFilterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [locationsInRadius, setLocationsInRadius] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 43.1340, lng: -70.9264 });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Request user's geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCoordinates(coords);
        setLocationError(null); // Clear any previous error
        fetchNearbyLocations(coords);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to access your location. Please allow location access or try again.');
      }
    );
  }, []);

  const fetchNearbyLocations = (coords) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );
    const request = {
      location: coords,
      radius: radius,
      type: ['restaurant', 'store', 'point_of_interest'], // Example types; adjust as needed
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setLocationsInRadius(results);
        setModalVisible(true); // Show modal when locations are fetched
      } else {
        console.error("Places API request failed:", status);
      }
    });
  };

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setModalVisible(false); // Close modal after selection

    if (!userId) {
      console.error("User ID is required to set the venue.");
      return;
    }

    try {
      await api.setVenue({
        uid: userId,
        venueName: location.name,
        lat: location.geometry.location.lat(),
        lon: location.geometry.location.lng(),
      });
      console.log(`Venue set to ${location.name}`);
    } catch (error) {
      console.error('Failed to set venue:', error);
    }
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item)}
    >
      <Text style={styles.locationText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <div style={{ width: '90vw', height: '90vh' }}>
      <SearchBar 
        isFilterDrawerVisible={isFilterDrawerVisible} 
        setFilterDrawerVisible={setFilterDrawerVisible} 
      />

      {locationError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
          <TouchableOpacity onPress={() => window.location.reload()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={['places']} // Add 'places' library for Places API
            loadingElement={<p>Loading map...</p>}
            onError={(e) => console.error('Error loading Google Maps:', e)}
          >
            <GoogleMap
              mapContainerStyle={{ marginLeft: "10%", marginTop: "5%", width: '100%', height: '100%' }}
              center={coordinates}
              zoom={18}
              options={{
                minZoom: 18,
                maxZoom: 20,
                fullscreenControl: false,
                disableDefaultUI: true,
              }}
            >
              {selectedLocation && (
                <Marker
                  position={{
                    lat: selectedLocation.geometry.location.lat(),
                    lng: selectedLocation.geometry.location.lng(),
                  }}
                  title={selectedLocation.name}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </View>
      )}

      {modalVisible && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.modalTitle}>Are you currently at one of these nearby locations?</Text>
            <FlatList
              data={locationsInRadius}
              keyExtractor={(item) => item.place_id}
              renderItem={renderLocationItem}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </div>
  );
};

export default MapsPage;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  overlayContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  locationItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
