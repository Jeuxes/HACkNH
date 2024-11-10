import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import SearchBar from "../components/map/SearchBar";
import * as styles_ from "../styles";
import { api } from '../services/apiController';
import {Modal} from "@mui/material";
import "../styling/MapPage.css";
import {SocketContext} from "../components/providers/SocketProvider";
import {UserContext, DEFAULT_COORDS} from "../components/providers/UserProvider";
import {useNavigate} from "react-router-dom";

const MIN_ZOOM = 17;
const MAX_ZOOM = 20;

const MapsPage = () => {
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [radius, setRadius] = useState(91.44); // 300 feet in meters
  const [isFilterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [locationsInRadius, setLocationsInRadius] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDS);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingSelectLoc, setLoadingSelectLoc] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [waitingModalVisible, setWaitingModalVisible] = useState(false);
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [waitingResponseModalVisible, setWaitingResponseModalVisible] = useState(false);
  
  const navigate = useNavigate();
  
  const fetchGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCoordinates(coords);
        user.setCoordinates(coords);
        setLocationError(null); // Clear any previous error
        fetchNearbyLocations(coords);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to access your location. Please allow location access or try again.');
      }
    );
  };
  
  fetchGeolocation();
  
  useEffect(() => {
    fetchGeolocation();
    
    if (user.coordinates === DEFAULT_COORDS || loadingSelectLoc === true) {
      console.log('Initializing coords...');
      fetchGeolocation(); // Initial fetch
    }
    
    const getNearby = () => {
      fetchNearbyLocations(user.coordinates);
    }
  
    socket.on('partnerAccept', () => {
      console.log('partner Accepted!');
      user.setCanEnterChat(true);
      navigate('/chat');
    })
    
    let geoNearby;
    if (user.coordinates && locationsInRadius === null) {
      geoNearby = setInterval(getNearby,1000) ;
    }
    
    if (locationsInRadius !== null && user.selectedLocation === null) {
      setLoadingSelectLoc(false);
      console.log('displaying location select');
      setModalVisible(true); // Show modal when locations are fetched
    }
    
    if (user.awaitingMatch && user.selectedLocation !== null) {
      console.log('displaying match wait modal');
      setModalVisible(false); // location select modal
      setWaitingModalVisible(true);
    }
    
    if (user.userMatchInterest && !user.awaitingMatchResponse) {
      console.log('displaying match decision');
      setWaitingModalVisible(false);
      setMatchModalVisible(true);
    }
    
    if (user.userMatchInterest && user.awaitingMatchResponse) {
      console.log('displaying match response waiting modal');
      setMatchModalVisible(true);
      setWaitingResponseModalVisible(true);
    }
    
    // Set up timer for periodic geolocation updates
    const geolocationTimer = setInterval(fetchGeolocation, 10000); // Update every 60 seconds
    // const geolocationTimer = setInterval(fetchGeolocation, 1000); // Update every 10 seconds
    
    return () => {
      clearInterval(geoNearby);
      clearInterval(geolocationTimer); // Clear timer on unmount
      
    }
  }, [user, fetchGeolocation, locationsInRadius, user.awaitingMatchResponse, user.userMatchInterest,
    loadingSelectLoc, modalVisible, waitingModalVisible, matchModalVisible, waitingResponseModalVisible,
    user.canEnterChat, navigate
  ]);
  
  const fetchNearbyLocations = (coords) => {
    if (typeof window.google !== 'undefined' && window.google.maps) {
      if (window.google.maps.places) {
        console.log('fetching...');
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
            console.log('setting...');
            console.log(results);
            setLocationsInRadius(results);
            setLoadingSelectLoc(false);
            setModalVisible(true);
          } else {
            console.error("Places API request failed:", status);
          }
        });
      }
    }
  };
  
  const handleLocationSelect = async (location) => {
    console.log('handling location select');
    setModalVisible(false); // Close modal after selection
    
    if (!user.userId) {
      console.error("User ID is required to set the venue.");
      return;
    }
    
    try {
      await api.setVenue({
        uid: user.userId,
        venueName: location.name,
        lat: location.geometry.location.lat(),
        lon: location.geometry.location.lng(),
      });
      user.setAwaitingMatch(true);
      user.setSelectedLocation(location);
      socket.emit('startFind', user.userId);
      console.log(`Venue set to ${location.name}`);
    } catch (error) {
      console.error('Failed to set venue:', error);
    }
  };
  
  const handleMatchConfirm = (accept) => { // uses a bool to determine what to do
    socket.emit('matchResponse', user.userId, accept);
    setMatchModalVisible(false);
    user.setAwaitingMatch(false);
    user.setAwaitingMatchResponse(true);
  }
  
  const renderInterestItem = ({ item }) => (
    <TouchableOpacity
      style={styles.interestItem}
      disabled={true}
    >
      <Text style={styles.locationText}>{item}</Text>
    </TouchableOpacity>
  )
  
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
  
      {loadingSelectLoc === true && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.modalTitle}>Retrieving Locations...</Text>
            <span className={"loader"}></span>
          </View>
        </View>
      )}
      
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
              center={user.coordinates}
              zoom={MIN_ZOOM}
              options={{
                minZoom: MIN_ZOOM,
                maxZoom: MAX_ZOOM,
                fullscreenControl: false,
                disableDefaultUI: true,
              }}
            >
              {user.selectedLocation && (
                <Marker
                  position={{
                    lat: user.selectedLocation.geometry.location.lat(),
                    lng: user.selectedLocation.geometry.location.lng(),
                  }}
                  title={user.selectedLocation.name}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </View>
      )}
  
      {modalVisible && user.userMatchInterest === null && (
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
      
      {waitingModalVisible && ( // User is waiting, and no match
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.modalTitle}>Finding match</Text>
            <span className={"loader"}></span>
          </View>
        </View>
      )}
  
      {matchModalVisible && !waitingResponseModalVisible && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.modalTitle}>Found Match!</Text>
            <Text>Here are their interests:</Text>
            <FlatList
              id={"interest-list"}
              style={{width: "80%", flexDirection: "column"}}
              data={user.userMatchInterest}
              keyExtractor={(item) => item.key}
              renderItem={renderInterestItem}
            />
            <Text style={styles.modalTitle}>Match with this person?</Text>
            <View style={{flexDirection: "row", columnGap: "30px"}}>
              <TouchableOpacity style={styles.closeButton} onPress={() => handleMatchConfirm(false)}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => handleMatchConfirm(true)}>
                <Text style={styles.closeButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
           
          </View>
        </View>
      )}
  
      {waitingResponseModalVisible && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.modalTitle}>Waiting for other response...</Text>
            <span className={"loader"}></span>
            <TouchableOpacity style={styles.closeButton} onPress={() => handleMatchConfirm(false)} >
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
    marginTop: 10,
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
  interestItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: 'fit-content',
    alignItems: 'center',
    marginLeft: "5px",
    marginRight: "5px"
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
