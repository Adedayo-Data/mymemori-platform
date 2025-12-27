package com.mymemori.exception;

public class LocationNotFoundException extends RuntimeException {

    public LocationNotFoundException(String message){
        super(message);
    }
}
