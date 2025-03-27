var map = L.map("map").setView([64.5, 26], 6);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

let markers = [];

function updateTrainLocations() {
    fetch("https://rata.digitraffic.fi/api/v1/train-locations/latest")
        .then(response => response.json())
        .then(data => {
          markers.forEach(marker => map.removeLayer(marker));
          markers = [];
          
          document.getElementById("train-details").innerHTML = "";
          
          data.forEach(train => {
            if (train.location) {
              let coords = train.location.coordinates;
              let marker = L.marker([coords[1], coords[0]])
              .addTo(map)
              .bindPopup(`Rajiv's train ${train.trainNumber}<br>Type: ${train.trainType}<br>Departure: ${train.departureDate}<br>Speed: ${train.speed} km/h`);
              markers.push(marker);
              if (map.getBounds().contains([coords[1], coords[0]])) {
                let listItem = document.createElement("li");
                listItem.textContent = `Train ${train.trainNumber} (${train.trainType}) - ${train.speed} km/h`;
                
                document.getElementById("train-details").appendChild(listItem);
              }
            }
          });
          document.getElementById("last-update").textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        })
        .catch(error => console.error("Error:", error));
      }
      updateTrainLocations();
      let updateInterval = setInterval(updateTrainLocations, 10000);
      map.on("moveend", updateTrainLocations);
