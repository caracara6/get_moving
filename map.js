let map;
let singapore;
let lightMode;
let darkMode;
let mapCenter;
let searchLayer = L.layerGroup();
let sportClusterLayer = L.markerClusterGroup();
let baseMaps;
let overlays;

async function main() {
  function init() {
    map = initMap();

    window.addEventListener("DOMContentLoaded", function () {
      console.log("refreshing");

      let searchBtn = document.querySelector("#searchBtn");
      searchBtn.addEventListener("click", async function () {
        searchLayer.clearLayers();
        sportClusterLayer.clearLayers();
        map.setView(singapore, 12);

        let searchInput = document.querySelector("#searchInput").value;
        console.log(searchInput);
        mapCenter = map.getBounds().getCenter();
        let response = await searchPlaces(
          mapCenter.lat,
          mapCenter.lng,
          searchInput
        );
        console.log(response.results);

        let searchResultElement = document.querySelector(
          "#infoTabSearchResults"
        );

        for (let eachResult of response.results) {
          let resultCoordinate = [
            eachResult.geocodes.main.latitude,
            eachResult.geocodes.main.longitude,
          ];
          console.log(resultCoordinate);

          let resultIcon = L.icon({
            iconUrl: "icons/search.png",
            iconSize: [35, 35],
          });

          let resultMarker = L.marker(resultCoordinate, { icon: resultIcon });
          resultMarker.bindPopup(`<div>
            <div>${eachResult.name}</div>
            <button type="button" class="btn btn-primary">Directions</button>
            </div>`);
          resultMarker.addTo(searchLayer);

          let resultElement = document.createElement("li");
          resultElement.innerHTML = eachResult.name;
          resultElement.className = "resultList";

          resultElement.addEventListener("click", function () {
            map.flyTo(resultCoordinate, 16);
            resultMarker.openPopup();
          });
          resultMarker.addEventListener("click", function () {
            map.flyTo(resultCoordinate, 16);
            resultMarker.openPopup();
          });
          searchResultElement.appendChild(resultElement);
        }
        searchLayer.addTo(map);
      });

      let gymBtn = document.querySelector("#gymBtn");
      gymBtn.addEventListener("click", async function () {
        searchLayer.clearLayers();
        sportClusterLayer.clearLayers();
        map.setView(singapore, 12);
        mapCenter = map.getBounds().getCenter();
        let response = await searchSport(mapCenter.lat, mapCenter.lng, "gym");
        // console.log(response.results)







        //refactor from here???

        for (let eachResult of response.results) {
          let resultCoordinate = [
            eachResult.geocodes.main.latitude,
            eachResult.geocodes.main.longitude,
          ];

          let resultIcon = L.icon({
            iconUrl: "icons/dumbbell.svg",
            iconSize: [35, 35],
          });
          let resultMarker = L.marker(resultCoordinate, { icon: resultIcon });
          resultMarker.bindPopup(`<div>
            <div>${eachResult.name}</div>
            <button type="button" class="btn btn-primary">Directions</button>
            </div>`);
          resultMarker.addTo(sportClusterLayer);
          sportClusterLayer.addTo(map);
          resultMarker.addEventListener("click", function () {
            map.flyTo(resultCoordinate, 16);
            resultMarker.openPopup();
          });
        }
      });
    });
  }

  function initMap() {
    // Initialise map
    singapore = [1.3069, 103.8189];
    map = L.map("singaporeMap");
    map.setView(singapore, 12);

    // Add light layer
    lightMode = L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoiY2FyYWNhcmE2IiwiYSI6ImNrenV6anhiMjdyamYyd25mYXB3N2V6aGUifQ._MiXk72eEw378aB0cJnNng",
      }
    );
    lightMode.addTo(map);

    // Add dark layer
    darkMode = L.tileLayer(
      "https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token={accessToken}",
      {
        attribution:
          '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: "abcd",
        accessToken:
          "GSRGuSqDDcYgQnf3k9ESutlUBugw4YctZAzWNSE7iZLhxb0jQZLuHbOXq5etkVAQ",
      }
    );

    let userMarker = L.marker(singapore, { draggable: true });
    let popup = userMarker.bindPopup("Hello");
    popup.addTo(map);

    // Set up base layers
    baseMaps = {
      Light: lightMode,
      Dark: darkMode,
    };

    // Set up overlays
    overlays = {
      // "Search Results": searchLayer
    };

    // {collapsed=false}??
    L.control
      .layers(baseMaps, overlays, { position: "bottomright" })
      .addTo(map);

    return map;
  }
  init();
}

main();
