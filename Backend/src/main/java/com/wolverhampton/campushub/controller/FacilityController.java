package com.wolverhampton.campushub.controller;

import com.wolverhampton.campushub.entity.Facility;
import com.wolverhampton.campushub.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/facilities")
@CrossOrigin(origins = "*")
public class FacilityController {
    
    @Autowired
    private FacilityService facilityService;
    
    @PostMapping
    public ResponseEntity<Facility> createFacility(@RequestBody Facility facility) {
        return new ResponseEntity<>(facilityService.createFacility(facility), HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Facility>> getFacility(@PathVariable Long id) {
        Optional<Facility> facility = facilityService.getFacilityById(id);
        return facility.isPresent() ? 
            new ResponseEntity<>(facility, HttpStatus.OK) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities() {
        return new ResponseEntity<>(facilityService.getAllFacilities(), HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable Long id, @RequestBody Facility facility) {
        Facility updatedFacility = facilityService.updateFacility(id, facility);
        return updatedFacility != null ? 
            new ResponseEntity<>(updatedFacility, HttpStatus.OK) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Facility>> getFacilitiesByStatus(@PathVariable String status) {
        return new ResponseEntity<>(facilityService.getFacilitiesByStatus(status), HttpStatus.OK);
    }
}
