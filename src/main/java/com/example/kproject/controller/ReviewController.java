package com.example.kproject.controller;

import com.example.kproject.entity.Review;
import com.example.kproject.request.ReviewRequest;
import com.example.kproject.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    @ResponseBody
    public ResponseEntity<Review> saveReview(@RequestBody ReviewRequest reviewRequest, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = principal.getName();
        Review savedReview = reviewService.saveReview(reviewRequest.getLatitude(), reviewRequest.getLongitude(), username, reviewRequest.getRating(), reviewRequest.getComment());
        return ResponseEntity.ok(savedReview);
    }

    @GetMapping("/sorted")
    @ResponseBody
    public List<Review> getSortedReviews(@RequestParam double latitude, @RequestParam double longitude) {
        return reviewService.getReviewsByLocation(latitude, longitude);
    }
}
