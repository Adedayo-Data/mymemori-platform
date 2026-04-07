package com.mymemori.services;

import com.mymemori.Repository.PlansRepository;
import com.mymemori.dto.PlanDto;
import com.mymemori.dto.PlanDtoResponse;
import com.mymemori.exception.PlanNotFoundException;
import com.mymemori.models.Plans;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PlanService {

    public final PlansRepository planRepo;

    // create plan - Strictly for Admin
    public PlanDtoResponse createPlan(PlanDto request) {
        Plans plan = new Plans();
        plan.setPlan(request.getPlan());
        plan.setBenefits(request.getBenefits());
        plan.setAmount_NGN(request.getAmount_NGN());
        plan.setAmount_USD(request.getAmount_USD());
        plan.setUpdatedAt(Instant.now());

        Plans savedPlan = planRepo.save(plan);

        return new PlanDtoResponse(savedPlan.getId(), savedPlan.getPlan(), savedPlan.getBenefits(), "USD",
                savedPlan.getAmount_USD());
    }

    // Get All plans
    public List<PlanDtoResponse> getAllPlans(String country) {
        List<Plans> plansList = planRepo.findAll();
        List<PlanDtoResponse> response = new ArrayList<>();
        if ("NG".equalsIgnoreCase(country)) {
            for (Plans p : plansList) {
                PlanDtoResponse dto = new PlanDtoResponse(p.getId(), p.getPlan(), p.getBenefits(), "NGN",
                        p.getAmount_NGN());
                response.add(dto);
            }
            return response;
        }
        for (Plans p : plansList) {
            PlanDtoResponse dto = new PlanDtoResponse(p.getId(), p.getPlan(), p.getBenefits(), "USD",
                    p.getAmount_USD());
            response.add(dto);
        }
        return response;
    }

    // get Plan by ID - Strictyly for Admin
    public PlanDtoResponse getPlanById(UUID planId) {
        Plans plan = planRepo.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("Plan not found!"));

        return new PlanDtoResponse(plan.getId(), plan.getPlan(), plan.getBenefits(), "USD", plan.getAmount_USD());
    }

    // update plan - Strictly for Admin
    public PlanDtoResponse updatePlan(UUID planId, PlanDto request) {

        Plans plan = planRepo.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("Plan not found!"));

        if (request.getPlan() != null) {
            plan.setPlan(request.getPlan());
        }
        if (request.getBenefits() != null) {
            plan.setBenefits(request.getBenefits());
        }
        if (request.getAmount_NGN() != null) {
            plan.setAmount_NGN(request.getAmount_NGN());
        }
        if (request.getAmount_USD() != null) {
            plan.setAmount_USD(request.getAmount_USD());
        }

        plan.setUpdatedAt(Instant.now());
        Plans savedPlan = planRepo.save(plan);

        return new PlanDtoResponse(savedPlan.getId(), savedPlan.getPlan(), savedPlan.getBenefits(), "USD",
                savedPlan.getAmount_USD());
    }

    // Delete plan - Stritly for Admin
    public void deletePlan(UUID planId) {
        planRepo.deleteById(planId);
    }
}
