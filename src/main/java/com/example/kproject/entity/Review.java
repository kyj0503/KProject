package com.example.kproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "placeId", nullable = false)
    private Place place;

    private Integer rating;
    private String comment;

    @Column(nullable = false, updatable = false)
    private java.sql.Timestamp createdAt;
}
