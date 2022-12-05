"use strict";

mapboxgl.accessToken = mapBoxKey;
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 10,
    center: [-106.2609, 31.6914]
});

geocode("El Paso, TX", mapBoxKey).then(function(result) {
    map.setCenter(result);
    map.setZoom(10);
});

/////////////////////////////////DRAG MARKER SECTION///////////////////////////////////////
// Got draggable marker from https://docs.mapbox.com/mapbox-gl-js/example/drag-a-marker/
// This is the default location of marker
let marker = new mapboxgl.Marker({
    draggable: true
}).setLngLat([-106.4411, 31.7867]).addTo(map);

// This will get the new coordinates from the drag and drop
// and execute the function that will update the weather
function onDragEnd() {
    marker.setLngLat(marker.getLngLat()).addTo(map);
    console.log(marker.getLngLat());
    let markerCoords = [marker.getLngLat().lng, marker.getLngLat().lat]
    getWeather(markerCoords)
}
marker.on('dragend', onDragEnd);


/////////////////////////////////MAP CREATION SECTION///////////////////////////////////////
$.get("http://api.openweathermap.org/data/2.5/weather", {
    APPID: weatherMapKey,
    q:     "El Paso, TX, US",
    units: "imperial"
})


////////////////FORECAST/HTML AUTO-POPULATE/RE-EXECUTE FUNCTION//////////////////////////////////
let weatherCards = $("#weather-cards");
function getWeather(coords) {
    $.get("http://api.openweathermap.org/data/2.5/forecast", {
        APPID: weatherMapKey,
        lat: coords[1],
        lon: coords[0],
        units: "imperial"
    }).done(function (data) {
        let reports = data.list;
        let html = "";
        //modeled for loop after Paul Wagner's
        for(let i = 0; i < reports.length; i += 8){
            let cardHeader = reports[i].dt_txt.split(" ");
            let tempMax = reports[i].main.temp_max;
            let tempLow = reports[i].main.temp_min;
            let iconCode = reports[i].weather[0].icon;
            let weatherType = reports[i].weather[0].description;
            let humidity = reports[i].main.humidity;
            let windSpeed = reports[i].wind.speed;
            let pressure = reports[i].main.pressure;

            html +=
                '<div class="card col" style="width: 18rem;">' +
                    '<div class="card-header text-center">' + cardHeader[0] + '</div>' +
                        '<ul class="list-group list-group-flush">' +
                            '<li class="list-group-item text-center"><span><b>' + tempMax + '&#8457' + '</b> / <b>' + tempLow + '&#8457' + '</b></span><br><img src="https://openweathermap.org/img/w/' + iconCode + '.png" alt="Weather Icon"></li>' +
                            '<li class="list-group-item text-left"><span>Description: <b>' + weatherType + '</b></span><br></span>Humididty: <b>' + humidity + '%</b></span></li>' +
                            '<li class="list-group-item text-left">Wind Speed: <b>' + windSpeed + ' mph</b></li>' +
                            '<li class="list-group-item text-left">Pressure: <b>' + pressure + ' psi</b></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>'
        }
        weatherCards.html(html)
    });
}

/////////////////////////////////START POINT CREATION///////////////////////////////////////
let coords = [-106.4411, 31.7867];
getWeather(coords);