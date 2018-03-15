var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

var lightMap = L. tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3hpbnlhIiwiYSI6ImNqZWJqbm0zeTBnY3EzM2xhcm91azdtcGcifQ.rfktYWT46PQAmnNV0qhDAw")

var earthquakes = new L.layerGroup();

// Default map
var map = L.map("map", {
    center: [
      39.5, -98.35
    ],
    zoom: 3,
    layers: [lightMap, earthquakes]
});

// GET request

d3.json(queryUrl, function(response) {

    function styleData(feature) {
        return {
            stroke: true,
            color: "black",
            weight: .25,
            fillOpacity: .7,
            fillColor: getColor(feature.properties.mag),
            radius: feature.properties.mag * 2
        };
    }

    // Color based on earthquake magnitude scale
    function getColor(mag) {
        return mag > 8 ? "#C90D1A":
               mag > 7 ? "#DA3B18":
               mag > 6.1 ? "#D76A14":
               mag > 5.5 ? "#D49910":
               mag > 2.5 ? "#D1C80C":
                           "#CEF708";
    }

    L.geoJSON(response, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleData,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
        "</h3>" + new Date(feature.properties.time));
        }
    }).addTo(earthquakes)
    earthquakes.addTo(map)
})

// Legend

var legend = L.control({position: "bottomright"});

legend.onAdd = function(map) {

    var legendDiv = L.DomUtil.create('div', 'info legend'),
    grades = [2,3,4,5,6,7],
    labels = ["Minor","Light","Moderate","Strong","Major","Great"];

    for (var i = 0; i < grades.length; i++) {
        legendDiv.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          labels[i] + '<br>' ;
    }

    return legendDiv;
};

function getColor(mag) {
    return mag >= 8 ? "#C90D1A":
           mag >= 7 ? "#DA3B18":
           mag >= 6 ? "#D76A14":
           mag >= 5 ? "#D49910":
           mag >= 4 ? "#D1C80C":
                      "#CEF708";
    }

legend.addTo(map);