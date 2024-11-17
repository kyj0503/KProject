const mapContainer = document.getElementById('map');
const mapOption = {
    center: new kakao.maps.LatLng(37.273629699499, 127.12928668205), // 초기 지도 중심
    level: 3
};

const map = new kakao.maps.Map(mapContainer, mapOption);
const geocoder = new kakao.maps.services.Geocoder();
let startCoords = null;
let endCoords = null;
let startMarker = null; // 출발지 마커
let endMarker = null;   // 도착지 마커

// 현재 위치 버튼 클릭
document.getElementById('current-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const currentPosition = new kakao.maps.LatLng(lat, lng);

            // 현재 위치를 지도 중심으로 설정
            map.setCenter(currentPosition);

            // 출발지 입력란에 현재 위치를 자동으로 설정
            geocoder.coord2Address(lng, lat, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    const address = result[0].address.address_name; // 주소 가져오기
                    document.getElementById('start-input').value = address; // 출발지 입력란에 설정
                    startCoords = currentPosition; // 현재 위치 저장

                    // 기존 출발지 마커가 있다면 제거
                    if (startMarker) {
                        startMarker.setMap(null);
                    }

                    // 출발지 마커 생성
                    startMarker = new kakao.maps.Marker({
                        position: startCoords,
                        map: map
                    });

                    alert("현재 위치가 출발지로 설정되었습니다.");
                } else {
                    alert("주소를 가져오는 데 실패했습니다.");
                }
            });
        }, () => {
            alert("현재 위치를 가져오는 데 실패했습니다.");
        });
    } else {
        alert("이 브라우저는 Geolocation을 지원하지 않습니다.");
    }
});

// 출발지 설정
document.getElementById('start-location').addEventListener('click', () => {
    const startAddress = document.getElementById('start-input').value;
    geocoder.addressSearch(startAddress, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const newStartCoords = new kakao.maps.LatLng(result[0].y, result[0].x);
            map.setCenter(newStartCoords);

            // 기존 출발지 마커가 있다면 제거
            if (startMarker) {
                startMarker.setMap(null);
            }

            // 출발지 마커 생성
            startMarker = new kakao.maps.Marker({
                position: newStartCoords,
                map: map
            });

            // 출발지 좌표 저장
            startCoords = newStartCoords;
            alert("출발지가 설정되었습니다.");
        } else {
            alert("출발지 설정에 실패했습니다.");
        }
    });
});

// 도착지 설정
document.getElementById('destination').addEventListener('click', () => {
    const endAddress = document.getElementById('destination-input').value;
    geocoder.addressSearch(endAddress, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            endCoords = new kakao.maps.LatLng(result[0].y, result[0].x);
            map.setCenter(endCoords);

            // 기존 도착지 마커가 있다면 제거
            if (endMarker) {
                endMarker.setMap(null);
            }

            // 도착지 마커 생성
            endMarker = new kakao.maps.Marker({
                position: endCoords,
                map: map
            });

            alert("도착지가 설정되었습니다.");
        } else {
            alert("도착지 설정에 실패했습니다.");
        }
    });
});

// 경로 탐색 버튼 클릭
document.getElementById('find-route').addEventListener('click', () => {
    if (!startCoords || !endCoords) {
        alert("출발지와 도착지를 모두 설정하세요.");
        return;
    }

    const origin = `${startCoords.getLng()},${startCoords.getLat()}`;
    const destination = `${endCoords.getLng()},${endCoords.getLat()}`;

    fetch(`https://apis.kakao.com/v1/map/directions?origin=${origin}&destination=${destination}&priority=RECOMMEND`, {
        method: 'GET',
        headers: {
            'Authorization': 'KakaoAK abcd1234efgh5678ijkl', // 실제 REST API 키로 변경
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            handleRouteResponse(data); // 경로 응답 처리
        })
        .catch(error => {
            console.error('길찾기 API 호출 실패:', error);
            alert('자동차 길찾기 API 호출 중 문제가 발생했습니다: ' + error.message);
        });
});

// 경로 응답 처리 함수
function handleRouteResponse(data) {
    if (!data || !data.routes || data.routes.length === 0) {
        alert("유효한 경로를 찾을 수 없습니다.");
        return;
    }

    const route = data.routes[0];
    const path = [];
    const roads = route.sections[0].roads;

    roads.forEach(road => {
        for (let i = 0; i < road.vertexes.length; i += 2) {
            const lng = road.vertexes[i];
            const lat = road.vertexes[i + 1];
            path.push(new kakao.maps.LatLng(lat, lng));
        }
    });

    const polyline = new kakao.maps.Polyline({
        path: path,
        strokeWeight: 5,
        strokeColor: '#0000FF',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
    });
    polyline.setMap(map);

    const distance = route.summary.distance;
    const duration = route.summary.duration;
    alert(`최단 거리: ${(distance / 1000).toFixed(2)} km, 예상 소요 시간: ${(duration / 60).toFixed(1)} 분`);
}