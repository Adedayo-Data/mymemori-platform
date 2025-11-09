package com.mymemori.controller;

import com.mymemori.Repository.UserRepository;
import com.mymemori.dto.AuthMessage;
import com.mymemori.dto.LoginRequest;
import com.mymemori.dto.UserRequestDTO;
import com.mymemori.models.Users;
import com.mymemori.security.JwtService;
import org.apache.logging.log4j.message.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PasswordEncoder passEncoder;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/sign-up")
    public ResponseEntity<AuthMessage> register(@RequestBody UserRequestDTO request){
        System.out.println("COntroller entered!");
        System.out.println("Request data: " +request.getEmail());
        Users user = new Users();

        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passEncoder.encode(request.getPassword()));
        System.out.println("Done Passing info to model");
        // save user
        Users savedUser = userRepo.save(user);
        System.out.println("Saved user: " + savedUser);

        // generate JWT
        String token = jwtService.generateToken(savedUser);

        // Map to AuthMessage
        AuthMessage message = new AuthMessage();

        message.setEmail(savedUser.getEmail());
        message.setToken(token);
        message.setFullName(savedUser.getFullName());
        message.setMessage("Sign-up Successful");

        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    // sign in
    @PostMapping("/sign-in")
    public ResponseEntity<AuthMessage> Login(@RequestBody LoginRequest request){

        // check if user Exist in the db
        Users user = userRepo.findByEmail(request.getEmail());

        if (user == null){
            throw new RuntimeException("User not found!");
        }

        String reqPass = request.getPassword();
        if (!passEncoder.matches(reqPass, user.getPassword())){
            throw new RuntimeException("Incorrect password"); // TO FIX: Should return error message instead
        }

        // generate token
        String token = jwtService.generateToken(user);

        // Map to AuthMessage
        AuthMessage message = new AuthMessage();

        message.setEmail(user.getEmail());
        message.setToken(token);
        message.setFullName(user.getFullName());
        message.setMessage("Sign-in Successful");

        return ResponseEntity.status(HttpStatus.OK).body(message);
    }
}
