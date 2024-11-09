import {ImageBackground, View, Image, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import React, { useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {Picker} from '@react-native-picker/picker';
import {Slider} from "@mui/material";
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import BottomDrawer from "../components/BottomDrawer";
import TextIconButton from "../components/TextIconButton";
import {GoogleMapWrapper, SearchBar, FilterDrawerContent} from "../components/map";
import { LocationType } from "../utils/types";
import * as styles_ from "../styles";

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
  const locationTypes = Object.values(LocationType).filter(type => type !== "SKIING" && type !== LocationType.ALL_SPORTS);

  useEffect(() => {
  }, []);

  const localLocationTypes = [...new Set(locationsInRadius.map((group) => group.locationType))];

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
    isExpanded: isExpanded,
    setIsExpanded: () => setIsExpanded,
    locationTypes: locationTypes,
    selectedTypes: selectedTypes,
    handleTypeSelect: () => handleTypeSelect
  }

  return (
    <div style={{ width: '90vw', height: '90vh' }}>
      <SearchBar isFilterDrawerVisible={isFilterDrawerVisible} setFilterDrawerVisible={setFilterDrawerVisible} />
      <View style={{flex: 1, width: '90vw', height: '90vh', alignItems: 'center', justifyContent: 'center',}}>
        <Picker
          mode="dropdown"
          selectedValue={selectedLocation}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          // style={styles.picker}
        >
          <Picker.Item label="All Sports" value={-1} />
          {Object.values(LocationType).map((sport) => ( // FIXME!!!!!
            localLocationTypes.forEach((grp_type) => (
              grp_type === sport? <Picker.Item key={sport} label={sport} value={sport} />:null
            ))
          ))}
        </Picker>
        <GoogleMapWrapper filteredLocations={filteredLocations}/>
        <BottomDrawer
          setVisible={setFilterDrawerVisible}
          isVisible={isFilterDrawerVisible}
          onClose={() => setFilterDrawerVisible(false)}
          children={<FilterDrawerContent{...filterButtonProps}/>}
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