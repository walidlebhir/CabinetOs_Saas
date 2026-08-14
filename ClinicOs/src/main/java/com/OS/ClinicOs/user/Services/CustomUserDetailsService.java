package com.OS.ClinicOs.user.Services;

import com.OS.ClinicOs.user.Entity.User;
import com.OS.ClinicOs.user.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userrepository;

    public CustomUserDetailsService(
            UserRepository userrepository
    ) {
        this.userrepository = userrepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userrepository.findByEmail(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}
