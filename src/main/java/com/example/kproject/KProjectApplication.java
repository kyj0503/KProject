package com.example.kproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

/* 김연재
(exclude={DataSourceAutoConfiguration.class})
이 코드는 프로젝트 생성 때 MySQL 종속성을 넣어뒀지만,
아직 DB를 설정하지 않음으로써 생기는 오류를 무시하기 위해 추가 됨.
추후 DB 작성 후 제거해야함.
 */
@SpringBootApplication(exclude={DataSourceAutoConfiguration.class})
public class KProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(KProjectApplication.class, args);
    }

}
