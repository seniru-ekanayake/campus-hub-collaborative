package com.wolverhampton.campushub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_ins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckIn {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String studentId;
    
    @Column(nullable = false)
    private String facilityId;
    
    @Column(nullable = false)
    private LocalDateTime checkInTime;
    
    @Column
    private LocalDateTime checkOutTime;
    
    @Column(nullable = false)
    private String status;
}
