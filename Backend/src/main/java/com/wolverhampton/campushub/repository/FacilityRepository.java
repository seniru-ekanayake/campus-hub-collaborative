package com.wolverhampton.campushub.repository;

import com.wolverhampton.campushub.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    Facility findByFacilityName(String facilityName);
    java.util.List<Facility> findByStatus(String status);
}
