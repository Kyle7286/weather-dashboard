// Example API cals: api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
// Example: api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}


// Global Declarations
var searchBox = $("#search-value");



// On Search Click...
$("#search-button").click(function (e) {
    e.preventDefault();

    // Call the current weather function to call the API and build the HTML
    getCurrentWeather(searchBox.val());
    
    // Clear contents of searchbox
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
        var date = "?" // Need luxon
        var name = response.main.name;
        var currentTemp = response.main.temp;
        var currentHumidity = response.main.humidity;
        var currentWindSpeed = response.wind.speed;
        var currentUVIndex = "?";
        var currentIcon = response.weather[0].icon;
        
        
        console.log(currentIcon);

    });


}

function displayCurrentWeather() {

}