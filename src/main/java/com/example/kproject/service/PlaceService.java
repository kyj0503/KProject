package com.example.kproject.service;

import com.example.kproject.entity.Place;
import com.example.kproject.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlaceService {
    @Autowired
    private PlaceRepository placeRepository;

    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    public Place getPlaceById(Integer id) {
        return placeRepository.findById(id).orElse(null);
    }

    public Place savePlace(Place place) {
        return placeRepository.save(place);
    }

    public void deletePlace(Integer id) {
        placeRepository.deleteById(id);
    }
}
