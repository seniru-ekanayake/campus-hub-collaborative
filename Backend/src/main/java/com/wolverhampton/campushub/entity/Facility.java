package com.wolverhampton.campushub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "facilities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Facility {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String facilityName;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private String status;
}
