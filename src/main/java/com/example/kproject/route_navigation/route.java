
package com.example.kproject.route_navigation;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

class route {

    /* 아직 쓰는거 x

    // UI 생성 메서드
    public void createAndShowUI() {
        // 메인 프레임 생성
        JFrame frame = new JFrame("지도 경로 탐색");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(400, 300);
        frame.setLayout(new BorderLayout());

        // 패널 생성
        JPanel topPanel = new JPanel(); // 시작 버튼을 위한 패널
        JPanel mainPanel = new JPanel(); // 버튼들을 위한 패널
        mainPanel.setLayout(new GridLayout(0, 1, 5, 5)); // 버튼 수직 배치

        // 시작 버튼 추가
        JButton startButton = new JButton("시작");
        topPanel.add(startButton);

        // 메인 프레임에 패널 추가
        frame.add(topPanel, BorderLayout.NORTH);
        frame.add(mainPanel, BorderLayout.CENTER);

        // 시작 버튼 클릭 이벤트 처리
        startButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // 기존 버튼 제거 후 새 버튼 추가
                mainPanel.removeAll();

                // 현재 위치 버튼
                JButton currentLocationButton = new JButton("현재 위치");
                mainPanel.add(currentLocationButton);

                // 이 위치에서 다시 검색 버튼
                JButton searchAgainButton = new JButton("이 위치에서 다시 검색");
                mainPanel.add(searchAgainButton);

                // 출발지 버튼
                JButton startLocationButton = new JButton("출발지");
                mainPanel.add(startLocationButton);

                // 도착지 버튼
                JButton destinationButton = new JButton("도착지");
                mainPanel.add(destinationButton);

                // 레이아웃 업데이트
                mainPanel.revalidate();
                mainPanel.repaint();
            }
        });

        // 프레임 보이기
        frame.setVisible(true);
    }
        */
}
