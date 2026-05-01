package com.wolverhampton.campushub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rewards")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reward {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String studentId;
    
    @Column(nullable = false)
    private Integer points;
    
    @Column(nullable = false)
    private String rewardType;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private String status;
}
