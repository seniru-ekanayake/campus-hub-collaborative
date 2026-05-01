package com.wolverhampton.campushub.service;

import com.wolverhampton.campushub.entity.Facility;
import com.wolverhampton.campushub.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FacilityService {
    
    @Autowired
    private FacilityRepository facilityRepository;
    
    public Facility createFacility(Facility facility) {
        return facilityRepository.save(facility);
    }
    
    public Optional<Facility> getFacilityById(Long id) {
        return facilityRepository.findById(id);
    }
    
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }
    
    public Facility updateFacility(Long id, Facility facility) {
        Optional<Facility> existingFacility = facilityRepository.findById(id);
        if (existingFacility.isPresent()) {
            Facility f = existingFacility.get();
            f.setFacilityName(facility.getFacilityName());
            f.setLocation(facility.getLocation());
            f.setCapacity(facility.getCapacity());
            f.setDescription(facility.getDescription());
            f.setStatus(facility.getStatus());
            return facilityRepository.save(f);
        }
        return null;
    }
    
    public void deleteFacility(Long id) {
        facilityRepository.deleteById(id);
    }
    
    public List<Facility> getFacilitiesByStatus(String status) {
        return facilityRepository.findByStatus(status);
    }
}
