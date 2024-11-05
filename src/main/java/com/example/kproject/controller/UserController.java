package com.example.kproject.controller;

import com.example.kproject.entity.User;
import com.example.kproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public String listUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "users/list";
    }

    // 회원가입 페이지 표시
    @GetMapping("/create")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "users/create";
    }

    // 회원가입 처리
    @PostMapping("/create")
    public String registerUser(@RequestParam("username") String username,
                               @RequestParam("password") String password,
                               @RequestParam("email") String email,
                               Model model) {
        // 새로운 User 객체 생성 후 필드 설정
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);

        // 현재 시간을 생성일로 설정
        user.setCreatedAt(new java.sql.Timestamp(System.currentTimeMillis()));

        // User 저장
        userService.saveUser(user);

        // 회원가입 성공 후 로그인 페이지로 리다이렉트
        return "redirect:/login";
    }

    @GetMapping("/edit/{id}")
    public String editUserForm(@PathVariable Integer id, Model model) {
        model.addAttribute("user", userService.getUserById(id));
        return "users/edit";
    }

    @PostMapping("/edit/{id}")
    public String editUser(@PathVariable Integer id, @ModelAttribute User user) {
        user.setUserId(id);
        userService.saveUser(user);
        return "redirect:/users";
    }

    @GetMapping("/delete/{id}")
    public String deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return "redirect:/users";
    }
}
