let map;
let singapore;
let lightMode;
let darkMode;
let randNum;
let mapCenter;
let userLocation;
let searchLayer = L.layerGroup();
let cyclingLayer = L.layerGroup();
let sportClusterLayer = L.markerClusterGroup();
let baseMaps;
let overlays;

async function main() {
  function init() {
    map = initMap();

    window.addEventListener("DOMContentLoaded", function () {
      map.on("baselayerchange", function (e) {
        if (e.layer.options.id == "mapbox/streets-v11") {
          document.getElementById("singaporeMap").classList.remove("dark-mode");
          document.getElementById("singaporeMap").classList.add("light-mode");
          let colorChange = document.querySelectorAll(".color-change");
          for (let c of colorChange) {
            c.classList.remove("white");
            c.classList.add("black");
          }
          document.querySelector("#buddyBtn").classList.remove("filter-white");
          document.querySelector("#buddyBtn").classList.add("filter-black");
        } else if (e.layer.options.id == "mapbox/dark-v10") {
          document
            .getElementById("singaporeMap")
            .classList.remove("light-mode");
          document.getElementById("singaporeMap").classList.add("dark-mode");

          let colorChange = document.querySelectorAll(".color-change");
          for (let c of colorChange) {
            c.classList.remove("black");
            c.classList.add("white");
          }
          document.querySelector("#buddyBtn").classList.remove("filter-black");
          document.querySelector("#buddyBtn").classList.add("filter-white");
        }
      });

      let landingSearchBtn = document.querySelector("#landingSearchBtn");
      landingSearchBtn.addEventListener("click", async function () {
        //clear previous results
        let allResults = document.querySelectorAll(".resultList");
        for (let r of allResults) {
          r.style.display = "none";
        }

        // search validation
        let emptySearch = false;

        let searchInput = document.querySelector("#searchInput").value;

        if (!searchInput) {
          emptySearch = true;
        }

        if (emptySearch) {
          let validation = document.querySelector("#searchValidation");
          validation.innerHTML = "Please enter a valid search term";
        } else {
          resetMap();

          showMapPage();

          mapCenter = map.getBounds().getCenter();

          let response = await searchPlaces(
            mapCenter.lat,
            mapCenter.lng,
            searchInput,
            10
          );

          // search results auto-dropdown for better UX
          document.querySelector("#dropdownButton").classList.add("show");
          document.querySelector("#infoTabSearchResults").classList.add("show");

          // console.log(response.results);

          plotSearchCoordinates(response.results, "icons/search.svg");
          searchLayer.addTo(map);
        }
      });

      let mapSearchBtn = document.querySelector("#mapSearchBtn");
      mapSearchBtn.addEventListener("click", async function () {
        //clear previous results
        let allResults = document.querySelectorAll(".resultList");
        for (let r of allResults) {
          r.style.display = "none";
        }

        // search validation
        let emptySearch = false;

        let searchInput = document.querySelector("#mapSearchInput").value;

        if (!searchInput) {
          emptySearch = true;
        }

        if (emptySearch) {
          let validation = document.querySelector("#searchValidation");
          validation.innerHTML = "Please enter a valid search term";
        } else {
          resetMap();

          mapCenter = map.getBounds().getCenter();

          let response = await searchPlaces(
            mapCenter.lat,
            mapCenter.lng,
            searchInput,
            8
          );

          // search results auto-dropdown for better UX
          document.querySelector("#dropdownButton").classList.add("show");
          document.querySelector("#infoTabSearchResults").classList.add("show");

          // console.log(response.results);

          plotSearchCoordinates(response.results, "icons/search.svg");
          searchLayer.addTo(map);
        }
      });

      let locationSearchBtn = document.querySelector("#locationSearchBtn");
      locationSearchBtn.addEventListener("click", async function () {
        //clear previous results
        let allResults = document.querySelectorAll(".resultList");
        for (let r of allResults) {
          r.style.display = "none";
        }

        // search validation
        let emptySearch = false;

        let searchInput = document.querySelector("#mapSearchInput").value;

        if (!searchInput) {
          emptySearch = true;
        }

        if (emptySearch) {
          let validation = document.querySelector("#searchValidation");
          validation.innerHTML = "Please enter a valid search term";
        } else {
          resetMap();
          getLocation();
          // console.log(userLocation[0]);
          // console.log(searchInput);

          let response = await searchPlaces(
            userLocation[0],
            userLocation[1],
            searchInput,
            8
          );

          // search results auto-dropdown for better UX
          document.querySelector("#dropdownButton").classList.add("show");
          document.querySelector("#infoTabSearchResults").classList.add("show");

          plotSearchCoordinates(response.results, "icons/search.svg");
          searchLayer.addTo(map);
        }
      });

      let backBtn = document.querySelector("#backBtn");
      backBtn.addEventListener("click", function () {
        let validation = document.querySelector("#searchValidation");
        validation.innerHTML = "<br>";

        showLandingPage();
      });

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
        let response = await searchSport(
          mapCenter.lat,
          mapCenter.lng,
          "basketball"
        );
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
        let response = await searchSport(
          mapCenter.lat,
          mapCenter.lng,
          "bowling"
        );
        plotSportsCoordinates(response.results, "icons/bowling.svg");
      });

      let swimmingBtn = document.querySelector("#swimmingBtn");
      swimmingBtn.addEventListener("click", async function () {
        resetMap();
        mapCenter = map.getBounds().getCenter();
        let response = await searchSport(
          mapCenter.lat,
          mapCenter.lng,
          "swimming"
        );
        plotSportsCoordinates(response.results, "icons/swimming.svg");
      });

      let volleyballBtn = document.querySelector("#volleyballBtn");
      volleyballBtn.addEventListener("click", async function () {
        resetMap();
        mapCenter = map.getBounds().getCenter();
        let response = await searchSport(
          mapCenter.lat,
          mapCenter.lng,
          "volleyball"
        );
        plotSportsCoordinates(response.results, "icons/volleyball.svg");
      });

      let cyclingBtn = document.querySelector("#cyclingBtn");
      cyclingBtn.addEventListener("click", async function () {
        resetMap();
        showCyclingPath();
        cyclingLayer.addTo(map);
      });

      let randomSportSearch;

      let surpriseMeBtn = document.querySelector("#surpriseMeBtn");
      surpriseMeBtn.addEventListener("click", function () {
        // generateRandomSport();
        randomSportSearch = generateRandomSport();
        // console.log(randomSportSearch)
      });

      let letsGoBtn = document.querySelector("#letsGoBtn");
      letsGoBtn.addEventListener("click", async function () {
        resetMap();
        showMapPage();

        // let surpriseModal = bootstrap.Modal.getInstance(document.getElementById('surpriseModal'))
        // surpriseModal.hide();

        //         // let surpriseModal = document.getElementById('surpriseModal');
        //         // surpriseModal.hide();
        //         // close modal here

        mapCenter = map.getBounds().getCenter();

        let response = await searchPlaces(
          mapCenter.lat,
          mapCenter.lng,
          randomSportSearch,
          8
        );

        // search results auto-dropdown for better UX
        document.querySelector("#dropdownButton").classList.add("show");
        document.querySelector("#infoTabSearchResults").classList.add("show");

        plotSearchCoordinates(response.results, "icons/search.svg");
        searchLayer.addTo(map);
      });

      let buddyBtn = document.querySelector("#buddyBtn");
      buddyBtn.addEventListener("click", function () {
        showBuddyForm();
      });

      let othersCheckbox = document.getElementById("othersCheckbox");
      othersCheckbox.addEventListener("click", function () {
        if (othersCheckbox.checked == true) {
          document.getElementById("othersSpecific").style.display = "block";
        } else {
          document.getElementById("othersSpecific").style.display = "none";
        }

        // alert('hello')
        // document.getElementById('othersSpecific').style.display = 'block'
      });

      let agreetNc = document.querySelector("#agreetNc");
      agreetNc.addEventListener("click", function () {
        document.querySelector("#tNcCheckbox").disabled = false;
      });

      let submitBtn = document.querySelector("#submitBtn");
      submitBtn.addEventListener("click", function () {
        // name error
        let name = document.getElementById("name").value;
        let nameNotProvided = false;
        let nameTooShort = false;

        if (!name) {
          nameNotProvided = true;
        } else if (name.length < 3) {
          nameTooShort = true;
        }

        if (nameNotProvided || nameTooShort) {
          if (nameNotProvided) {
            document.getElementById("nameValidation").innerHTML =
              "Please enter your name";
          }
          if (nameTooShort) {
            document.getElementById("nameValidation").innerHTML =
              "Please nter a valid name";
          }
        }

        // age error
        let dob = new Date(document.getElementById("dob").value);

        let today = new Date();
        let currentYear = today.getFullYear();
        let currentMonth = today.getMonth();
        let currentDay = today.getDate();

        let birthYear = dob.getFullYear();
        let birthMonth = dob.getMonth();
        let birthDay = dob.getDate();

        let age = currentYear - birthYear;
        let ageMonth = currentMonth - birthMonth;
        let ageDay = currentDay - birthDay;

        if (!age) {
          document.getElementById("ageValidation").innerHTML =
            "Please enter your age";
        }
        if (age > 100) {
          document.getElementById("ageValidation").innerHTML =
            "Please enter an age below 100 years old";
        }
        if ((age == 18 && ageMonth <= 0 && ageDay <= 0) || age < 18) {
          document.getElementById("ageValidation").innerHTML =
            "You have to be older than 18";
        }

        // gender error
        let gender = null;
        for (let eachGender of document.querySelectorAll(".gender")) {
          if (eachGender.checked == true) {
            gender = eachGender.value;
            document.getElementById("genderValidation").innerHTML = "";
            break;
          }
        }
        if (gender == null) {
          document.getElementById("genderValidation").innerHTML =
            "Please select your gender";
        }

        //email error
        let email = document.getElementById("email").value;
        validateEmail(email);

        //activities error
        let allActivities = document.getElementsByClassName(".activity");
        let selectedActivities = [];
        for (let activity of allActivities) {
          if (activity.checked == true) {
            selectedActivities.push(activity.value);
          }
        }
        ////////work on this!!!!
        if (selectedActivities.length == 0) {
          document.querySelector(
            "#activityValidation"
          ).innerHTML = `Please choose at least one activity`;
        }

        let otherActivity = document.querySelector("#othersSpecific").value;
        if (!otherActivity) {
          document.querySelector("#activityValidation").innerHTML =
            "Please let us know what activity you prefer";
        }

        //terms and conditions error
        let tNcCheckbox = document.querySelector("#tNcCheckbox");
        if (tNcCheckbox.checked == false) {
          document.querySelector("#tNcValidation").innerHTML =
            "Please agree to the terms and conditions";
        }

        console.log(name, dob, email, gender);

        //submit response
      });

      //clear error message
      function clearErrorMessage(inputID, event, errorID){
        document.querySelector(inputID).addEventListener(event, function(){
          document.querySelector(errorID).innerHTML='<br>'
        })
      }
      clearErrorMessage('#name', 'keydown', '#nameValidation');
      clearErrorMessage('#dob', 'click', '#ageValidation');
      clearErrorMessage('#male-gender', 'click', '#genderValidation');
      clearErrorMessage('#female-gender', 'click', '#genderValidation');
      clearErrorMessage('#email', 'keydown', '#emailValidation');
      let allActivities = document.querySelectorAll(".activity");
      // allActivities.pop();
      console.log(allActivities)
      for(activity of allActivities){
        // clearErrorMessage('#'+)
        clearErrorMessage('#'+ activity.id, 'click', '#activityValidation');
      }













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
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/dark-v10",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoiY2FyYWNhcmE2IiwiYSI6ImNrenV6anhiMjdyamYyd25mYXB3N2V6aGUifQ._MiXk72eEw378aB0cJnNng",
      }
    );
    // darkMode = L.tileLayer(
    //   "https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token={accessToken}",
    //   {
    //     attribution:
    //       '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //     minZoom: 0,
    //     maxZoom: 22,
    //     subdomains: "abcd",
    //     accessToken:
    //       "GSRGuSqDDcYgQnf3k9ESutlUBugw4YctZAzWNSE7iZLhxb0jQZLuHbOXq5etkVAQ",
    //   }
    // );

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
