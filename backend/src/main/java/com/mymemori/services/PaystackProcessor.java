package com.mymemori.services;

import com.mymemori.Repository.PlansRepository;
import com.mymemori.Repository.ProductRepository;
import com.mymemori.Repository.TransactionRepository;
import com.mymemori.dto.PaymentRequest;
import com.mymemori.dto.PaymentResponse;
import com.mymemori.dto.PaymentResponseResolver;
import com.mymemori.dto.PaystackPaymentRequest;
import com.mymemori.exception.*;
import com.mymemori.models.*;
import com.mymemori.util.AuthenticatedUser;
import com.mymemori.util.ReferenceGenerator;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class PaystackProcessor implements PaymentProcessor {


    private final AuthenticatedUser authUser;
    private final PlansRepository planRepo;
    private final ProductRepository productRepo;
    private final RestTemplate restTemplate;
    private final TransactionRepository transactionRepo;

    @Value("${ps.api.secret}")
    private final String psApiKey;

    @Override
    public PaymentResponseResolver initializePayment(PaymentRequest request) {
        Users user = authUser.fetchAuthenticatedUser();

        if (user == null){
            throw new UserNotFoundException("Authenticated User not found to process payment");
        }

        BigDecimal amount;
        String reference;
        Plans plan = null;
        Product product = null;

        if (request.getType().equals(PaymentType.PLAN)){
            plan = planRepo.findById(request.getId())
                    .orElseThrow(() -> new PlanNotFoundException("Plan not found to process paystack payment"));

            amount = plan.getAmount_NGN();

            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
            String random = ReferenceGenerator.generateRandomString(5);
            reference = String.format("MM-PLN-T%s-%s", timestamp, random);

        } else if (request.getType().equals(PaymentType.PRODUCT)) {
            product = productRepo.findById(request.getId())
                    .orElseThrow(() -> new PlanNotFoundException("Plan not found to process paystack payment"));

            amount = product.getAmount_NGN();

            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
            String random = ReferenceGenerator.generateRandomString(5);
            reference = String.format("MM-PRD-T%s-%s", timestamp, random);
        }else {
            throw new PaymentTypeNotFound(
                    String.format("PaymentType %s not found for paystack payment", request.getType())
            );
        }

        // build header
        HttpHeaders header = new HttpHeaders();
        header.set("Authorization", "Bearer " +psApiKey);
        header.setContentType(MediaType.APPLICATION_JSON);
        header.set("accept", "application/json");

        // build body
        PaystackPaymentRequest paystackPayReqquest = PaystackPaymentRequest.builder()
                .amount(amount.multiply(new BigDecimal(100)).toBigInteger().toString())
                .reference(reference)
                .currency("NGN")
                .callback_url("https://mymemori.site")
                .build();


        HttpEntity<PaystackPaymentRequest> entity = new HttpEntity<>(paystackPayReqquest, header);

        String url = "https://api.paystack.co/transaction/initialize";

        ResponseEntity<PaymentResponse> apiResponse = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                PaymentResponse.class
        );

        if(!apiResponse.getStatusCode().is2xxSuccessful()){
            log.error("Payment provider encoured errors. Status code: {}, body: {}", apiResponse.getStatusCode(), apiResponse.getBody());
            throw new PaymentInitializationException("An error occured while initiating paystack Payment");
        }

        // build Transaction object
        Transaction transaction = Transaction.builder()
                .plan(plan)
                .product(product)
                .amount(amount)
                .currency("NGN")
                .user(user)
                .paymentProvider(PaymentProvider.PAYSTACK)
                .providerReference(reference)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        transactionRepo.save(transaction);

        return paymentResponseResolver(apiResponse.getBody());
    }

    @Override
    public String getPaymentProcessor() {
        return "Paystack";
    }


    // verify transaction
    public void verifyTransaction(String reference){

        Transaction transaction = transactionRepo.findTransactionByProviderReference(reference)
                .orElseThrow(() -> new TransactionNotFound("Transaction not Found!"));

        if(transaction.getPaymentStatus() == PaymentStatus.SUCCESS){
            log.info("Idempotency worked");
            return;
        }

        String url = "https://api.paystack.co/transaction" +reference;

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);
        header.set("Authorization", "Bearer " +psApiKey);

        HttpEntity<Void> entity = new HttpEntity<>(header);

        ResponseEntity<PaymentResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                PaymentResponse.class
        );

        if (response.getBody() == null){
            log.warn("Paystack returned empty data");
            return;
        }
        PaymentResponse paymentResponse = response.getBody();

        Map<String, Object> data = paymentResponse.getData();

        // Validate Amount
        BigDecimal incomingAmount = new BigDecimal(data.get("amount").toString());
        if (incomingAmount.compareTo(transaction.getAmount())!= 0
                || !data.get("currency").equals(transaction.getCurrency())
                || !data.get("status").equals("success")){
            log.warn("Fraud detected on Paystack Processor! Amount Expected: {}, Amount received: {}, Currency Expected: {}, Currency received: {}",
                    transaction.getAmount(), incomingAmount, transaction.getCurrency(), data.get("currency"));

            return;
        }

        transaction.setPaymentStatus(PaymentStatus.SUCCESS);
        transactionRepo.save(transaction);
        log.info("Transaction saved successfully. Status: {}", transaction.getPaymentStatus());
    }

    // ================================= HELPER METHODS ======================
    public PaymentResponseResolver paymentResponseResolver(PaymentResponse response){
        return getPaymentResponseResolver(response);
    }

    @NonNull
    static PaymentResponseResolver getPaymentResponseResolver(PaymentResponse response) {
        PaymentResponseResolver resolver = new PaymentResponseResolver();
        resolver.setStatus(response.getStatus());
        resolver.setMessage(response.getMessage());

        Object link = response.getData().get("link");
        Object auth = response.getData().get("authorization_url");
        resolver.setCheckout_url((String) Optional.ofNullable(link).orElse(auth));

        return resolver;
    }
}
