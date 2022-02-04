// Foursquare API Info


const placeUrl = 'https://api.foursquare.com/v3/places/search?near='; // url to GET the place
const placeImgUrl = 'https://api.foursquare.com/v3/places/' // url for to GET the photo

// OpenWeather Info
const openWeatherKey = process.env.openWeatherKey;
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// page query elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $placeDivs = [$("#place1"), $("#place2"), $("#place3"), $("#place4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Foursquare request params

const FoursquareParams = {
  method: 'GET',
  headers: {
    Authorization: foursquareKey,
    Accept: 'application/json',
  }
};

// GET request to Foursquare

const getPlaces = async () => {
  const city = $input.val();
  const urlEndpoint = `${placeUrl}${city}&limit=10`;
  try {
    const response = await fetch(urlEndpoint, FoursquareParams);
    if (response.ok) {
      const jsonResponse = await response.json();
      const places = jsonResponse.results;
      // console.log(places[0].fsq_id)
      return places
    }
  }
  catch(error) {
    console.log(error)
  }
}

// GET request to OpenWeather

const getForecast = async () => {
  const urlToFetch = `${weatherUrl}?q=${$input.val()}&appid=${openWeatherKey}`;
  console.log(urlToFetch)
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    }
  }
  catch(error) {
    console.log(error)
  }
};

// GET async request to Foursquare to get place image

const getImage = async (placeId, place) => {
  const endPoint = `${placeImgUrl}${placeId}/photos?limit=5&sort=POPULAR`;
  try {
    const response = await fetch(endPoint, FoursquareParams);
    if (response.ok) {
      const jsonResponse = await response.json();
      const link = renderPhoto(jsonResponse[0]);
      console.log(process.env.foursquareKey)
      return place.append(createImageHTML(link))
    }
  }
  catch(error) {
    console.log(error);
  }
}

// Version 1. fetch API request to Foursquare

// const getImage = (placeId, place) => {
//  fetch(`${placeImgUrl}${placeId}/photos?limit=5&sort=POPULAR`, FoursquareParams)
//   .then(response => response.json())
//   .then(response => response[0])
//   .then(firstObject => renderPhoto(firstObject))
//   .then(link => place.append(createImageHTML(link)))
//   .catch(err => console.error(err));
// }

// Creating photo link from place object

const renderPhoto = (photo) => {
  return (`${photo.prefix}original${photo.suffix}`)
}

const renderPlaces = (places) => {
  $placeDivs.forEach(($place, index) => {
    const place = places[index];
    const placeIcon = place.categories[0].icon;
    const placeImgSource = `${placeIcon.prefix}bg_64${placeIcon.suffix}`;
    const placeId = place.fsq_id;
    getImage(placeId, $place);
    const placeContent = createPlaceHTML(place.name, place.location, placeImgSource)
    $place.append(placeContent);
  })
  $destination.append(`<h2>${places[0].location.locality}</h2>`)
}
  
const renderForecast = (forecast) => {
  const weatherContent = createWeatherHTML(forecast);
  $weatherDiv.append(weatherContent);
};

const executeSearch = () => {
  $placeDivs.forEach(place => place.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getPlaces().then(places => renderPlaces(places))
  getForecast().then(forecast => renderForecast(forecast));
  return false;
}

$submit.click(executeSearch);