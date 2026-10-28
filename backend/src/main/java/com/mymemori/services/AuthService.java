package com.mymemori.services;

import com.mymemori.Repository.UserRepository;
import com.mymemori.dto.EmailRequest;
import com.mymemori.exception.UserNotFoundException;
import com.mymemori.models.Users;
import com.mymemori.util.EmailTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepo;
    private final EmailService emailService;
    private final EmailRenderer renderMail;
    private final PasswordResetTokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void forgotPassword(String email) {
        // Silently return if user not found — prevents email enumeration
        Users user = userRepo.findByEmail(email);
        if (user == null) {
            log.info("Forgot password requested for unknown email (silently ignored)");
            return;
        }

        log.info("Sending forgot password mail to: {}", email);

        // Generate a cryptographically-secure raw token and persist its hash
        String rawToken = tokenService.createToken(user.getId());

        // Build the reset link that the frontend will receive
        String resetLink = frontendUrl + "/reset-password?token=" + rawToken;

        Map<String, Object> vars = new HashMap<>();
        vars.put("name", user.getFullName());
        vars.put("resetLink", resetLink);

        sendForgotPasswordMail(email, vars);
    }

    /**
     * Validates the raw token, burns it (one-time use), and updates the user's password.
     *
     * @param rawToken    the token from the URL query param
     * @param newPassword the new plain-text password chosen by the user
     */
    public void resetPassword(String rawToken, String newPassword) {
        // consume() throws InvalidResetTokenException if the token is invalid/expired/already used
        UUID userId = tokenService.consume(rawToken);

        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        log.info("Password reset successfully for userId={}", userId);
    }

    public void sendForgotPasswordMail(String mail, Map<String, Object> variables) {
        String from = "no-reply@yourara.com";
        String subject = EmailTemplate.PASSWORD_RESET.getSubject();
        String body = renderMail.render(EmailTemplate.PASSWORD_RESET, variables);

        EmailRequest request = new EmailRequest(
                mail,
                from,
                subject,
                body
        );

        log.info("Mail request built successfully with subject: {}", request.getSubject());
        emailService.sendMail(request);
    }
}

