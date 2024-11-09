import SearchIcon from "@mui/icons-material/Search";
import * as styles_ from "../../styles";
import {StyleSheet, View} from "react-native";
import React from "react";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import TextIconButton from "../general/TextIconButton";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const SearchBar = ({isFilterVisible, setFilterVisible}) => {
  return (
    <View style={search_style.search_bar}>
      <View style={search_style.searchSection}>
        <SearchIcon style={search_style.searchIcon} size={20} color={styles_.GRAY}/>
        <GooglePlacesAutocomplete
          placeholder='Search'
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          query={{
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            language: 'en',
          }}
        />
      </View>
      <TextIconButton
        style={[search_style.center, search_style.button, search_style.filter_button]}
        onPress={() => {
          setFilterVisible(!isFilterVisible)
        }}
        icon={<TuneOutlinedIcon color={styles_.GRAY} size={24}/>}
      />
    </View>
    
  )
}

const search_style = StyleSheet.create({
  search_bar: {
    top: 80, zIndex: 1200, justifyContent: 'center', flexDirection: "row"
  },
  search_list: {
    top: 100, zIndex: 1200, justifyContent: 'center', flexDirection: "column"
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
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
});

export default SearchBar;