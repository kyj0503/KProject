// 지도 초기화 및 기본 설정
const mapContainer = document.getElementById('map');
const mapOption = {
    center: new kakao.maps.LatLng(37.273629699499, 127.12928668205), // 초기 지도 중심
    level: 3
};

const map = new kakao.maps.Map(mapContainer, mapOption);
const geocoder = new kakao.maps.services.Geocoder();
const places = new kakao.maps.services.Places(); // 장소 검색 서비스 초기화
let startCoords = null;
let endCoords = null;
let startMarker = null; // 출발지 마커
let endMarker = null;   // 도착지 마커
let cafeMarkers = [];   // 카페 마커 배열
let activeInfoWindow = null; // 현재 활성화된 InfoWindow

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
                    setMarkerWithInfo(currentPosition, address, "출발지"); // 마커와 정보 표시
                    startCoords = currentPosition; // 현재 위치 저장
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
    const startInput = document.getElementById('start-input').value;

    // 좌표로 입력된 경우 처리
    if (startCoords) {
        setMarkerWithInfo(startCoords, startInput, "출발지");
        alert("출발지가 설정되었습니다.");
        return;
    }

    // 주소로 검색
    geocoder.addressSearch(startInput, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const newStartCoords = new kakao.maps.LatLng(result[0].y, result[0].x);
            map.setCenter(newStartCoords);

            setMarkerWithInfo(newStartCoords, startInput, "출발지");
            startCoords = newStartCoords;
            alert("출발지가 설정되었습니다.");
        } else {
            alert("출발지 설정에 실패했습니다.");
        }
    });
});

// 도착지 설정
document.getElementById('destination').addEventListener('click', () => {
    const destinationInput = document.getElementById('destination-input').value;

    // 좌표로 입력된 경우 처리
    if (endCoords) {
        setMarkerWithInfo(endCoords, destinationInput, "도착지");
        alert("도착지가 설정되었습니다.");
        return;
    }

    // 주소로 검색
    geocoder.addressSearch(destinationInput, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const newEndCoords = new kakao.maps.LatLng(result[0].y, result[0].x);
            map.setCenter(newEndCoords);

            setMarkerWithInfo(newEndCoords, destinationInput, "도착지");
            endCoords = newEndCoords;
            alert("도착지가 설정되었습니다.");
        } else {
            alert("도착지 설정에 실패했습니다.");
        }
    });
});

// 경로 탐색 버튼 동작
document.getElementById('find-route').addEventListener('click', () => {
    if (!startCoords || !endCoords) {
        alert("출발지와 도착지를 모두 설정해주세요.");
        return;
    }

    // Directions API 호출
    const directionsUrl = `https://apis-navi.kakaomobility.com/v1/directions?origin=${startCoords.getLng()},${startCoords.getLat()}&destination=${endCoords.getLng()},${endCoords.getLat()}&priority=shortest`;

    fetch(directionsUrl, {
        method: "GET",
        headers: {
            Authorization: "KakaoAK b4f6b9f34acd35ee9c17e0b581351e5f" // Kakao REST API 키
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const path = route.sections.flatMap(section =>
                    section.roads.flatMap(road =>
                        road.vertexes.map((_, i, arr) =>
                            i % 2 === 0
                                ? new kakao.maps.LatLng(arr[i + 1], arr[i]) // [lat, lng]
                                : null
                        ).filter(Boolean)
                    )
                );

                // 기존 Polyline 제거
                if (routePolyline) {
                    routePolyline.setMap(null);
                }

                // 새 경로 Polyline 생성 및 추가
                routePolyline = new kakao.maps.Polyline({
                    path: path,
                    strokeWeight: 5,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeStyle: "solid",
                    map: map
                });

                // 지도 범위 설정
                const bounds = new kakao.maps.LatLngBounds();
                path.forEach(latlng => bounds.extend(latlng));
                map.setBounds(bounds);

                alert("경로를 성공적으로 표시했습니다.");
            } else {
                alert("경로를 가져오는 데 실패했습니다.");
            }
        })
        .catch(error => {
            console.error("경로 탐색 중 오류:", error);
            alert("경로 탐색 중 문제가 발생했습니다.");
        });
});

// 초기화 버튼 동작
document.getElementById('start-reset').addEventListener('click', () => {
    document.getElementById('start-input').value = ''; // 입력 필드 초기화
    if (startMarker) startMarker.setMap(null); // 마커 제거
    startMarker = null; // 마커 객체 초기화
    startCoords = null; // 좌표 초기화

    if (activeInfoWindow) {
        activeInfoWindow.close(); // 활성화된 정보창 닫기
        activeInfoWindow = null; // 정보창 객체 초기화
    }

    alert("출발지가 초기화되었습니다.");
});

document.getElementById('end-reset').addEventListener('click', () => {
    document.getElementById('destination-input').value = ''; // 입력 필드 초기화
    if (endMarker) endMarker.setMap(null); // 마커 제거
    endMarker = null; // 마커 객체 초기화
    endCoords = null; // 좌표 초기화

    if (activeInfoWindow) {
        activeInfoWindow.close(); // 활성화된 정보창 닫기
        activeInfoWindow = null; // 정보창 객체 초기화
    }

    alert("도착지가 초기화되었습니다.");
});

// 마커와 정보 표시 함수
function setMarkerWithInfo(position, address, label) {
    if (activeInfoWindow) activeInfoWindow.close(); // 이전 정보창 닫기

    // 기존 출발지 또는 도착지 마커 제거
    if (label === "출발지" && startMarker) startMarker.setMap(null);
    if (label === "도착지" && endMarker) endMarker.setMap(null);

    const marker = new kakao.maps.Marker({
        position: position,
        map: map
    });

    const content = `
        <div class="info-box">
            <strong>${label}</strong>
            <p>${address}</p>
        </div>
    `;

    const infoWindow = new kakao.maps.InfoWindow({
        content: content,
        removable: true
    });

    infoWindow.open(map, marker);
    activeInfoWindow = infoWindow; // 현재 정보창 저장

    // 마커 저장
    if (label === "출발지") startMarker = marker;
    if (label === "도착지") endMarker = marker;
}

// 카페 검색 및 표시
function searchCafes() {
    const bounds = map.getBounds(); // 현재 지도 영역 좌표 가져오기

    // 카페 키워드 검색 요청
    places.keywordSearch("카페", (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
            displayCafes(data); // 카페 데이터를 지도에 표시
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert("현재 지도 영역 내에 카페가 없습니다.");
        } else {
            console.error("카페 검색 오류:", status);
        }
    }, { bounds: bounds });
}

// 카페 마커 표시 함수
function displayCafes(cafes) {
    cafeMarkers.forEach(marker => marker.setMap(null)); // 기존 카페 마커 제거
    cafeMarkers = []; // 카페 마커 배열 초기화

    cafes.forEach(cafe => {
        const position = new kakao.maps.LatLng(cafe.y, cafe.x);
        const marker = new kakao.maps.Marker({
            position: position,
            map: map
        });

        const content = `
            <div class="cafe-box">
                <strong>${cafe.place_name}</strong>
                <div class="button-group">
                    <button class="btn btn-start" onclick="setStartFromMarker('${cafe.place_name}', ${cafe.y}, ${cafe.x})">출발</button>
                    <button class="btn btn-end" onclick="setEndFromMarker('${cafe.place_name}', ${cafe.y}, ${cafe.x})">도착</button>
                    <button class="btn btn-review" onclick="leaveReview('${cafe.place_name}')">리뷰 남기기</button>
                </div>
            </div>
        `;

        const infoWindow = new kakao.maps.InfoWindow({
            content: content,
            removable: true
        });

        kakao.maps.event.addListener(marker, 'click', () => {
            if (activeInfoWindow) activeInfoWindow.close(); // 이전 정보창 닫기
            infoWindow.open(map, marker);
            activeInfoWindow = infoWindow; // 현재 정보창 저장
        });

        cafeMarkers.push(marker); // 마커 배열에 추가
    });
}

// 카페 마커에서 출발지 설정
function setStartFromMarker(cafeName, lat, lng) {
    const startInput = document.getElementById('start-input');
    startInput.value = cafeName; // 카페 이름 입력란에 설정
    startCoords = new kakao.maps.LatLng(lat, lng); // 출발지 좌표 저장
    alert(`${cafeName}이(가) 출발지로 설정되었습니다.`);
}

// 카페 마커에서 도착지 설정
function setEndFromMarker(cafeName, lat, lng) {
    const destinationInput = document.getElementById('destination-input');
    destinationInput.value = cafeName; // 카페 이름 입력란에 설정
    endCoords = new kakao.maps.LatLng(lat, lng); // 도착지 좌표 저장
    alert(`${cafeName}이(가) 도착지로 설정되었습니다.`);
}

// 리뷰 남기기
function leaveReview(cafeName) {
    alert(`${cafeName}에 리뷰를 남기는 기능은 준비 중입니다.`);
}

// 지도 상태 변경 시 카페 검색
kakao.maps.event.addListener(map, 'idle', () => {
    searchCafes(); // 지도 드래그 또는 줌 변경 후 카페 검색
});
