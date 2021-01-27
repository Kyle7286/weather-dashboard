// Example API cals: api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
// Example: api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}


// Global Declarations
var apiKey = "&appid=653447e5538dcc45b8534eb1e5c601c3";

// Display the history on page load
var aHistory = displayHistory();


// On Search Click...
$("#search-button").click(function (e) {
    e.preventDefault();
    var city = $("#search-value").val();

    // Call the current weather function to call the API and build the HTML
    getCurrentWeather(city);

    // Clear contents of searchbox
    $("#search-value").val();

    // Clear contents of today div
    $("#today").empty();

});


// Display History
function displayHistory() {
    // Check for local storage, if empty, return empty array, if not, build list items and append 
    if (localStorage.getItem("history") === null) {
        array = [];
        return array;
    } else {
        // read local storage array
        array = JSON.parse(localStorage.getItem("history"));

        for (let i = 0; i < array.length; i++) {
            var btn = $("<button>").text(array[i]).attr("class", "btn history-button");
            var li = $("<li>").html(btn);
            $("#history-list").append(li);
            console.log(array[i]);
        }

        return array;

    }
}


// Write to local storage, as long as it doesnt exist already
function setHistory(array, city) {
    var pCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    if (array.indexOf(pCity) === -1) {
        array.push(pCity);

        // Save to local storage
        localStorage.setItem("history", JSON.stringify(array));
        // console.log(aray);
        return array
    }

}

// Create the Current Weather elements
function getCurrentWeather(city) {
    var cityName = city
    var units = "&units=imperial"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + units + apiKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Log the object for navigating
        // console.log(response);
        console.log("GETCCURRENT WEATHER");
        console.log(aHistory);
        // Save the city to local storage
        setHistory(aHistory, city);

        // Get date value from openweather, convert to JS date format
        var currentDate = (response.dt * 1000);
        var d = new Date(currentDate)
        var dateString = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();

        // Grab the data we need to display
        var name = response.name;
        var currentTemp = response.main.temp;
        var currentHumidity = response.main.humidity;
        var currentWindSpeed = response.wind.speed;
        var currentIcon = response.weather[0].icon;

        // Create Card
        var divCard = $("<div>").attr({ class: "card", id: "today-card" });
        var divCardBody = $("<div>").attr({ class: "card-body", id: "today-card-body" }).appendTo(divCard);
        var iconURL = "http://openweathermap.org/img/w/" + currentIcon + ".png"

        // Create card elements
        $("<h3>").text(name + " (" + dateString + ")").appendTo(divCardBody).append($("<img>").attr({ id: "wicon", alt: "Weather Icon" }).attr("src", iconURL));
        $("<p>").text("Temperature: " + currentTemp + " °F").appendTo(divCardBody);
        $("<p>").text("Humidity: " + currentHumidity + "%").appendTo(divCardBody);
        $("<p>").text("Wind Speed: " + currentWindSpeed + "MPH").appendTo(divCardBody);

        // Append final card to page
        $("#today").append(divCard);

        // Grab Lon & lat values for index call
        var lon = response.coord.lon;
        var lat = response.coord.lat;

        // Get UvIndex
        getUVIndex(lon, lat);

        // Get 5-day Forecast Function
    });


}

// Create the UV Index Element and append to today card
function getUVIndex(lon, lat) {
    // Example URL: http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Grab the data we need to display
        var index = Math.round(response.value);

        // Create UV Text and button (color coded) based on lvl of index
        $("<p>").text("UV: ").attr("class", "d-inline").appendTo($("#today-card-body"));
        var uvBtn = $("<button>").text(index).attr("class", "btn-sm").attr("disabled", "").css("color", "white").appendTo($("#today-card-body"))
        if (index <= 2) { uvBtn.addClass("btn-success"); }
        else if (index <= 5 && index >= 3) { uvBtn.css({ "background-color": "yellow", "color": "black" }); }
        else if (index <= 7 && index >= 6) { uvBtn.addClass("btn-warning"); }
        else if (index <= 10 && index >= 8) { uvBtn.addClass("btn-danger"); }
        else if (index >= 11) { uvBtn.css("background-color", "purple"); }
    });
}