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

    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    private static final String DEFAULT_KEYWORD = "카페";

    @GetMapping("/")
    public String showMap(Model model, HttpSession session) {
        // 로그 추가
        logger.info("MapController 호출됨");

        // Kakao API 키와 검색 키워드를 모델에 추가하여 템플릿에 전달
        model.addAttribute("kakaoApiKey", kakaoApiKey);
        model.addAttribute("keyword", DEFAULT_KEYWORD);

        // 세션에서 로그인 상태 확인
        Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");
        model.addAttribute("isLoggedIn", isLoggedIn != null && isLoggedIn);

        return "map";  // 기본적으로 맵 화면을 반환
    }
}
