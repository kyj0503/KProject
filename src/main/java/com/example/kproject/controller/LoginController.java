package com.example.kproject.controller;

import com.example.kproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {

    @Autowired
    private UserService userService;

    // 로그인 페이지 표시
    @GetMapping("/login")
    public String showLoginPage(Model model) {
        return "login";
    }

    // 로그인 처리
    @PostMapping("/login")
    public String login(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            Model model, HttpSession session) {
        // 로그인 인증 결과를 확인
        String loginResult = userService.authenticate(username, password);

        if (loginResult == null) {
            // 로그인 성공 시 세션에 로그인 상태 저장
            session.setAttribute("isLoggedIn", true);
            return "redirect:/"; // 맵 화면으로 리다이렉트
        } else {
            // 로그인 실패 시 에러 메시지를 모델에 추가하여 로그인 페이지로 반환
            model.addAttribute("error", loginResult);
            return "login";
        }
    }

    // 로그아웃 처리
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        // 세션에서 로그인 상태 제거
        session.invalidate();
        return "redirect:/"; // 로그아웃 후 메인 페이지로 리다이렉트
    }
}
