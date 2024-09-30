package com.example.kproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FirstController {
    @GetMapping("/hi")
    public String niceToMeetYou(Model model) {
        model.addAttribute("username", "지팡이");
        return "greetings";
    }

    @GetMapping("/ch")
    public String niceToMeetChang(Model model) {
        return "chang";
    }
}