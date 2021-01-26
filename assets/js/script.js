// Example API cals: api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
// Example: api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}


// Global Declarations
var apiKey = "&appid=653447e5538dcc45b8534eb1e5c601c3";

// On Search Click...
$("#search-button").click(function (e) {
    e.preventDefault();

    // Call the current weather function to call the API and build the HTML
    getCurrentWeather($("#search-value").val());

    // Clear contents of searchbox
    $("#search-value").val("");

});

function getCurrentWeather(city) {
    var cityName = city
    var units = "&units=imperial"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + units + apiKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Log the object for navigating
        console.log(response);

        // Grab the data we need to display
        var currentDate = response.dt; // Need luxon
        var name = response.name;
        var currentTemp = response.main.temp;
        var currentHumidity = response.main.humidity;
        var currentWindSpeed = response.wind.speed;
        var currentIcon = response.weather[0].icon;

        // Create Card
        var divCard = $("<div>").attr({ class: "card", id: "today-card" });
        var divCardBody = $("<div>").attr({ class: "card-body", id: "today-card-body" }).appendTo(divCard);
        var iconURL = "http://openweathermap.org/img/w/" + currentIcon + ".png"
        console.log(iconURL);

        // Create card elements
        $("<h3>").text(name + " " + currentDate).appendTo(divCardBody).append($("<img>").attr({ id: "wicon", alt: "Weather Icon" }).attr("src", iconURL));
        $("<p>").text("Temperature: " + currentTemp + " °F").appendTo(divCardBody);
        $("<p>").text("Humidity: " + currentHumidity + "%").appendTo(divCardBody);
        $("<p>").text("Wind Speed: " + currentWindSpeed + "MPH").appendTo(divCardBody);




        // Append final card to page
        $("#today").append(divCard);







        // Grab Lon & lat values for index call
        var lon = response.coord.lon;
        var lat = response.coord.lat;

        // Get UvIndex function
        getUVIndex(lon, lat);

        // Get 5-day Forecast Function


    });


}

function getUVIndex(lon, lat) {
    // Example URL: http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + apiKey;
    var index = "";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Log the object for navigating
        console.log(response);

        // Grab the data we need to display
        index = response.value;
        console.log(index);
    });
}