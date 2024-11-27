package com.example.kproject.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
public class MapController {

    private static final Logger logger = LoggerFactory.getLogger(MapController.class);

    @Value("${kakao.js.key}")
    private String kakaoJsKey;

    @Value("${kakao.rest.key}")
    private String kakaoRestKey;

    private static final String DEFAULT_KEYWORD = "카페";

    /**
     * 메인 페이지(지도)를 표시하는 메서드.
     * 로그인 여부와 Kakao API 키, 기본 검색 키워드를 템플릿에 전달한다.
     *
     * @param model 템플릿에 데이터를 전달하기 위한 Model 객체
     * @param session 현재 사용자 세션 객체
     * @return 지도 페이지 뷰 이름 ("map")
     */
    @GetMapping("/")
    public String showMap(Model model, HttpSession session) {
        logger.info("MapController 호출됨");

        boolean isLoggedIn = session.getAttribute("userId") != null;

        model.addAttribute("isLoggedIn", isLoggedIn);
        model.addAttribute("kakaoJsKey", kakaoJsKey);
        model.addAttribute("kakaoRestKey", kakaoRestKey);
        model.addAttribute("keyword", DEFAULT_KEYWORD);

        return "mainpage";  // 기본적으로 맵 화면을 반환
    }
}
