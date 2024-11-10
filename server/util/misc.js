const deg2rad = (deg) => { return deg * (Math.PI/180) }

export const coord_distance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.756; // Radius of the earth in miles
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1); 
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in miles
    return d;
}

// Ended up not needing this, but leaving it here in case we need distance calculations again
// const lat = activeUsers[uid].lat
// const long = activeUsers[uid].long

// distances = {}
// for (const [venueName, venue] of Object.entries(venues)) {
//     venLat = venue.lat
//     venLong = venue.long

//     // Geographical distance algorithm from https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates

//     

//     const R = 3958.756 // Earth's radius in miles
//     const dLat = deg2rad(venLat - lat)
//     const dLon = deg2rad(venLong - long)
//     const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat)) * Math.cos(deg2rad(venLat)) * Math.sin(dLon/2) * Math.sin(dLon/2)

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
//     const d = R*c // Distance in miles
    
// }