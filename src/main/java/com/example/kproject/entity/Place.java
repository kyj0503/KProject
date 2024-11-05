package com.example.kproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer placeId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    private String description;
    private String openingHours;
    private Double latitude;
    private Double longitude;

    @Column(nullable = false, updatable = false)
    private java.sql.Timestamp createdAt;
}
