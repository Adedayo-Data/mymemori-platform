package com.mymemori.services;

import com.mymemori.util.EmailTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailRenderer {

    private final TemplateEngine templateEngine;

    public String render(EmailTemplate template, Map<String, Object> variables){
        Context context = new Context();
        context.setVariables(variables);

        return templateEngine.process(template.getTemplateName(), context);
    }
}
