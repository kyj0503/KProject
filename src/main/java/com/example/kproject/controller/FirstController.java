package com.example.kproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FirstController {

    @GetMapping("")
    public String mapPage(Model model) {
        return "mapPage";
    }

    @GetMapping("/login")
    public String loginPage(Model model) {
        return "loginPage";
    }

    @GetMapping("/signin")
    public String signinPage(Model model) {
        return "signinPage";
    }

    @GetMapping("/my")
    public String myPage(Model model) {
        return "myPage";
    }

    @GetMapping("/leaderboard")
    public String leaderboardPage(Model model) { return "leaderboardPage"; }

    @GetMapping("/report")
    public String reportPage(Model model) {
        return "reportPage";
    }

    @GetMapping("/admin")
    public String adminPage(Model model) {
        return "adminPage";
    }
}