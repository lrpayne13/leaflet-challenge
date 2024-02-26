// Initialize the map long lat zoom
let latitude = 37.09; 
let longitude = -95.71; 
let zoomLevel = 5; 
//URL for the earthquake data
let earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Initialize the map
let myMap = L.map("map").setView([latitude, longitude], zoomLevel);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

// Load earthquake data
d3.json(earthquakeDataUrl).then(data => {
    // Loop to create markers
    data.features.forEach(feature => {
        let magnitude = feature.properties.mag;
        let depth = feature.geometry.coordinates[2];
        let latLng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

        // Create marker
        let marker = L.circleMarker(latLng, {
            radius: magnitudeToRadius(magnitude),
            fillColor: depthToColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(myMap);

        // Bind popup
        marker.bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth} km<br>Location: ${feature.properties.place}`);
    });
}).catch(error => {
    console.error('Error loading the earthquake data:', error);
});
// Convert magnitude to radius
function magnitudeToRadius(magnitude) {
    return magnitude * 3;
}

// Convert depth to color
function depthToColor(depth) {
    if (depth > 70) {
        return '#ff0000';
    } else if (depth > 30) {
        return '#ff8c00';
    } else {
        return '#9acd32';
    }
}

// Add legend
let legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let grades = [-10, 10, 30, 50, 70, 90]
    return div;
};
legend.addTo(myMap);
