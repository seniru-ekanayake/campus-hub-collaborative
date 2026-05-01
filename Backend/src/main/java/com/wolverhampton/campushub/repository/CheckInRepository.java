package com.wolverhampton.campushub.repository;

import com.wolverhampton.campushub.entity.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findByStudentId(String studentId);
    List<CheckIn> findByStatus(String status);
    List<CheckIn> findByFacilityId(String facilityId);
}
