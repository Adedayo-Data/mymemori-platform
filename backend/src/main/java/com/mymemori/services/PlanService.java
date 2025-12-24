package com.mymemori.services;

import com.mymemori.Repository.PlansRepository;
import com.mymemori.dto.PlanDto;
import com.mymemori.exception.PlanNotFoundException;
import com.mymemori.models.Plans;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PlanService {

    public final PlansRepository planRepo;

    // create plan
    public PlanDto createPlan(PlanDto request){
        Plans plan = new Plans();
        plan.setPlan(request.getPlan());
        plan.setBenefits(request.getBenefits());
        plan.setUpdatedAt(Instant.now());

        Plans savedPlan = planRepo.save(plan);
        return request;
    }

    // Get All plans
    public List<PlanDto> getAllPlans(){
        List<Plans> plansList = planRepo.findAll();

        List<PlanDto> response = new ArrayList<>();
        for (Plans p : plansList){
            PlanDto dto = new PlanDto(p.getPlan(), p.getBenefits());
            response.add(dto);
        }

        return response;
    }

    // get Plan by Id
    public PlanDto getPlanById(UUID planId){
        Plans plan = planRepo.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("Plan not found!"));

        return new PlanDto(plan.getPlan(), plan.getBenefits());
    }

    // update plan
    public PlanDto updatePlan(UUID planId, PlanDto request){

        Plans plan = planRepo.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("Plan not found!"));

        if (request.getPlan() != null){
            plan.setPlan(request.getPlan());
        }
        if (request.getBenefits() != null){
            plan.setBenefits(plan.getBenefits());
        }

        plan.setUpdatedAt(Instant.now());
        Plans savedPlan = planRepo.save(plan);

        return new PlanDto(savedPlan.getPlan(), savedPlan.getBenefits());
    }

    // Delete plan
    public void deletePlan(UUID planId){
        planRepo.deleteById(planId);
    }
}
