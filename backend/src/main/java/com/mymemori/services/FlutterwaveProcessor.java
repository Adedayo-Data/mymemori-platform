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
import org.springframework.web.servlet.function.ServerRequest;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

import static com.mymemori.services.PaystackProcessor.getPaymentResponseResolver;

@Service
@Slf4j
@AllArgsConstructor
@NoArgsConstructor(force = true)
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

    @Value("${api-secret-fw}")
    private final String fwApiKey;

    @Override
    public PaymentResponseResolver initializePayment(PaymentRequest request){

        Users user = authUser.fetchAuthenticatedUser();

        if (user == null){
            throw new UserNotFoundException("No Authenticated user found!");
        }

        BigDecimal amount = BigDecimal.ZERO;
        String reference = null;
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

        // create request object
        FlutterPaymentRequest paymentRequest = FlutterPaymentRequest.builder()
                .amount(amount)
                .tx_ref(reference)
                .currency("USD")
                .redirect_url("https://mymemori.site")
                .customer(buildCustomer(user))
                .customization(customization())
                .payment_options("card, ussd, banktransfer, account, internetbanking, mpesa, applepay, googlepay, ghanamobilemoney, opay")
                .build();

        // set headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " +fwApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("accept", "application/json");

        HttpEntity<FlutterPaymentRequest> entity = new HttpEntity<>(paymentRequest, headers);

        String url = "https://api.flutterwave.com/v3/payments";

        ResponseEntity<PaymentResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                PaymentResponse.class
        );

        // check HttpStatus response
        if (response.getStatusCode() == HttpStatusCode.valueOf(400)){
            return null;
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
    public Map<String, String> verifyTransaction(String reference){

        String url = "https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=" + reference;

        // define header
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer "+fwApiKey);

        // define the entity
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // rest Template
        ResponseEntity<PaymentResponse> apiResponse = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                PaymentResponse.class
        );

        if (apiResponse.getStatusCode() == HttpStatusCode.valueOf(400) ||
                !apiResponse.getBody().getData().get("status").equals("successful")){

            return null;
        }
        Transaction transaction = transactionRepo.findTransactionByProviderReference(reference)
                .orElseThrow(() -> new TransactionNotFound("Transaction not found!"));

        transaction.setPaymentStatus(PaymentStatus.SUCCESS);
        transactionRepo.save(transaction);
        return Map.of("Message", "Payment Successful");
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
