package com.mymemori.services;

import com.mymemori.Repository.PlansRepository;
import com.mymemori.Repository.ProductRepository;
import com.mymemori.Repository.TransactionRepository;
import com.mymemori.dto.*;
import com.mymemori.exception.*;
import com.mymemori.models.*;
import com.mymemori.util.AuthenticatedUser;
import com.mymemori.util.ReferenceGenerator;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

import static com.mymemori.services.PaystackProcessor.getPaymentResponseResolver;

@Service
@Slf4j
public class FlutterwaveProcessor implements PaymentProcessor {

    /*
    * This service would handle the payment flow for international users.
    * PROCESS:
    * 1. Initiate payment
    * 2. Handle webhook/callback
    * 3. Verify transaction
    * */

    private final PlansRepository plansRepo;
    private final ProductRepository productRepo;
    private final AuthenticatedUser authUser;
    private final RestTemplate restTemplate;
    private final TransactionRepository transactionRepo;
    private final String fwApiKey;

    public FlutterwaveProcessor(
            PlansRepository plansRepo,
            ProductRepository productRepo,
            AuthenticatedUser authUser,
            RestTemplate restTemplate,
            TransactionRepository transactionRepo,
            @Value("${fw.api.secret}") String fwApiKey) {
        this.plansRepo = plansRepo;
        this.productRepo = productRepo;
        this.authUser = authUser;
        this.restTemplate = restTemplate;
        this.transactionRepo = transactionRepo;
        this.fwApiKey = fwApiKey;
    }

    @Override
    public PaymentResponseResolver initializePayment(PaymentRequest request){

        Users user = authUser.fetchAuthenticatedUser();

        if (user == null){
            throw new UserNotFoundException("No Authenticated user found!");
        }

        BigDecimal amount;
        String reference;
        Plans plan = null;
        Product product = null;

        // Get the payment type
        if (request.getType().equals(PaymentType.PLAN)){
            plan = plansRepo.findById(request.getId())
                    .orElseThrow(
                            () -> new PlanNotFoundException("Plan not found")
                    );

            amount = plan.getAmount_USD();

            // Reference would be the combo of prefix MM-PaymentType(PLN/PRD)- timestamp - 5 random string
            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
            String random = ReferenceGenerator.generateRandomString(5);
            reference = String.format("MM-PLN-T%s-%s", timestamp, random);

        } else if (request.getType().equals(PaymentType.PRODUCT)) {

            product = productRepo.findProductById(request.getId())
                    .orElseThrow(() -> new ProductNotFoundException("Product Not found!"));

            amount = product.getAmount_USD();

            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
            String random = ReferenceGenerator.generateRandomString(5);
            reference = String.format("MM-PRD-T%s-%s", timestamp, random);

        } else {
            throw new PaymentTypeNotFound(String.format("Payment type {%s} not used in this project", request.getType()));
        }

        // Building request to be passed to payment gateway
        FlutterPaymentRequest paymentRequest = FlutterPaymentRequest.builder()
                .amount(amount)
                .tx_ref(reference)
                .currency("USD")
                .redirect_url("https://mymemori.site") // This should be success page
                .customer(buildCustomer(user))
                .customization(customization())
                .payment_options("card, banktransfer, account, internetbanking, mpesa, applepay, googlepay, ghanamobilemoney")
                .build();

        // set headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " +fwApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("accept", "application/json");

        // create entity
        HttpEntity<FlutterPaymentRequest> entity = new HttpEntity<>(paymentRequest, headers);

        String url = "https://api.flutterwave.com/v3/payments";

        // Exchange entity for response
        ResponseEntity<PaymentResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                PaymentResponse.class
        );

        // check HttpStatus response if successful otherwise throw an exception ASAP
        if(!response.getStatusCode().is2xxSuccessful()){
            log.error("Payment Provider encoutered errors. Status code :{}, body: {}", response.getStatusCode(), response.getBody());
            throw new PaymentInitializationException("An error occured while Initializing payment");
        }

        // build Transaction object
        Transaction transaction = Transaction.builder()
                .plan(plan)
                .product(product)
                .amount(amount)
                .currency("USD")
                .user(user)
                .paymentProvider(PaymentProvider.FLUTTERWAVE)
                .providerReference(reference)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        transactionRepo.save(transaction);

        assert response.getBody() != null;
        PaymentResponseResolver checkoutUrl = paymentResponseResolver(response.getBody());
        checkoutUrl.setReferenceId(reference);
        return checkoutUrl;
    }

    @Override
    public String getPaymentProcessor(){
        return "Flutterwave";
    }

    // verify transaction Manually
    public void verifyTransaction(String reference){

        Transaction transaction = transactionRepo.findTransactionByProviderReference(reference)
                .orElseThrow(() -> new TransactionNotFound("Transaction not Found - Flutterwave"));

        // Idempotency Check
        if (transaction.getPaymentStatus().equals(PaymentStatus.SUCCESS)){
            log.info("Idempotency check passed!");
            return;
        }

        String url = "https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref="+reference;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer "+fwApiKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<PaymentResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                PaymentResponse.class
        );

        if(!response.getStatusCode().is2xxSuccessful()){
            log.warn("Verify transaction request failed. Status code: {}", response.getStatusCode());
            return;
        }

        if(response.getBody() == null){
            log.warn("Flutterwave returned null response");
            return;
        }

        PaymentResponse paymentResponse = response.getBody();
        Map<String, Object> data = paymentResponse.getData();

        // Validate Amount and currency
        BigDecimal incomingAmount = new BigDecimal(data.get("amount").toString());
        String currency = (String) data.get("currency");
        if (incomingAmount.compareTo(transaction.getAmount())!=0
                || !currency.equals(transaction.getCurrency())
                || !data.get("status").equals("successful")){
            log.warn("Fraud detected on Flutterwave Processor! Amount Expected: {}, Amount received: {}, Currency Expected: {}, Currency received: {}",
                    transaction.getAmount(), incomingAmount, transaction.getCurrency(), data.get("currency"));

            return;
        }
        transaction.setPaymentStatus(PaymentStatus.SUCCESS);
        transactionRepo.save(transaction);
        log.info("Transaction saved successfully. Status: {}", transaction.getPaymentStatus());
    }

    // ============================= HELPER METHODS =================================
    public PaymentResponseResolver paymentResponseResolver(PaymentResponse response){
        return getPaymentResponseResolver(response);
    }

    public FlutterUserDto buildCustomer(Users user){

        return FlutterUserDto.builder()
                .email(user.getEmail())
                .phone_number("08012345612")
                .name(user.getFullName())
                .build();
    }

    public FlutterCustomization customization(){

        return new FlutterCustomization(
                "MyMemori Payment",
                "https://res.cloudinary.com/dfcwftfmp/image/upload/v1766792191/MyMemori_Logo_zbno4a.jpg"
        );
    }
}
