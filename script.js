// Set up the map
var map = L.map('map').setView([64.5, 26], 6); // Center of Finland
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Function to fetch and display train locations
function updateTrainLocations() {
    fetch('https://rata.digitraffic.fi/api/v1/train-locations/latest')
        .then(response => response.json())
        .then(data => {
            // Clear old markers
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });

            // Add new markers
            data.forEach(train => {
                if (train.location) {
                    let coords = train.location.coordinates; // [longitude, latitude]
                    L.marker([coords[1], coords[0]])
                        .addTo(map)
                        .bindPopup(`Train ${train.trainNumber}<br>Speed: ${train.speed} km/h`);
                }
            });
        })
        .catch(error => console.error('Error:', error));
}

// Run once
updateTrainLocations();

// Auto-update every 10 seconds
setInterval(updateTrainLocations, 10000);