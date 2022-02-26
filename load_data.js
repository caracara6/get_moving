const API_BASE_URL = "https://api.foursquare.com/v3";
const API_KEY = "fsq3KsDXbif0VEzzseynwf0eXjgsmZ+f+TTkTigq0LIpneY=";

async function searchPlaces(lat, lng, query) {
  let ll = lat + "," + lng;
  let response = await axios.get(API_BASE_URL + "/places/search", {
    params: {
      ll: ll,
      v: 20220221,
      query: query,
      radius: 12000,
      categories: 18000,
      limit: 15,
    },
    headers: {
      Accept: "application/json",
      Authorization: API_KEY,
    },
  });
  return response.data;
}

async function searchSport(lat, lng, sport) {
  let ll = lat + "," + lng;
  let response = await axios.get(API_BASE_URL + "/places/search", {
    params: {
      ll: ll,
      v: 20220221,
      query: sport,
      radius: 25000,
      categories: 18000,
      limit: 20,
    },
    headers: {
      Accept: "application/json",
      Authorization: API_KEY,
    },
  });
  return response.data;
}

function plotCoordinates(response, iconUrl) {
  for (let eachResult of response) {
    let resultCoordinate = [
      eachResult.geocodes.main.latitude,
      eachResult.geocodes.main.longitude,
    ];

    let resultIcon = L.icon({
      iconUrl: iconUrl,
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
}

function resetMap() {
  searchLayer.clearLayers();
  sportClusterLayer.clearLayers();
  map.setView(singapore, 12);
}

// for (let eachResult of response.results) {
//   let resultCoordinate = [
//     eachResult.geocodes.main.latitude,
//     eachResult.geocodes.main.longitude,
//   ];

//   let resultIcon = L.icon({
//     iconUrl: "icons/dumbbell.svg",
//     iconSize: [35, 35],
//   });
//   let resultMarker = L.marker(resultCoordinate, { icon: resultIcon });
//   resultMarker.bindPopup(`<div>
//     <div>${eachResult.name}</div>
//     <button type="button" class="btn btn-primary">Directions</button>
//     </div>`);
//   resultMarker.addTo(sportClusterLayer);
//   sportClusterLayer.addTo(map);
//   resultMarker.addEventListener("click", function () {
//     map.flyTo(resultCoordinate, 16);
//     resultMarker.openPopup();
//   });
// }
