package com.wolverhampton.campushub.repository;

import com.wolverhampton.campushub.entity.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByStudentId(String studentId);
    List<Reward> findByStatus(String status);
}
