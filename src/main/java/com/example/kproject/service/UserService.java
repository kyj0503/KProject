package com.example.kproject.service;

import com.example.kproject.entity.User;
import com.example.kproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 로그인 인증 메서드
    public String authenticate(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            return "아이디가 틀렸습니다!";
        } else if (!user.get().getPassword().equals(password)) {
            return "비밀번호가 틀렸습니다!";
        }

        return null; // 로그인 성공
    }

    // 모든 사용자 조회
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 사용자 저장 또는 업데이트
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // ID로 사용자 조회
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    // 사용자 삭제
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }
}
