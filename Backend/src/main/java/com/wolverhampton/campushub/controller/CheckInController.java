package com.wolverhampton.campushub.controller;

import com.wolverhampton.campushub.entity.CheckIn;
import com.wolverhampton.campushub.service.CheckInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/check-ins")
@CrossOrigin(origins = "*")
public class CheckInController {
    
    @Autowired
    private CheckInService checkInService;
    
    @PostMapping
    public ResponseEntity<CheckIn> createCheckIn(@RequestBody CheckIn checkIn) {
        return new ResponseEntity<>(checkInService.createCheckIn(checkIn), HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Optional<CheckIn>> getCheckIn(@PathVariable Long id) {
        Optional<CheckIn> checkIn = checkInService.getCheckInById(id);
        return checkIn.isPresent() ? 
            new ResponseEntity<>(checkIn, HttpStatus.OK) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @GetMapping
    public ResponseEntity<List<CheckIn>> getAllCheckIns() {
        return new ResponseEntity<>(checkInService.getAllCheckIns(), HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CheckIn> updateCheckIn(@PathVariable Long id, @RequestBody CheckIn checkIn) {
        CheckIn updatedCheckIn = checkInService.updateCheckIn(id, checkIn);
        return updatedCheckIn != null ? 
            new ResponseEntity<>(updatedCheckIn, HttpStatus.OK) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckIn(@PathVariable Long id) {
        checkInService.deleteCheckIn(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CheckIn>> getCheckInsByStudent(@PathVariable String studentId) {
        return new ResponseEntity<>(checkInService.getCheckInsByStudentId(studentId), HttpStatus.OK);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CheckIn>> getCheckInsByStatus(@PathVariable String status) {
        return new ResponseEntity<>(checkInService.getCheckInsByStatus(status), HttpStatus.OK);
    }
}
