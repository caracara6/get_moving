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
      limit: limit,
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
      limit: 10,
    },
    headers: {
      Accept: "application/json",
      Authorization: API_KEY,
    },
  });
  return response.data;
}

async function plotSearchCoordinates(response, iconUrl, layer) {
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
    
    let resultPhotoUrl = 'images/default.jpg';
    let resultPhoto;
    try {
    resultPhoto = await searchPhoto(eachResult.fsq_id);
    } catch(e) {
      resultPhoto = [];
    } finally{
      resultPhoto.forEach((result) => {
        resultPhotoUrl = result.prefix + "200x200" + result.suffix;
      });
    
    resultMarker.bindPopup(`<div>
      <div>
      <ul>
      <li><span>${eachResult.name}</span></li>
      <li><span>${eachResult.location.formatted_address}</span></li>
      <li><span>${eachResult.location.post_town}</span></li>
      </ul>
      </div>
      <div class="my-2"><img class="popupPhoto rounded-3" src='${resultPhotoUrl}'/></div>
            </div>`);

    resultMarker.addTo(layer);

    let resultElement = document.createElement("li");
    resultElement.innerHTML = 
    `<div>
    ${eachResult.name}
    </div>`
    resultElement.className = "resultList";

    resultElement.addEventListener("click", function () {
      map.flyTo(resultCoordinate, 18);
      resultMarker.openPopup();
    });
    resultMarker.addEventListener("click", function () {
      map.flyTo(resultCoordinate, 18);
      resultMarker.openPopup();
    });

    searchResultElement.appendChild(resultElement);
    } 
  }
  layer.addTo(map)
}

async function showCyclingPath() {
  let response = await axios.get("cycling.geojson");
  let showCyclingLayer = L.geoJson(response.data, {
    onEachFeature: function (feature, layer) {
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = feature.properties.Description;
      let allTds = tempDiv.querySelectorAll("td");
      let pathName = allTds[0].innerHTML;
      layer.bindPopup(`<div><span>${pathName} Cycling Path</span></div>`);
    },
  }).addTo(cyclingLayer);
  showCyclingLayer.setStyle({
    color: "#F2265D",
    opacity: 0.3,
    weight: 5,
  });
  return showCyclingLayer;
}

function noResults(){
  let searchResultElement = document.querySelector("#infoTabSearchResults");
  let noResultElement = document.createElement('li');
  noResultElement.className = "resultList";
  noResultElement.innerHTML = "Try searching for something else!"
  searchResultElement.appendChild(noResultElement);
}

function clearResults() {
  let allResults = document.querySelectorAll(".resultList");
        for (let r of allResults) {
          r.style.display = "none";
        }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  }
    else {
    alert('You have disabled location services');
  }
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
function showResults(){
  document.querySelector("#dropdownButton").classList.add("show");
  document.querySelector("#infoTabSearchResults").classList.add("show");

  if(window.matchMedia('(min-width: 992px)').matches){
    document.querySelector("#infoTabSearchResults").classList.add("dropdownPositionMin992");
  } else {
    document.querySelector("#infoTabSearchResults").classList.add("dropdownPosition");
  }
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

function showBuddyForm() {
  document.querySelector("#page3").classList.remove("hidden");
  document.querySelector("#page3").classList.add("show");
}

function closeBuddyForm() {
  document.querySelector("#page3").classList.remove("show")
  document.querySelector("#page3").classList.add("hidden");
}

function pauseVid() {
  document.getElementById('background-video').pause();
}

function playVid() {
  document.getElementById('background-video').play();
}

function resetRadioBtn(identifier) {
  let allRadioBtns = document.querySelectorAll(`input[type=${identifier}]`);
  for(let r of allRadioBtns){
    r.checked = false
  }
}
function resetDate (identifier){
  let allDates =  document.querySelectorAll(`input[type=${identifier}]`);
  for(let d of allDates){
    d.value = null;
  }
}
function resetCheckboxes(identifier){
  let allCheckboxes = document.querySelectorAll(`input[type=${identifier}]`);
  for(let c of allCheckboxes){
    c.checked = false
  }
}

function resetTextInput(identifier){
  let allTextboxes = document.querySelectorAll(`input[type=${identifier}]`);
  for(let t of allTextboxes){
    t.value = ""
  }
}

function resetFormError() {
  let allErrorMsg = document.querySelectorAll('.errorMsg');
  for(let e of allErrorMsg){
    e.innerHTML = '<br>'
  }
}

let bottom = 0;
let isJumping = false;
function jump(el){
  if(isJumping)
  return
  let upTimer = setInterval(function(){
    if(bottom >= 8){
      clearInterval(upTimer);
      let downTimer = setInterval(function() {
        if(bottom <= 2){
          clearInterval(downTimer);
          isJumping = false;
        }
        bottom -=2;
        document.querySelector(el).style.bottom = bottom + 'px';
      }, 15)
    }
    isJumping = true;
    bottom += 2;
    document.querySelector(el).style.bottom = bottom + 'px';
  }, 15)
}
