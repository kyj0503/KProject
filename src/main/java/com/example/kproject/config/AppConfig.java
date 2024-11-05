package com.example.kproject.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * API 키를 Spring Bean으로 등록하기 위해 설정 파일 작성
 *
 * @author 김연재
 */

@Configuration
public class AppConfig {

    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    @Bean
    public String kakaoApiKey() {
        return kakaoApiKey;
    }
}
