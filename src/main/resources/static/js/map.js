document.addEventListener("DOMContentLoaded", function () {
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

    // 지도 이동이 완료되면 발생하는 이벤트 리스너
    kakao.maps.event.addListener(map, 'idle', function () {
        var center = map.getCenter(); // 현재 지도의 중심 좌표 가져오기
        searchPlaces(center); // 중심 좌표를 기준으로 장소 검색
    });

    // 장소 검색
    function searchPlaces(location) {
        // 기존 마커 제거
        markers.forEach(marker => marker.setMap(null));
        markers = [];

        // 키워드와 위치를 기반으로 장소 검색
        ps.keywordSearch(keyword, placesSearchCB, { location: location, radius: 5000 });
    }

    // 검색 결과 처리 콜백 함수
    function placesSearchCB(data, status) {
        if (status === kakao.maps.services.Status.OK) {
            data.forEach(displayMarker);
        } else {
            console.error("검색 결과가 없습니다.");
        }
    }

    // 마커 표시 및 인포윈도우 설정
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

        kakao.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
    }

    // 초기 로딩 시 현재 위치로 지도 중심 설정
    setMapCenterByUserLocation();

    // 사용자의 현재 위치로 지도 중심 설정
    function setMapCenterByUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var userLocation = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(userLocation);
            }, function () {
                alert("위치 정보를 가져올 수 없습니다.");
            });
        } else {
            alert("Geolocation을 지원하지 않는 브라우저입니다.");
        }
    }

    // "현재 위치" 버튼을 클릭하여 지도 중심 좌표를 표시하는 함수
    window.displayMapCenter = function () {
        var center = map.getCenter(); // 지도 중심 좌표 가져오기
        var homeDisplay = document.getElementById("home-display");

        // 홈 영역에 지도 중심 좌표 출력
        homeDisplay.innerText = "현재 지도 중심 좌표:\n위도: " + center.getLat().toFixed(6) + ", 경도: " + center.getLng().toFixed(6);
    }
});

// 경로 탐색 기능 추가 < 윤상
document.addEventListener("DOMContentLoaded", function () {
    const mapContainer = document.getElementById('map');
    const mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 초기 중심 좌표
        level: 3 // 확대 레벨
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);
    const markers = [];
    const directionsUrl = "https://apis-navi.kakaomobility.com/v1/directions";

    // REST API Key
    const REST_API_KEY = "YOUR_REST_API_KEY";

    // 사용자 위치로 지도 중심 설정
    setMapCenterByUserLocation();

    window.setMapCenterByUserLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const userLocation = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(userLocation);
            }, function () {
                alert("위치 정보를 가져올 수 없습니다.");
            });
        } else {
            alert("Geolocation을 지원하지 않는 브라우저입니다.");
        }
    };

    // 경로 탐색
    window.findRoute = async function () {
        const startAddress = document.getElementById('start').value;
        const endAddress = document.getElementById('end').value;

        if (!startAddress || !endAddress) {
            alert("출발지와 도착지를 입력하세요.");
            return;
        }

        try {
            // 출발지와 도착지 주소를 좌표로 변환
            const startCoords = await getCoordsFromAddress(startAddress);
            const endCoords = await getCoordsFromAddress(endAddress);

            // 경로 API 호출
            const route = await getRoute(startCoords, endCoords);

            if (route) {
                displayRoute(route);
            } else {
                alert("경로를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("경로 탐색 중 문제가 발생했습니다.");
        }
    };

    // 주소를 좌표로 변환
    async function getCoordsFromAddress(address) {
        return new Promise((resolve, reject) => {
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                    resolve(coords);
                } else {
                    reject("주소 변환 실패");
                }
            });
        });
    }

    // 경로 데이터를 REST API로 가져오기
    async function getRoute(start, end) {
        const response = await fetch(directionsUrl, {
            method: "GET",
            headers: {
                Authorization: `KakaoAK ${REST_API_KEY}`
            },
            params: {
                origin: `${start.getLng()},${start.getLat()}`,
                destination: `${end.getLng()},${end.getLat()}`,
                waypoints: "",
                priority: "RECOMMEND"
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.routes[0]; // 첫 번째 경로 반환
        } else {
            throw new Error("경로 데이터를 가져오는 데 실패했습니다.");
        }
    }

    // 경로를 지도에 표시
    function displayRoute(route) {
        const linePath = route.sections.flatMap(section =>
            section.roads.map(road => new kakao.maps.LatLng(road.latitude, road.longitude))
        );

        // 기존 마커와 경로 제거
        markers.forEach(marker => marker.setMap(null));
        markers.length = 0;

        const polyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 5,
            strokeColor: '#0000ff',
            strokeOpacity: 0.8,
            map: map
        });

        polyline.setMap(map);

        // 지도 중심과 확대 레벨 조정
        const bounds = new kakao.maps.LatLngBounds();
        linePath.forEach(coord => bounds.extend(coord));
        map.setBounds(bounds);
    }
});
