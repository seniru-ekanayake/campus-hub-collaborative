package com.wolverhampton.campushub.service;

import com.wolverhampton.campushub.entity.Reward;
import com.wolverhampton.campushub.repository.RewardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RewardService {
    
    @Autowired
    private RewardRepository rewardRepository;
    
    public Reward createReward(Reward reward) {
        return rewardRepository.save(reward);
    }
    
    public Optional<Reward> getRewardById(Long id) {
        return rewardRepository.findById(id);
    }
    
    public List<Reward> getAllRewards() {
        return rewardRepository.findAll();
    }
    
    public Reward updateReward(Long id, Reward reward) {
        Optional<Reward> existingReward = rewardRepository.findById(id);
        if (existingReward.isPresent()) {
            Reward r = existingReward.get();
            r.setStudentId(reward.getStudentId());
            r.setPoints(reward.getPoints());
            r.setRewardType(reward.getRewardType());
            r.setDescription(reward.getDescription());
            r.setStatus(reward.getStatus());
            return rewardRepository.save(r);
        }
        return null;
    }
    
    public void deleteReward(Long id) {
        rewardRepository.deleteById(id);
    }
    
    public List<Reward> getRewardsByStudentId(String studentId) {
        return rewardRepository.findByStudentId(studentId);
    }
    
    public List<Reward> getRewardsByStatus(String status) {
        return rewardRepository.findByStatus(status);
    }
}
