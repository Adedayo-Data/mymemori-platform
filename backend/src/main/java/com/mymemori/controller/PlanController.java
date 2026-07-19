package com.mymemori.controller;

import com.mymemori.dto.PlanDto;
import com.mymemori.dto.PlanDtoResponse;
import com.mymemori.models.Users;
import com.mymemori.services.LocationService;
import com.mymemori.services.PlanService;
import com.mymemori.util.AuthenticatedUser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/plan")
@Slf4j
public class PlanController {

    private final PlanService planService;
    private final AuthenticatedUser authUser;
    private final LocationService locationService;

    // create plan
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('SUPER_DJI_USER')")
    public ResponseEntity<PlanDtoResponse> createPlan(@RequestBody PlanDto request) {
        Users user = authUser.fetchAuthenticatedUser();
        log.info("user {}, {} creating new plan.", user.getEmail(), user.getFullName());
        log.info("Creating new plan option");

        PlanDtoResponse response = planService.createPlan(request);
        log.info("Plan created!");
        log.info("Plan info: {}, {}", response.getPlan(), response.getBenefits());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get Plan By id
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('SUPER_DJI_USER')")
    public ResponseEntity<PlanDtoResponse> getPlanById(@PathVariable UUID id) {
        log.info("Fetched planId: {}", id);

        PlanDtoResponse response = planService.getPlanById(id);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // Get all plan
    @GetMapping
    public ResponseEntity<List<PlanDtoResponse>> getAllPlans(HttpServletRequest request) {
        log.info("Fetching all plan options");

        // IP -> Country Resolver
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        } else {
            ip = ip.split(",")[0].trim();
        }

        if ("0:0:0:0:0:0:0:1".equals(ip)) {
            ip = "127.0.0.1";
        }

        String country = locationService.getCountry(ip);

        List<PlanDtoResponse> response = planService.getAllPlans(country);
        log.info("All plans fetched. Count = {}", response.size());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('SUPER_DJI_USER')")
    public ResponseEntity<PlanDtoResponse> updatePlan(
            @PathVariable UUID id,
            @RequestBody PlanDto request) {
        // HashMap map =
        Users user = authUser.fetchAuthenticatedUser();
        log.info("User: {}, {} attempting to update plan object", user.getEmail(), user.getFullName());

        PlanDtoResponse response = planService.updatePlan(id, request);

        log.info("Plan updated Successfully!");

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // delete plan
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SUPER_DJI_USER')")
    public ResponseEntity<Void> deletePlan(@PathVariable UUID planId) {
        Users user = authUser.fetchAuthenticatedUser();
        log.info("User: {}, {} attempting to DELETE plan object", user.getEmail(), user.getFullName());

        planService.deletePlan(planId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
