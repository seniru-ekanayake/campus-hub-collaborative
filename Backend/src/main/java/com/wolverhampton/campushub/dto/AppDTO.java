package com.wolverhampton.campushub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppDTO {
    
    private Long checkInId;
    private String studentId;
    private String facilityId;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String status;
}
