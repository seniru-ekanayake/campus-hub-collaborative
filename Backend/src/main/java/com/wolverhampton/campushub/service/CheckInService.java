package com.wolverhampton.campushub.service;

import com.wolverhampton.campushub.entity.CheckIn;
import com.wolverhampton.campushub.repository.CheckInRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CheckInService {
    
    @Autowired
    private CheckInRepository checkInRepository;
    
    public CheckIn createCheckIn(CheckIn checkIn) {
        return checkInRepository.save(checkIn);
    }
    
    public Optional<CheckIn> getCheckInById(Long id) {
        return checkInRepository.findById(id);
    }
    
    public List<CheckIn> getAllCheckIns() {
        return checkInRepository.findAll();
    }
    
    public CheckIn updateCheckIn(Long id, CheckIn checkIn) {
        Optional<CheckIn> existingCheckIn = checkInRepository.findById(id);
        if (existingCheckIn.isPresent()) {
            CheckIn ci = existingCheckIn.get();
            ci.setStudentId(checkIn.getStudentId());
            ci.setFacilityId(checkIn.getFacilityId());
            ci.setCheckInTime(checkIn.getCheckInTime());
            ci.setCheckOutTime(checkIn.getCheckOutTime());
            ci.setStatus(checkIn.getStatus());
            return checkInRepository.save(ci);
        }
        return null;
    }
    
    public void deleteCheckIn(Long id) {
        checkInRepository.deleteById(id);
    }
    
    public List<CheckIn> getCheckInsByStudentId(String studentId) {
        return checkInRepository.findByStudentId(studentId);
    }
    
    public List<CheckIn> getCheckInsByStatus(String status) {
        return checkInRepository.findByStatus(status);
    }
}
