import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import TextIconButton from "../general/TextIconButton";
import * as styles_ from "../../styles";
import React from "react";

const FilterDrawerContent = ({isExpanded, setIsExpanded, locationTypes, selectedTypes, handleTypeSelect}) => {
  // Calculate the number of buttons to display based on the expanded state
  const displayedButtons = isExpanded ? locationTypes : locationTypes.slice(0, 6); // Assuming 5 buttons per row, 10 for two rows
  
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
      </View>
    </>
  )
}

export default FilterDrawerContent;

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