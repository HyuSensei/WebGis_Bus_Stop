var centerCoordinates = ol.proj.fromLonLat([105.7621, 21.0268]);
var zoomLevel = 15;

var mapView = new ol.View({
  center: centerCoordinates,
  zoom: zoomLevel,
});

var map = new ol.Map({
  target: "map",
  view: mapView,
});

var osmTitle = new ol.layer.Tile({
  title: "Open Street Map",
  visible: true,
  source: new ol.source.OSM(),
});

map.addLayer(osmTitle);

// Click map
var startPoint = new ol.Feature();
var destPoint = new ol.Feature();
var vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [startPoint, destPoint],
  }),
});
map.addLayer(vectorLayer);

// Layer vector để vẽ đường
// var vectorLayer = new ol.layer.Vector({
//   source: new ol.source.Vector(),
// });
// map.addLayer(vectorLayer);

// var vectorSource = new ol.source.Vector();

// Tạo layer vector với source vừa tạo
// var vectorLayer = new ol.layer.Vector({
//   source: vectorSource,
// });
// map.addLayer(vectorLayer);

// Thêm đối tượng đường vào source của layer vector
// var routeFeature = new ol.Feature({
//   geometry: new ol.geom.LineString([
//     ol.proj.fromLonLat([105.770461, 21.033336]),
//     ol.proj.fromLonLat([105.770176, 21.033392]),
//     ol.proj.fromLonLat([105.769925, 21.033447]),
//     ol.proj.fromLonLat([105.769776, 21.03348]),
//     ol.proj.fromLonLat([105.769751, 21.033367]),
//     ol.proj.fromLonLat([105.769897, 21.033333]),
//     ol.proj.fromLonLat([105.770169, 21.033266]),
//     ol.proj.fromLonLat([105.770229, 21.033254]),
//     ol.proj.fromLonLat([105.770436, 21.033211]),
//     ol.proj.fromLonLat([105.77073, 21.033153]),
//   ]),
// });

// Style cho dòng (line)
// var lineStyle = new ol.style.Style({
//   stroke: new ol.style.Stroke({
//     color: "blue",
//     width: 3,
//   }),
// });

// routeFeature.setStyle(lineStyle);
// vectorSource.addFeature(routeFeature);

// Tạo biểu tượng cho điểm đầu
var startIconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 1],
    src: "./resources/start2.png", // Đường dẫn đến file biểu tượng
    scale: 0.1, // Tùy chọn: Thay đổi kích thước biểu tượng
  }),
});

// Tạo biểu tượng cho điểm đến
var destIconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 1],
    src: "./resources/end3.png", // Đường dẫn đến file biểu tượng
    scale: 0.07, // Tùy chọn: Thay đổi kích thước biểu tượng
  }),
});

map.on("singleclick", function (evt) {
  if (startPoint.getGeometry() == null) {
    startPoint.setGeometry(new ol.geom.Point(evt.coordinate));
    var startCoord = startPoint.getGeometry().getCoordinates();
    var startCoord4326 = ol.proj.toLonLat(startCoord, "EPSG:3857");
    $("#txtPoint1").val(startCoord4326);
    // Thêm điểm đầu vào layer vector với biểu tượng
    var startFeature = new ol.Feature({
      geometry: new ol.geom.Point(startCoord),
    });
    startFeature.setStyle(startIconStyle);
    vectorLayer.getSource().addFeature(startFeature);
  } else if (destPoint.getGeometry() == null) {
    destPoint.setGeometry(new ol.geom.Point(evt.coordinate));
    var destCoord = destPoint.getGeometry().getCoordinates();
    var destCoord4326 = ol.proj.toLonLat(destCoord, "EPSG:3857");
    $("#txtPoint2").val(destCoord4326);
    // Thêm điểm đến vào layer vector với biểu tượng
    var destFeature = new ol.Feature({
      geometry: new ol.geom.Point(destCoord),
    });
    destFeature.setStyle(destIconStyle);
    vectorLayer.getSource().addFeature(destFeature);
  }
});

// Call api tìm đường
$("#btnSolve").click(function () {
  var startCoord = startPoint.getGeometry().getCoordinates();
  var destCoord = destPoint.getGeometry().getCoordinates();
  var startCoord4326 = ol.proj.toLonLat(startCoord, "EPSG:3857");
  var destCoord4326 = ol.proj.toLonLat(destCoord, "EPSG:3857");
  console.log("Start Coord (EPSG:4326): ", startCoord4326);
  console.log("Dest Coord (EPSG:4326): ", destCoord4326);
  var apiKey = "5b3ce3597851110001cf6248564bffb8a4b14809bf9db8066135fa6f";
  var url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoord4326}&end=${destCoord4326}`;
  console.log(url);
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayRoute(data);
      //console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching route:", error);
    });
  function displayRoute(routeData) {
    var routeCoordinates = routeData.features[0].geometry.coordinates;
    //console.log(routeData.features[0].geometry.coordinates);
    //console.log(routeCoordinates[0]);
    let arr_routeCoordinates = [];
    for (let i = 0; i < routeCoordinates.length; i++) {
      arr_routeCoordinates.push(ol.proj.fromLonLat(routeCoordinates[i]));
      //console.log(ol.proj.fromLonLat(routeCoordinates[i]));
    }
    console.log("List:", arr_routeCoordinates);
    var routeVectorSource = new ol.source.Vector();
    var routeVectorLayer = new ol.layer.Vector({
      source: routeVectorSource,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "#01bacf",
          width: 8,
        }),
      }),
    });

    var routeFeature = new ol.Feature({
      geometry: new ol.geom.LineString(arr_routeCoordinates),
    });

    routeVectorSource.addFeature(routeFeature);
    map.addLayer(routeVectorLayer);
    // Reset tìm đương
    document.getElementById("btnReset").addEventListener("click", function () {
      document.getElementById("txtPoint1").value = "";
      document.getElementById("txtPoint2").value = "";
      startPoint.setGeometry(null);
      destPoint.setGeometry(null);
      //map.removeLayer(routeVectorLayer);
      var vectorSource = vectorLayer.getSource();
      vectorSource.clear();
    });
  }
});

// $("#btnReset").click(function () {
//   startPoint.setGeometry(null);
//   destPoint.setGeometry(null);
//   map.removeLayer(result);
// });

// var totalMap = new ol.layer.Tile({
//   title: "Xung quanh Đại Học Điện Lực",
//   source: new ol.source.TileWMS({
//     url: "http://localhost:8080/geoserver/Bus_Stop/wms",
//     params: { LAYERS: "Bus_Stop:roads", TILED: true },
//     serverType: "geoserver",
//     visible: true,
//   }),
// });
// map.addLayer(totalMap);

var busStop = new ol.layer.Tile({
  title: "Trạm xe bus xung quanh Đại Học Điện Lực",
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/Bus_Stop/wms",
    params: { LAYERS: "	Bus_Stop:bus_point", TILED: true },
    serverType: "geoserver",
    visible: true,
  }),
});
map.addLayer(busStop);

// Control layer
var layerSwitcher = new ol.control.LayerSwitcher({
  activationMode: "click",
  startActive: false,
  groupSelectStyle: "children",
});
map.addControl(layerSwitcher);

// Live search bus stop
$(document).ready(function () {
  $("#search-input").on("input", function () {
    var searchValue = $(this).val();
    if (searchValue.trim() !== "") {
      console.log(searchValue);
      $.ajax({
        url: "./handle/live_search.php",
        method: "GET",
        data: { name: searchValue },
        success: function (response) {
          console.log("Res: ", response);
          displaySearchResults(response);
        },
        error: function (error) {
          console.error("Lỗi khi gửi yêu cầu tìm kiếm:", error);
        },
      });
    }
  });

  displaySearchResults = (results) => {
    var searchResultsElement = $("#search-results");
    searchResultsElement.empty();
    if (results.length > 0) {
      var searchResults = JSON.parse(results);
      console.log("Data", searchResults);
      searchResults.forEach(function (result) {
        var resultItem = $("<div>").text(result.name);
        var viewButton = $("<button>").text("Xem ngay");
        resultItem.css({
          "margin-top": "20px",
          "margin-bottom": "20px",
          "margin-left": "10px",
        });
        viewButton.css({
          "margin-left": "20px",
        });
        viewButton.addClass("btn btn-success");
        viewButton.click(function () {
          var centerCoordinates = ol.proj.fromLonLat([
            result.longitude,
            result.latitude,
          ]);
          mapView.animate({
            center: centerCoordinates,
            duration: 2000,
            zoom: 20,
          });
        });
        resultItem.append(viewButton);
        searchResultsElement.append(resultItem);
        searchResultsElement.append(resultItem);
      });
    } else {
      var noResultsMessage = $("<div>").text("Không tìm thấy kết quả");
      searchResultsElement.append(noResultsMessage);
    }
  };
});

// Reset tìm kiếm
document
  .getElementById("clear-input-button")
  .addEventListener("click", function () {
    document.getElementById("search-input").value = "";
  });
