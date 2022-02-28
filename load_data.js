const API_BASE_URL = "https://api.foursquare.com/v3";
const API_KEY = "fsq3KsDXbif0VEzzseynwf0eXjgsmZ+f+TTkTigq0LIpneY=";

async function searchPlaces(lat, lng, query, limit) {
  let ll = lat + "," + lng;
  let response = await axios.get(API_BASE_URL + "/places/search", {
    params: {
      ll: ll,
      v: 20220221,
      query: query,
      radius: 12000,
      categories: 18000,
      limit: limit
    },
    headers: {
      Accept: "application/json",
      Authorization: API_KEY,
    },
  });
  return response.data;
}

async function searchPhoto(fsqid) {
  let response = await axios.get(
    API_BASE_URL + "/places/" + fsqid + "/photos",
    {
      params: {
        limit: 1,
      },
      headers: {
        Accept: "application/json",
        Authorization: API_KEY,
      },
    }
  );
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

async function plotSearchCoordinates(response, iconUrl) {
  let searchResultElement = document.querySelector("#infoTabSearchResults");
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

    let resultPhoto = await searchPhoto(eachResult.fsq_id);

    let resultPhotoUrl = null;

    if (resultPhoto.length == 0) {
      continue;
    } else {
      resultPhoto.forEach((result) => {
        resultPhotoUrl = result.prefix + "original" + result.suffix;
      });
    }

    resultMarker.bindPopup(`<div>
      <div>${eachResult.name}</div>
      <div class="my-2"><img class="popupPhoto" src='${resultPhotoUrl}'/></div>
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

    // setInterval(function () {searchResultElement.appendChild(resultElement)}, 2000);
    searchResultElement.appendChild(resultElement);
  }
}

async function plotSportsCoordinates(response, iconUrl) {
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

    let resultPhoto = await searchPhoto(eachResult.fsq_id);

    let resultPhotoUrl = null;
    if (resultPhoto.length == 0) {
      continue;
    } else {
      resultPhoto.forEach((result) => {
        resultPhotoUrl = result.prefix + "original" + result.suffix;
      });
    }

    resultMarker.bindPopup(`<div>
            <div>${eachResult.name}</div>
            <div class="my-2"><img class="popupPhoto" src='${resultPhotoUrl}'/></div>
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

async function showCyclingPath() {
  let response = await axios.get("cycling.geojson");
  let showCyclingLayer = L.geoJson(response.data, {
    onEachFeature: function (feature, layer) {
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = feature.properties.Description;
      let allTds = tempDiv.querySelectorAll("td");
      let pathName = allTds[0].innerHTML;
      layer.bindPopup(`<div>${pathName} Cycling Path</div>`);
    },
  }).addTo(cyclingLayer);
  showCyclingLayer.setStyle({
    color: "#F226EE",
    opacity: 0.5,
    weight: 5,
  });
  return showCyclingLayer;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } 
  // else{} ???????
}

function showPosition(position) {
  userLocation = [position.coords.latitude, position.coords.longitude];
  return userLocation;
}

function resetMap() {
  searchLayer.clearLayers();
  sportClusterLayer.clearLayers();
  cyclingLayer.clearLayers();
  map.setView(singapore, 12);
}

function showMapPage() {
  let allPages = document.querySelectorAll(".page");
  for (let page of allPages) {
    page.classList.remove("show");
    page.classList.add("hidden");
  }
  let page2 = document.querySelector("#page2");
  page2.classList.remove("hidden");
  page2.classList.add("show");
}

function showLandingPage() {
  let allPages = document.querySelectorAll(".page");
  for (let page of allPages) {
    page.classList.remove("show");
    page.classList.add("hidden");
  }
  let page1 = document.querySelector("#page1");
  page2.classList.add("hidden");
  page1.classList.add("show");
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
