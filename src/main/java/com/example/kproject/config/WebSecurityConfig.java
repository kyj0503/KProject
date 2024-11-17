package com.example.kproject.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@RequiredArgsConstructor
@EnableWebSecurity //상속 없이 간편하게 Spring의 기능을 사용할 수 있게 해줌
@Configuration
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        //로그인 페이지가 나오지 않게 하기 위해. 요청되는 모든 URL을 허용
        http.authorizeHttpRequests((authorizeRequests) -> authorizeRequests.anyRequest().permitAll());

        return http.build();
    }
}
