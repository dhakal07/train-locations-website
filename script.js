var map = L.map('map').setView([64.5, 26], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Store markers to track them
let markers = [];

function updateTrainLocations() {
    fetch('https://rata.digitraffic.fi/api/v1/train-locations/latest')
        .then(response => response.json())
        .then(data => {
            // Clear old markers
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            
            // Clear train list
            let trainList = document.getElementById('train-details');
            trainList.innerHTML = '';

            // Add new markers and list trains
            data.forEach(train => {
                if (train.location) {
                    let coords = train.location.coordinates;
                    let marker = L.marker([coords[1], coords[0]])
                        .addTo(map)
                        .bindPopup(`Train ${train.trainNumber}<br>Type: ${train.trainType}<br>Departure: ${train.departureDate}<br>Speed: ${train.speed} km/h`);
                    markers.push(marker);

                    // Check if train is in view
                    if (map.getBounds().contains([coords[1], coords[0]])) {
                        let listItem = document.createElement('li');
                        listItem.textContent = `Train ${train.trainNumber} (${train.trainType}) - ${train.speed} km/h`;
                        trainList.appendChild(listItem);
                    }
                }
            });

            // Update timestamp
            document.getElementById('last-update').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        })
        .catch(error => console.error('Error:', error));
}

// Initial call
updateTrainLocations();

// Auto-update every 10 seconds
let updateInterval = setInterval(updateTrainLocations, 10000);

// Update train list when map view changes
map.on('moveend', updateTrainLocations);