package com.example.kproject.request;

public class ReviewRequest {
    private Double latitude;
    private Double longitude;
    private int rating;
    private String comment;

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }
}
