const API_BASE_URL="https://api.foursquare.com/v3";
const API_KEY="fsq3KsDXbif0VEzzseynwf0eXjgsmZ+f+TTkTigq0LIpneY=";

async function searchPlaces(lat, lng, query) {
    let ll = lat + ',' + lng;
    let response = await axios.get(API_BASE_URL + '/places/search',{
        params: {
            ll: ll,
            v: 20220221,
            query: query,
            radius: 100000
        },
        headers: {
            Accept: application/JSON,
            Authorization: API_KEY
        }
    })
    return response.data
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log = "Geolocation is not supported by this browser.";
    }
    return [position.coords.latitude, position.coords.longitude]
  }