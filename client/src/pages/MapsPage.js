import {ImageBackground, View, Image, Text, Platform, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import React, { useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import GoogleMapWrapper from "../components/GoogleMapWrapper";
import TextIconButton from "../components/TextIconButton";
import { LocationType } from "./types";
import {Picker} from '@react-native-picker/picker';
import * as styles_ from "../styles";
import {Slider} from "@mui/material";
import BottomDrawer from "../components/BottomDrawer";

const hardcode_location = [
  {
    id: 1,
    name: 'Hop&Grind',
    locationType: LocationType.ATHLETICS, //FIXME
    location: {
      lat: 43.1979,
      lng: -70.8737,
    },
  }
];

function getDeviceType() {
  try {
    const deviceType = DeviceInfo.getDeviceType();

    switch (deviceType) {
      case 'phone':
        return 'Phone';
      case 'tablet':
        return 'iPad';
      case 'computer':
        return 'Computer';
      default:
        return 'Unknown';
    }
  } catch (error) {
    console.error('Error determining device type:', error);
    return 'Unknown';
  }
}

const filterButtonContent = ({radius, setRadius, isExpanded, setIsExpanded, locationTypes, selectedTypes, handleTypeSelect}) => {
  // Calculate the number of buttons to display based on the expanded state
  const displayedButtons = isExpanded ? locationTypes : locationTypes.slice(0, 6); // Assuming 5 buttons per row, 10 for two rows

  const radiusInMiles = (radius / 1609.34).toFixed(2);

  return (
    <>
      <Text style={{fontSize: 32, color: "black", fontWeight: '800', paddingVertical: 4}} >
        Location Types
      </Text>
      <View style={{flexDirection: "row", flexWrap: 'wrap'}}>
        {displayedButtons.map(type => {
          return (
            <TextIconButton
              key={type.str}
              style={{
                ...styles.center,
                ...styles.button,
                ...styles.sports_filter_button,
                borderColor: selectedTypes.includes(type) ? styles_.PRIMARY_COLOR : styles_.LIGHT_GRAY,
              }}
              textStyle={{
                color: selectedTypes.includes(type) ? styles_.PRIMARY_COLOR : styles_.GRAY,
              }}
              title={type.str}
              onPress={() => handleTypeSelect(type)}
            />
          )
        })}
        {locationTypes.length > 10 && ( // Only show "..." button if there are more than 10 items
          <TouchableOpacity style={{...styles.center}} onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.moreButton}>{isExpanded ? "Show Less" : "..."}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text style={{fontSize: 32, color: "black", fontWeight: '800', paddingVertical: 4}} >
          Location Types
        </Text>
        <Text style={{...styles.header_2}}>Distance</Text>
        <View style={[styles.center]}>
          <Text>Radius: {radiusInMiles} miles</Text>
          <Slider
            style={[styles.map_slider]}
            minimumValue={8040} maximumValue={24140.1} step={804.68}
            value={radius}
            onValueChange={value => setRadius(value)}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#b9e4c9"
          />
        </View>
      </View>
    </>
  )
}

const MapsPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]); // State to store the selected types
  const [radius, setRadius] = useState(8040); // Default radius in meters
  const [isFilterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [isGroupDrawerVisible, setGroupDrawerVisible] = useState(false);
  const [locationsInRadius, setLocationsInRadius] = useState(hardcode_location);
  const [isExpanded, setIsExpanded] = useState(false);

  console.log('Google Maps API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
  // FIXME need to update this
  const locationTypes = Object.values(LocationType).filter(type => type !== "SKIING" && type !== SportsType.ALL_SPORTS);

  useEffect(() => {
  }, []);

  const localSportsTypes = [...new Set(locationsInRadius.map((group) => group.locationType))];

  let filteredLocations = []
  console.log(`Is selected? ${selectedLocation}`)
  if (selectedLocation < 0) {
    filteredLocations = locationsInRadius;
  } else {
    locationsInRadius.map(group => {
      console.log(group)
      if (group.locationType === selectedLocation) {
        filteredLocations.push(group);
      }
    });
  }
  console.log(filteredLocations);

  const handleTypeSelect = (type) => {
    // Check if the type is already selected
    if (selectedTypes.includes(type)) {
      // If selected, remove it from the array
      setSelectedTypes(selectedTypes.filter(selectedType => selectedType !== type));
    } else {
      // If not selected, add it to the array
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const filterButtonProps = {
    radius: radius,
    setRadius: () => setRadius,
    isExpanded: isExpanded,
    setIsExpanded: () => setIsExpanded,
    locationTypes: locationTypes,
    selectedTypes: selectedTypes,
    handleTypeSelect: () => handleTypeSelect
  }

  return (
    <div style={{ width: '90vw', height: '90vh' }}>
      <View style={{flex: 1, width: '90vw', height: '90vh', alignItems: 'center', justifyContent: 'center',}}>
        <View style={styles.search_bar}>
          <View style={search_style.searchSection}>
            <Ionicons style={search_style.searchIcon} name="search" size={20} color={styles_.GRAY}/>
            <TextInput
              style={search_style.input}
              placeholder="Search"
              placeholderTextColor={styles_.LIGHT_GRAY}
            />
          </View>
          <TextIconButton
            style={[styles.center, styles.button, styles.filter_button]}
            onPress={() => {
              // if (isGroupDrawerVisible) {
              //     setGroupDrawerVisible(!isGroupDrawerVisible)
              // }
              setFilterDrawerVisible(!isFilterDrawerVisible)
            }}
            icon={<Ionicons name="options-outline" color={styles_.GRAY} size={24}/>}
          />
        </View>
        <Picker
          mode="dropdown"
          selectedValue={selectedLocation}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          // style={styles.picker}
        >
          <Picker.Item label="All Sports" value={-1} />
          {Object.values(LocationType).map((sport) => ( // FIXME!!!!!
            localSportsTypes.forEach((grp_type) => (
              grp_type === sport? <Picker.Item key={sport} label={sport} value={sport} />:null
            ))
          ))}
        </Picker>
        <GoogleMapWrapper filteredLocations={filteredLocations}/>
        <BottomDrawer
          navigation={navigation}
          setVisible={() => setFilterDrawerVisible}
          isVisible={isFilterDrawerVisible}
          onClose={() => setFilterDrawerVisible(false)}
          children={filterButtonContent(
            {...filterButtonProps}
          )}
        />
      </View>
    </div>
  );
};

export default MapsPage;

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  search_bar: {
    top: 40, zIndex: 10, justifyContent: 'center', flexDirection: "row"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    height: 'auto', width: 'auto',
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: '500',
    marginTop: 0,
    marginBottom: 10,
    borderRadius: 15, height: 50
  },
  header_2: {
    fontSize: 24, fontWeight: '800',
    marginHorizontal: 20, marginTop: 10, marginBottom: 10,
    textAlign: 'left', color: styles_.PRIMARY_COLOR,
  },
  group_name: {
    fontSize: 24, fontWeight: '700', textAlign: 'left',
    marginTop: 10, marginBottom: 10, paddingRight: 20,
  },
  button: {
    borderWidth: 1.4,
    borderColor: styles_.WHITE, backgroundColor: styles_.WHITE,
    shadowColor: styles_.BLACK, shadowOpacity: 0.2,
    shadowRadius: 5, shadowOffset : { width: 0, height: 4}, elevation: 2,
  },
  filter_button: {
    width: 46, height: 46,
    borderRadius: 10,
  },
  sports_filter_button: {
    width: 'auto', height: 40,
    padding: 10, marginVertical: 5,
    borderRadius: 30, marginHorizontal: 5,
  },
  moreButton: {
    // Style for the "..." button
    fontSize: 20,
    color: '#007bff', // Example color
    padding: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  user: {
    width: 43,
    height: 64
  },
  group: {
    width: 40,
    height: 50,
    marginBottom: 10,
  },
  picker: {
    width: 200,
    height: 140,
    backgroundColor: 'white',
    borderRadius: 20,
    top: 100,
    zIndex: 10,
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    margin: 16
  },
  desc: {
    color: styles_.GRAY,
  },
});

const search_style = StyleSheet.create({
  searchSection: {
    flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
    backgroundColor: styles_.WHITE, borderColor: styles_.WHITE, borderWidth: 1, borderRadius: 10,
    shadowColor: styles_.BLACK, shadowOpacity: 0.2,
    shadowRadius: 5, shadowOffset : { width: 0, height: 4}, elevation: 2,
    width: '70%', marginRight: -10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    color: styles_.LIGHT_GRAY,
    fontSize: 18,
    fontWeight: '500',
  },
});