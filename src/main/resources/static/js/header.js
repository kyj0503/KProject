document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".sidebar-btn"); // 사이드바 버튼
    const door = document.querySelector(".door"); // 도어 요소
    let isOpen = false; // 도어 상태 변수

    if (!door) {
        console.error("도어 요소를 찾을 수 없습니다.");
        return;
    }

    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // 버튼 기본 동작 방지 (필요한 경우)
            if (isOpen) {
                // 도어 닫기
                door.classList.remove("open");
                isOpen = false;
            } else {
                // 도어 열기
                door.classList.add("open");
                isOpen = true;
            }
        });
    });
});
