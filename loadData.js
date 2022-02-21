const API_BASE_URL="https://api.foursquare.com/v3";
const API_KEY="fsq3KsDXbif0VEzzseynwf0eXjgsmZ+f+TTkTigq0LIpneY=";

async function searchPlaces(lat, lng, query) {
  let ll = lat + ',' + lng;
  let response = await axios.get(API_BASE_URL + '/places/search',{
    params: {
        ll: ll,
        v: 20220221,
        query: query,
        radius: 12000,
        categories: 18000,
        limit: 20
      },
      headers: {
          Accept: 'application/json',
          Authorization: API_KEY
      }
    })
    return response.data
}

async function searchBadminton(lat, lng, query) {
  let ll = lat + ',' + lng;
  let response = await axios.get(API_BASE_URL + '/places/search',{
    params: {
      ll: ll,
      v: 20220221,
      query: "badminton",
      radius: 25000,
      categories: 18000,
      limit: 10
    },
    headers: {
      Accept: 'application/json',
      Authorization: API_KEY
  }
  })
  return response.data
}

async function searchBasketball(lat, lng, query) {
  let ll = lat + ',' + lng;
  let response = await axios.get(API_BASE_URL + '/places/search',{
    params: {
      ll: ll,
      v: 20220221,
      query: "basketball",
      radius: 25000,
      categories: 18000,
      limit: 10
    },
    headers: {
      Accept: 'application/json',
      Authorization: API_KEY
  }
  })
  return response.data
}

async function searchTennis(lat, lng, query) {
  let ll = lat + ',' + lng;
  let response = await axios.get(API_BASE_URL + '/places/search',{
    params: {
      ll: ll,
      v: 20220221,
      query: "tennis",
      radius: 25000,
      categories: 18000,
      limit: 10
    },
    headers: {
      Accept: 'application/json',
      Authorization: API_KEY
  }
  })
  return response.data
}