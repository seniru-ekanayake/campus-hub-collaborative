package com.wolverhampton.campushub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacilityDTO {
    
    private Long id;
    private String facilityName;
    private String location;
    private Integer capacity;
    private String description;
    private String status;
}
