## Current Weather
1. Grab current weather from Search box
2. Grab 5 day forecast weather from search box
3. Insert Current weather information into Current Weather Div
4. Insert 5-Day Forecast information into forecast div

## History
1. Click Search
2. Save Search item into an array
    * Only if it doesnt exist
    * Only if there is a successful response from AJAX Current Weather Response
3. Save Contents of Array to local storage
4. Read contents of array into List
    * Loop thru array
    * create a listitem for each index
    * append to list table

## WorkFlow
* On Page load
    1. displayHistory()
* On Search
    *setHistory()
    * displayHistory()

 