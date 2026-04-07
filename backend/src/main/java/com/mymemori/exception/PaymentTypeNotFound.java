package com.mymemori.exception;

public class PaymentTypeNotFound extends RuntimeException {

    public PaymentTypeNotFound(String message){
        super(message);
    }
}
