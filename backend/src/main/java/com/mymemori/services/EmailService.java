package com.mymemori.services;

import com.mymemori.dto.EmailRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendMail(EmailRequest request){
        log.info("Initializing secure background email dispatch to {}", request.getTo());

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(request.getBody(), true);

            // setting sender
            String sender = (request.getFrom() != null) ? request.getFrom() : "no-reply@yourara.com";
            helper.setFrom(sender);

            mailSender.send(mimeMessage);
            log.info("Email structurally verified and sent successfully to {}", request.getTo());
        } catch (MessagingException e) {
            log.error("Unable to send secure message to {} : {}", request.getTo(), request.getSubject());

            // TO IMPLEMENT FALLBACK PROCESS LATER ON LIKE DEAD LETTER QUEUE USING OUR DB
            // OR WE'LL JUST MOVE TO RABBITMQ OR ANY CHEAPER SOLUTION OUT THERE
            throw new RuntimeException(e);
        }


    }
}
