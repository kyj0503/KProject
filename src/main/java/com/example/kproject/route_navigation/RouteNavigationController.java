package com.example.kproject.route_navigation;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
public class RouteNavigationController {

    private static final Logger logger = LoggerFactory.getLogger(RouteNavigationController.class);

    @Value("${kakao.rest.api.key}")
    private String kakaoApiKey;

    @GetMapping("/route-navigation")
    public String showRouteNavigationPage(Model model) {
        logger.info("경로 탐색 페이지 호출됨");
        model.addAttribute("kakaoApiKey", kakaoApiKey); // API 키를 템플릿에 전달
        return "route-navigation"; // route-navigation.mustache 반환
    }
}
