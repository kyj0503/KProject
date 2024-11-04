package com.example.kproject.service;

import com.example.kproject.entity.Review;
import com.example.kproject.entity.User;
import com.example.kproject.repository.ReviewRepository;
import com.example.kproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    public Review saveReview(Double latitude, Double longitude, String username, int rating, String comment) {
        User user = userRepository.findByUsername(username);

        Review review = new Review();
        review.setLatitude(latitude);
        review.setLongitude(longitude);
        review.setUser(user);
        review.setRating(rating);
        review.setComment(comment);

        return reviewRepository.save(review);
    }

    public List<Review> getAllReviewsSortedByRating() {
        return reviewRepository.findAllByOrderByRatingDesc();
    }
}
