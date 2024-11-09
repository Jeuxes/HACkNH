import React, {useState, useEffect, useRef}  from 'react';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import {Image, StyleSheet} from "react-native";
import {SearchBar} from "./index";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GoogleMapWrapper = ({ isFilterVisible, setFilterVisible, filteredLocations, children }) => {
  const [coordinates, setCoordinates] = useState({ lat: 43.1340, lng: -70.9264 });
  const [map, setMap] = useState(null);
  
  const autocompleteRef = useRef(null);
  const onLoad = (map) => setMap(map);
  
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      console.log(place); // Do something with the place details
    }
  };

  useEffect(() => {
    (() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {lat: position.coords.latitude, lng: position.coords.longitude};
          if (coords.lng !== coordinates.lng && coords.lat !== coordinates.lat) {
            console.log(coords);
            console.log(coordinates);
            console.log('Setting location');
            setCoordinates({lng: coords.lng, lat: coords.lat});
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
      
    })();
  }, [coordinates, setCoordinates]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      loadingElement={<p>Loading map...</p>}
      libraries={["places"]}
      onError={(e) => console.error('Error loading Google Maps:', e)}
    >
      <GoogleMap
        mapContainerStyle={{ marginLeft: "10%", marginTop: "5%", width: '100%', height: '100%' }}
        center={coordinates}
        zoom={20}
        options={{
          minZoom: 18,
          maxZoom: 20,
          fullscreenControl: false, // Disable fullscreen control
          disableDefaultUI: true, // Disable default UI elements
        }}
        onLoad={onLoad}
      >
        <SearchBar isFilterVisible={isFilterVisible} setFilterVisible={setFilterVisible}/>
        {children}
        <Marker
          position={coordinates}
          title="User Location"
        />

        {filteredLocations.map((group) => (
          <Marker
            key={group.id}
            position={group.location}
            title={group.name}
            description={`Size: ${group.size}, Level: ${group.level}, Type: ${group.locationType}`}
          >
            {/*<Image source={require("../assets/images/group_marker_blue.png")} style={{width: 40, height: 50}}/>*/}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)', // Semi-transparent white background
    top: -20,
    position: 'absolute', // Ensure the loader is positioned above the map
    zIndex: 1, // Make sure the loading container is above all other content
  },
  map: {
    width: '100%',
    height: '100%',
    bottom: '5%',
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