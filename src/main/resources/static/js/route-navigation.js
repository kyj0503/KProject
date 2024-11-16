const KAKAO_REST_API_KEY = 'b4f6b9f34acd35ee9c17e0b581351e5f'; // api key 삽입

    const mapContainer = document.getElementById('map'); // 지도를 표시할 div
    const mapOption = {
        center: new kakao.maps.LatLng(37.273629699499, 127.12928668205), // 초기 지도 중심
        level: 3 // 확대 레벨
    };

    // 지도 생성
    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 현재 위치 버튼 클릭
    document.getElementById('current-location').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const currentLocation = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(currentLocation);

                // 현재 위치를 출발지 입력칸에 표시
                document.getElementById('start-input').value = `${position.coords.latitude}, ${position.coords.longitude}`;
                alert("현재 위치로 지도가 이동되었습니다.");
            }, () => {
                alert("위치 정보를 가져올 수 없습니다.");
            });
        } else {
            alert("Geolocation을 지원하지 않는 브라우저입니다.");
        }
    });

    // 출발지 설정
    document.getElementById('start-location').addEventListener('click', () => {
        const startAddress = document.getElementById('start-input').value;
        if (!startAddress) {
            alert("출발지를 입력하세요.");
            return;
        }

        geocoder.addressSearch(startAddress, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                startCoords = new kakao.maps.LatLng(result[0].y, result[0].x);
                map.setCenter(startCoords);
                alert("출발지가 설정되었습니다.");
            } else {
                alert("출발지 설정에 실패했습니다.");
            }
        });
    });

    // 도착지 설정
    document.getElementById('destination').addEventListener('click', () => {
        const endAddress = document.getElementById('destination-input').value;
        if (!endAddress) {
            alert("도착지를 입력하세요.");
            return;
        }

        geocoder.addressSearch(endAddress, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                endCoords = new kakao.maps.LatLng(result[0].y, result[0].x);
                map.setCenter(endCoords);
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

        // 추가: Kakao Mobility 길찾기 API 호출
        const origin = `${startCoords.getLng()},${startCoords.getLat()}`;
        const destination = `${endCoords.getLng()},${endCoords.getLat()}`;

        fetch(`https://apis-navi.kakaomobility.com/v1/directions?origin=${origin}&destination=${destination}&priority=RECOMMEND&car_fuel=GASOLINE&car_hipass=false&alternatives=false`, {
            method: 'GET',
            headers: {
                'Authorization': `KakaoAK b4f6b9f34acd35ee9c17e0b581351e5f`, //api key 삽입
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
                alert('자동차 길찾기 API 호출 중 문제가 발생했습니다.');
            });
    });

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

    // 경로 폴리라인 표시
    const polyline = new kakao.maps.Polyline({
        path: path,
        strokeWeight: 5,
        strokeColor: '#0000FF',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
    });
    polyline.setMap(map);

    // 거리와 예상 소요 시간 표시
    const distance = route.summary.distance; // 미터
    const duration = route.summary.duration; // 초
    alert(`최단 거리: ${(distance / 1000).toFixed(2)} km, 예상 소요 시간: ${(duration / 60).toFixed(1)} 분`);
}

        // Kakao Directions API를 사용한 경로 탐색
        const directionsService = new kakao.maps.services.Directions();
        directionsService.route({
            origin: startCoords,
            destination: endCoords,
            // 추가 옵션 설정 가능
        }, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const route = result.routes[0];
                const distance = route.distance;
                const duration = route.duration;

                // 경로 연결선 표시
                const path = route.road.map(point => new kakao.maps.LatLng(point.y, point.x));
                const polyline = new kakao.maps.Polyline({
                    path: path,
                    strokeWeight: 5,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeStyle: 'solid'
                });
                polyline.setMap(map);

                // 거리와 시간 표시
                alert(`최단 거리: ${distance}m, 소요 시간: ${duration}초`);
            } else {
                alert("경로 탐색에 실패했습니다.");
            }
        });