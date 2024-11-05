package com.example.kproject.controller;

import com.example.kproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@Controller
public class LoginController {

    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String showLoginPage(Model model) {
        return "login"; // login.mustache 템플릿을 반환
    }

    @PostMapping("/login")
    public String login(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            Model model) {
        // 로그인 인증 결과를 확인
        Optional<String> loginResult = userService.authenticate(username, password);

        if (loginResult.isEmpty()) {
            // 로그인 성공 시 메인 페이지로 리다이렉트
            return "redirect:/";
        } else {
            // 로그인 실패 시 에러 메시지를 모델에 추가하여 로그인 페이지로 반환
            model.addAttribute("error", loginResult.get());
            return "login";
        }
    }
}
