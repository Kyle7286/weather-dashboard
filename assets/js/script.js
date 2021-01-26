// Example API cals: api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
// Example: api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}


// Global Declarations
var searchBox = $("#search-value");



// On Search Click...
$("#search-button").click(function (e) {
    e.preventDefault();
    // Clear contents of searchbox
    getCurrentWeather(searchBox.val());
    searchBox.val("");
  
});

function getCurrentWeather(city) {
    var apiKey = "&appid=653447e5538dcc45b8534eb1e5c601c3";
    var cityName = city
    var units = "&units=imperial"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + units + apiKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

    });


}

function displayCurrentWeather() {

}