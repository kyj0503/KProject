var keyword = document.getElementById('keyword-data').value;
var mapContainer = document.getElementById('map');
var mapOption = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 3
};

var map = new kakao.maps.Map(mapContainer, mapOption);
var ps = new kakao.maps.services.Places();
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
var markers = [];

function setMapCenterByUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLocation = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(userLocation);
            searchPlaces(userLocation);
        }, function() {
            searchPlaces(map.getCenter());
        });
    } else {
        searchPlaces(map.getCenter());
    }
}

function searchPlaces(location) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    ps.keywordSearch(keyword, placesSearchCB, { location: location, radius: 5000 });
}

function placesSearchCB(data, status) {
    if (status === kakao.maps.services.Status.OK) {
        data.forEach(displayMarker);
    }
}

function displayMarker(place) {
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x)
    });
    markers.push(marker);

    var infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">
                    ${place.place_name}
                    <button onclick="showReviewForm('${place.id}')">리뷰 남기기</button>
                  </div>`
    });

    kakao.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
}

setMapCenterByUserLocation();
