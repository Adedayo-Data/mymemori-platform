package com.mymemori.util;

import com.mymemori.models.UserPrincipal;
import com.mymemori.models.Users;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.authentication.AuthenticationTrustResolverImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUser {

    // fetch Authenticated User
    public Users fetchAuthenticatedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AuthenticationTrustResolver trustResolver = new AuthenticationTrustResolverImpl();

        if (authentication != null && trustResolver.isAnonymous(authentication)){
            // user is anonymous
            return null;
        }

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return principal.getUser();
    }
}
