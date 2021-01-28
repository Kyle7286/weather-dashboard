// Global Declarations
var apiKey = "&appid=653447e5538dcc45b8534eb1e5c601c3";

// Display the history on page load
displayHistory();

// On Search Click...
$("#search-button").click(function (e) {
    e.preventDefault();
    // If there's a value, then run the function, else do nothing
    if ($("#search-value").val() !== "") {
        var city = $("#search-value").val();

        // Clear search box
        $("#search-value").val("");

        // Call the current weather function to call the API and build the HTML
        getCurrentWeather(city);
    }
});


// Display History
function displayHistory() {
    var array = getStorage();
    $("#history-list").empty();

    if (array) {
        $.each(array, function (i, item) {

            var units = "&units=imperial"
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + item + units + apiKey

            // Create button
            var btn = $("<button>").text(item).attr("class", "btn history-button");
            var li = $("<li>").html(btn);
            $("#history-list").append(li);



            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                // Grab City Name
                var cityName = response.name;

                // Grab and build ICON URL
                var currentIcon = response.weather[0].icon;
                var iconURL = "https://openweathermap.org/img/w/" + currentIcon + ".png";

                // Attach the image to the list item
                var img = $("<img>").attr("src", iconURL);
                img.appendTo($(li));
            });
        });

        // Add the click listeners for the buttons
        addHistoryListener();
    }
}
// Add button lister for history
function addHistoryListener() {
    // History Button click
    $(".history-button").click(function () {
        // Clear search box
        $("#search-value").val("");

        // Run the weather functions of this city 
        getCurrentWeather($(this).text());
    });
}

// returns an Array of storage contents
function getStorage() {
    var array = [];

    // Check for local storage, if empty, return empty array, if not, build list items and append 
    if (localStorage.getItem("history") === null) {
        return array;
    } else {
        // read local storage array
        array = JSON.parse(localStorage.getItem("history"));
        return array;
    }
}

// Write to local storage, as long as it doesnt exist already
function setHistory(city) {

    var array = getStorage();

    if (array.indexOf(city) === -1) {
        array.push(city);
        // Save to local storage
        localStorage.setItem("history", JSON.stringify(array));
    }
}

// Clear History
$("#clear-button").click(function (e) {
    e.preventDefault();
    // Clear history
    $("#history-list").empty();

    // Clear storage
    localStorage.clear();
})

// Create the Current Weather elements
function getCurrentWeather(city) {
    var cityName = city
    var units = "&units=imperial"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + units + apiKey;

    // Clear contents of searchbox
    $("#search-value").val();

    // Clear contents of today div
    $("#today").empty();

    $.ajax({
        url: queryURL,
        method: "GET",
        error: function (err) {
            $("#forecast-div").empty();
        }
    }).then(function (response) {

        // Set the History
        setHistory(response.name);
        // Display History
        displayHistory();

        // Get date value from openweather, convert to JS date format
        var currentDate = (response.dt * 1000);
        var d = new Date(currentDate);
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
        var iconURL = "https://openweathermap.org/img/w/" + currentIcon + ".png"

        // Create card elements
        $("<h3>").text(name + " (" + dateString + ")").appendTo(divCardBody).append($("<img>").attr({ id: "wicon", alt: "Weather Icon" }).attr("src", iconURL));
        $("<p>").text("Temperature: " + Math.round(currentTemp) + " °F").appendTo(divCardBody);
        $("<p>").text("Humidity: " + currentHumidity + "%").appendTo(divCardBody);
        $("<p>").text("Wind Speed: " + Math.round(currentWindSpeed) + " MPH").appendTo(divCardBody);

        // Append final card to page
        $("#today").append(divCard);

        // Grab Lon & lat values for index call
        var lon = response.coord.lon;
        var lat = response.coord.lat;

        // Get UvIndex
        getUVIndex(lon, lat);

        // Get 5-day Forecast Function
        getForecast(cityName);
    });
}

// get foreCast
function getForecast(city) {
    // Example URL: api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
    var units = "&units=imperial"
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + units + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // Grab data
        var aForecastList = response.list;

        // Empty Div
        $("#forecast-div").empty();

        // Headline
        $("<h4>").text("5-Day Forecast").appendTo($("#forecast-div"));

        // Loop thru each forecast list up until 5
        for (let i = 6; i < 40; i += 8) {

            // Grab Data
            var currentObject = aForecastList[i];
            console.log(currentObject);

            // Get the date
            var currentDate = (currentObject.dt * 1000);
            var d = new Date(currentDate)
            var dateString = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
            var currentIconURL = "https://openweathermap.org/img/w/" + currentObject.weather[0].icon + ".png";
            var currentTemp = currentObject.main.temp;
            var currentHumidity = currentObject.main.humidity;

            // Create Forecast button
            var btnForecast = $("<button>").attr("class", "btn-primary d-inline text-start rounded m-2").attr("disabled", "");

            // Create Forecast Elements
            var h6 = $("<h6>").text(dateString);
            var img = $("<img>").attr("src", currentIconURL);
            var pTemp = $("<p>").text("Temperature: " + Math.round(currentTemp) + " °F");
            var pHum = $("<p>").text("Humidity: " + currentHumidity + "%");

            // Append elements to button
            $(btnForecast).append(h6, img, pTemp, pHum);

            // Append button to forecast div
            $("#forecast-div").append(btnForecast);
        }
    });
}

// Create the UV Index Element and append to today card
function getUVIndex(lon, lat) {
    // Example URL: https://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}
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
