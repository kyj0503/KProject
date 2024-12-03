document.addEventListener("DOMContentLoaded", function () {
    const REST_API_KEY = kakaoRestKey; // KakaoMobility REST API Key

    var keyword = document.getElementById('keyword-data').value; // 검색 키워드
    var mapContainer = document.getElementById('map'); // 지도 컨테이너
    var mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 기본 서울 중심 좌표
        level: 3 // 확대/축소 레벨
    };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도 객체 생성
    var ps = new kakao.maps.services.Places(); // 장소 검색 서비스 객체
    var geocoder = new kakao.maps.services.Geocoder(); // 주소 변환 서비스 객체
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 }); // 정보 창 객체
    var markers = []; // 마커를 저장할 배열
    var openInfoWindowMarker = null; // 열린 인포윈도우의 마커 저장 변수
    var routePolyline = null; // 경로를 그리기 위한 폴리라인 객체

    /**
     * 사용자 위치를 기반으로 지도 중심 설정
     */
    function setMapCenterByUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const userLatLng = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(userLatLng); // 사용자 위치로 지도 중심 설정
                searchPlaces(userLatLng); // 위치 기반으로 장소 검색
            }, function () {
                alert("현재 위치를 가져올 수 없습니다. 기본 위치를 표시합니다.");
            });
        } else {
            alert("Geolocation을 지원하지 않는 브라우저입니다. 기본 위치를 표시합니다.");
        }
    }

    /**
     * 장소 검색 기능
     */
    function searchPlaces(location) {
        markers.forEach(marker => marker.setMap(null)); // 기존 마커 제거
        markers = []; // 마커 배열 초기화

        ps.keywordSearch(keyword, placesSearchCB, { location: location, radius: 5000 }); // 키워드 검색
    }

    /**
     * 장소 검색 콜백 함수
     */
    function placesSearchCB(data, status) {
        if (status === kakao.maps.services.Status.OK) {
            data.forEach((place) => {
                displayMarker(place); // 마커 표시
            });
        } else {
            console.error("검색 결과가 없습니다.");
        }
    }

    /**
     * 마커 표시 함수
     */
    function displayMarker(place) {
        var marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.y, place.x)
        });
        markers.push(marker); // 마커 배열에 추가

        kakao.maps.event.addListener(marker, 'click', function () {
            if (openInfoWindowMarker === marker) {
                infowindow.close(); // 이미 열린 인포윈도우가 있으면 닫기
                openInfoWindowMarker = null;
                return;
            }

            searchDetailAddrFromCoords(marker.getPosition(), function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    const address = result[0].road_address
                        ? result[0].road_address.address_name
                        : result[0].address.address_name;

                    const content = `
                    <div style="padding:5px;font-size:12px;">
                        <p>${place.place_name}</p>
                        <p>${address}</p>
                        <button onclick="savePlaceToDatabase('${place.place_name}', '${address}', ${place.x}, ${place.y})">리뷰 남기기</button>
                        <button onclick="getCarDirection(${place.y}, ${place.x})">경로 탐색</button>
                        <button onclick="addFavorite('${place.place_name}', '${address}', ${place.x}, ${place.y})">즐겨찾기 추가</button>
                    </div>`;
                    infowindow.setContent(content); // 인포윈도우에 내용 설정
                    infowindow.open(map, marker); // 지도에 인포윈도우 열기
                    openInfoWindowMarker = marker; // 열린 인포윈도우의 마커 저장
                }
            });
        });
    }

    /**
     * 좌표를 기반으로 주소 변환
     */
    function searchDetailAddrFromCoords(coords, callback) {
        geocoder.coord2Address(coords.getLng(), coords.getLat(), callback); // 주소 변환 요청
    }

    /**
     * 즐겨찾기 추가 함수
     */
    window.addFavorite = function (name, address, longitude, latitude) {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            window.location.href = '/login';
            return;
        }

        const favoriteData = { name, address, longitude, latitude };

        fetch('/favorites/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(favoriteData), // 즐겨찾기 데이터 전송
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to add favorite');
                return response.json();
            })
            .then(data => {
                alert('즐겨찾기에 추가되었습니다.');
            })
            .catch(error => console.error('Error:', error));
    };

    /**
     * 장소를 데이터베이스에 저장
     */
    window.savePlaceToDatabase = function (name, address, longitude, latitude) {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            window.location.href = '/login';
            return;
        }

        const placeData = { name, address, longitude, latitude };

        fetch('/reviews/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(placeData), // 장소 데이터 전송
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to save place');
                return response.json();
            })
            .then(data => {
                const redirectUrl = data.redirectUrl;
                window.location.href = redirectUrl; // 리뷰 작성 후 리다이렉트
            })
            .catch(error => console.error('Error:', error));
    };

    /**
     * 자동차 경로 탐색
     */
    window.getCarDirection = async function (lat, lng) {
        const url = 'https://apis-navi.kakaomobility.com/v1/directions';

        if (!navigator.geolocation) {
            alert("Geolocation을 지원하지 않는 브라우저입니다.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async function (position) {
            const origin = `${position.coords.longitude},${position.coords.latitude}`;
            const destination = `${lng},${lat}`;

            const headers = {
                Authorization: `KakaoAK ${REST_API_KEY}`,
                'Content-Type': 'application/json'
            };
            const queryParams = new URLSearchParams({ origin, destination });
            const requestUrl = `${url}?${queryParams}`;

            try {
                const response = await fetch(requestUrl, {
                    method: 'GET',
                    headers: headers
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                drawRoute(data.routes[0].sections); // 경로 그리기
            } catch (error) {
                console.error('Error:', error);
            }
        }, function () {
            alert("현재 위치를 가져올 수 없습니다.");
        });
    };

    /**
     * 경로 그리기
     */
    function drawRoute(sections) {
        if (routePolyline) routePolyline.setMap(null); // 기존 경로 제거

        const path = [];

        sections.forEach(section => {
            section.roads.forEach(road => {
                road.vertexes.forEach((vertex, index) => {
                    if (index % 2 === 0) {
                        const lng = vertex;
                        const lat = road.vertexes[index + 1];
                        path.push(new kakao.maps.LatLng(lat, lng)); // 경로 좌표 추가
                    }
                });
            });
        });

        routePolyline = new kakao.maps.Polyline({
            map: map,
            path: path,
            strokeWeight: 5,
            strokeColor: '#FF0000',
            strokeOpacity: 0.7,
            strokeStyle: 'solid'
        });

        const bounds = new kakao.maps.LatLngBounds();
        path.forEach(point => bounds.extend(point)); // 경로가 포함된 bounds 설정
        map.setBounds(bounds); // 지도 범위 설정
    }

    // 지도 이동 시 새로운 위치에서 장소를 검색
    kakao.maps.event.addListener(map, 'center_changed', function () {
        const center = map.getCenter();
        searchPlaces(center);
    });

    setMapCenterByUserLocation(); // 사용자 위치를 기준으로 지도 초기화
});




document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".sidebar-btn"); // 모든 사이드바 버튼
    const door = document.querySelector(".door"); // 도어 요소
    const sidebar = document.querySelector(".sidebar"); // 사이드바 요소

    if (!door) {
        console.error("도어 요소를 찾을 수 없습니다.");
        return;
    }

    if (!sidebar) {
        console.error("사이드바 요소를 찾을 수 없습니다.");
        return;
    }

    let isOpen = false; // 도어 상태 변수

    // 도어 콘텐츠 업데이트 함수
    function updateDoorContent(content) {
        door.innerHTML = content; // 도어 내부 HTML 업데이트
    }

    // 도어 열기
    function openDoor() {
        const sidebarWidth = sidebar.offsetWidth; // 사이드바 너비 계산
        door.style.transform = `translateX(${sidebarWidth}px)`; // 도어 왼쪽 끝을 사이드바 오른쪽 끝에 맞춤
        door.classList.add("open");
        isOpen = true;
    }

    // 도어 닫기
    function closeDoor() {
        door.style.transform = "translateX(-100%)"; // 도어를 화면 왼쪽으로 숨김
        door.classList.remove("open");
        door.innerHTML = ""; // 도어 내용 제거
        isOpen = false;
    }

    // 각 버튼의 클릭 이벤트 처리
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // 기본 동작 방지
            const buttonAltText = button.querySelector("img")?.alt; // 버튼의 alt 텍스트 확인

            if (isOpen) {
                // 도어가 열려 있으면 닫기
                closeDoor();
            } else {
                // 도어 열기 및 콘텐츠 업데이트
                switch (buttonAltText) {
                    case "홈":
                        updateDoorContent(`
        <link rel="stylesheet" href="/css/search.css">
        <div class="search-container">
            <div class="search-box">
                <input type="text" id="search-input" class="search-input" placeholder="검색어를 입력하세요">
                <button id="search-button" class="search-button">🔍</button>
            </div>
            <div class="button-group">
                <button class="custom-button">카페</button>
                <button class="custom-button">도서관</button>
            </div>
        </div>
    `);
                        break;

                    case "로그인":
                        updateDoorContent(`
                          <!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인</title>
    <link rel="stylesheet" href="/css/login.css">
</head>
<body>
    <div class="login-container">
        <h1 class="service-name">로그인</h1>
        <form class="login-form">
            <input type="text" class="input-field" placeholder="아이디" required>
            <input type="password" class="input-field" placeholder="비밀번호" required>
            <div class="button-group">
                <button type="button" class="signup-button">회원가입</button>
                <button type="submit" class="login-button">로그인</button>
            </div>
        </form>
    </div>
</body>
</html>

                        `);
                        break;

                    case "경로 탐색":
                        updateDoorContent(`
                            <!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>경로 탐색</title>

    <!-- Bootstrap 및 지도 스타일 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/map.css">

    <!-- JavaScript 변수 설정 -->
    <script>
        const kakaoJsKey = "{{kakaoJsKey}}";  // 카카오 JavaScript API 키
        const kakaoRestKey = "{{kakaoRestKey}}";  // 카카오 REST API 키
        const isLoggedIn = {{isLoggedIn}};  // 로그인 여부
    </script>

    <!-- 카카오 지도 API -->
    <script src="//dapi.kakao.com/v2/maps/sdk.js?appkey={{kakaoJsKey}}&libraries=services,drawing"></script>
</head>
<body>
<div class="container my-4">
    <!-- 지도 영역 -->
    <div class="map-container mb-4">
        <div id="map" class="map"></div>
    </div>

    <!-- 경로 설정 폼 -->
    <div class="form-container">
        <div class="mb-3">
            <label for="start-location" class="form-label">출발지</label>
            <input type="text" id="start-location" class="form-control" placeholder="출발지를 입력하거나 마커를 선택하세요">
        </div>
        <div class="mb-3">
            <label for="end-location" class="form-label">도착지</label>
            <input type="text" id="end-location" class="form-control" placeholder="도착지를 입력하거나 마커를 선택하세요">
        </div>
    </div>

    <div class="buttons-container">
        <button class="btn btn-primary" onclick="calculateRoute()">경로 탐색</button>
        <button class="btn btn-secondary" onclick="resetMap()">초기화</button>
    </div>

</div>

<!-- JavaScript -->
<script src="/js/navigation.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
                        `);
                        break;

                    case "평점순":
                        updateDoorContent(`



        <iframe src="/reviews/list" style="width: 100%; height: 100%; border: none;"></iframe>
    

                        `);
                        break;

                    case "마이페이지":
                        updateDoorContent(`
                        case "마이페이지":
  
        <iframe src="/users/mypage" style="width: 100%; height: 100%; border: none;"></iframe>

                            
                        `);
                        break;

                    default:
                        updateDoorContent(`<p>${buttonAltText} 기능은 준비 중입니다.</p>`);
                        break;
                }
                openDoor();
            }
        });
    });
});

