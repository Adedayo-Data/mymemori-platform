package com.mymemori.util;

import lombok.Getter;

@Getter
public enum EmailTemplate {

    PASSWORD_RESET("templates/emails/password-reset",  "Reset your MyMemori App Password");

    private final String templateName;
    private final String subject;

    EmailTemplate(String templateName, String subject){
        this.templateName = templateName;
        this.subject = subject;
    }

}
