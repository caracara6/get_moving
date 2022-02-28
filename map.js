let map;
let singapore;
let lightMode;
let darkMode;
let mapCenter;
let searchLayer = L.layerGroup();
let cyclingLayer = L.layerGroup();
let sportClusterLayer = L.markerClusterGroup();
let baseMaps;
let overlays;

async function main() {
  function init() {
    map = initMap();

    window.addEventListener("DOMContentLoaded", function () {

      let landingSearchBtn = document.querySelector("#landingSearchBtn");
      landingSearchBtn.addEventListener("click", async function () {
        
        // search validation
        let emptySearch = false;

        let searchInput = document.querySelector("#searchInput").value;

        if (!searchInput) {
          emptySearch = true;
        }

        if (emptySearch){
          let validation = document.querySelector('#searchValidation');
          validation.innerHTML = 'Please enter a valid search term'
        } else {
        resetMap();

        //go to map page
        showMapPage();
        
        mapCenter = map.getBounds().getCenter();

        let response = await searchPlaces(
          mapCenter.lat,
          mapCenter.lng,
          searchInput
        );

        // search results auto-dropdown for better UX
        document.querySelector('#dropdownButton').classList.add('show');
        document.querySelector('#infoTabSearchResults').classList.add('show');

        // console.log(response.results);

        plotSearchCoordinates(response.results, "icons/search.png");
        searchLayer.addTo(map);
        }
      });

      let mapSearchBtn = document.querySelector('#mapSearchBtn');
      mapSearchBtn.addEventListener('click', async function(){
        // search validation
        let emptySearch = false;

        let searchInput = document.querySelector("#searchInput").value;

        if (!searchInput) {
          emptySearch = true;
        }

        if (emptySearch){
          let validation = document.querySelector('#searchValidation');
          validation.innerHTML = 'Please enter a valid search term'
        } else {
        resetMap();

        mapCenter = map.getBounds().getCenter();

        let response = await searchPlaces(
          mapCenter.lat,
          mapCenter.lng,
          searchInput
        );

        // search results auto-dropdown for better UX
        document.querySelector('#dropdownButton').classList.add('show');
        document.querySelector('#infoTabSearchResults').classList.add('show');

        // console.log(response.results);

        plotSearchCoordinates(response.results, "icons/search.png");
        searchLayer.addTo(map);
        





        }

      })

      let backBtn = document.querySelector('#backBtn');
      backBtn.addEventListener('click', function(){

        let validation = document.querySelector('#searchValidation');
        validation.innerHTML = '<br>'

        //back to landing page
        let allPages = document.querySelectorAll('.page');
        for(let page of allPages){
          page.classList.remove('show');
          page.classList.add('hidden');
        }
        let page1 = document.querySelector('#page1');
        page2.classList.add('hidden');
        page1.classList.add('show');
      })

      let gymBtn = document.querySelector("#gymBtn");
      gymBtn.addEventListener("click", async function () {
        resetMap();
        mapCenter = map.getBounds().getCenter();
        let response = await searchSport(mapCenter.lat, mapCenter.lng, "gym");
        plotSportsCoordinates(response.results, "icons/dumbbell.svg");
      });

      let basketballBtn = document.querySelector("#basketballBtn");
      basketballBtn.addEventListener("click", async function () {
        resetMap();
        mapCenter = map.getBounds().getCenter();
        let response = await searchSport(mapCenter.lat, mapCenter.lng, "basketball");
        plotSportsCoordinates(response.results, "icons/basketball.svg");
      });

      let golfBtn = document.querySelector("#golfBtn");
      golfBtn.addEventListener("click", async function () {
        resetMap();
        mapCenter = map.getBounds().getCenter();
        let response = await searchSport(mapCenter.lat, mapCenter.lng, "golf");
        plotSportsCoordinates(response.results, "icons/golf.svg");
      });

      let bowlingBtn = document.querySelector("#bowlingBtn");
      bowlingBtn.addEventListener("click", async function () {
        resetMap();
        mapCenter = map.getBounds().getCenter();
        let response = await searchSport(mapCenter.lat, mapCenter.lng, "bowling");
        plotSportsCoordinates(response.results, "icons/bowling.svg");
      });

      let swimmingBtn = document.querySelector("#swimmingBtn");
      swimmingBtn.addEventListener("click", async function () {
        resetMap();
        mapCenter = map.getBounds().getCenter();
        let response = await searchSport(mapCenter.lat, mapCenter.lng, "swimming");
        plotSportsCoordinates(response.results, "icons/swimming.svg");
      });

      let volleyballBtn = document.querySelector("#volleyballBtn");
      volleyballBtn.addEventListener("click", async function () {
        resetMap();
        mapCenter = map.getBounds().getCenter();
        let response = await searchSport(mapCenter.lat, mapCenter.lng, "volleyball");
        plotSportsCoordinates(response.results, "icons/volleyball.svg");
      });

      let cyclingBtn = document.querySelector('#cyclingBtn');
      cyclingBtn.addEventListener('click', async function() {
        resetMap();
        showCyclingPath();
        cyclingLayer.addTo(map);
      }) 
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
