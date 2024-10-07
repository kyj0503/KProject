// Kakao 지도 API 초기화
document.addEventListener('DOMContentLoaded', function() {
    var mapContainer = document.getElementById('map'),
        mapOption = {
            center: new kakao.maps.LatLng(37.49821257, 126.8670887),
            level: 3
        };

    var map = new kakao.maps.Map(mapContainer, mapOption);

    // 마커 설정 (선택사항)
    var markerPosition  = new kakao.maps.LatLng(37.49821257, 126.8670887);
    var marker = new kakao.maps.Marker({
        position: markerPosition
    });
    marker.setMap(map);

    // 사진 업로드 버튼 동작 설정
    const uploadBtn = document.querySelector('.upload-btn');
    const fileInput = document.querySelector('#file-upload');

    uploadBtn.addEventListener('click', () => {
        fileInput.click(); // 파일 입력 클릭
    });

    // 메뉴 버튼 클릭 시 메뉴 보이기/숨기기
    const menuBtn = document.querySelector('.menu-btn');
    const menuList = document.querySelector('.menu-list');

    menuBtn.addEventListener('click', () => {
        menuList.style.display = menuList.style.display === 'none' || menuList.style.display === '' ? 'block' : 'none';
    });
});
