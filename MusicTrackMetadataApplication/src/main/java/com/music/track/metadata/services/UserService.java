package com.music.track.metadata.services;

import com.music.track.metadata.dto.UserData;
import com.music.track.metadata.entities.User;
import com.music.track.metadata.repositories.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository, ModelMapper modelMapper) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    public UserData getUser(String username) {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("The user was not found.");
        }

        return modelMapper.map(user, UserData.class);
    }

    public void createUser(UserData userData) {
        if (StringUtils.isBlank(userData.getUsername()) || StringUtils.isBlank(userData.getPassword())
            || StringUtils.isBlank(userData.getName())) {
            throw new IllegalArgumentException("The user fields are not correct.");
        }

        if (userRepository.existsByUsername(userData.getUsername())) {
            throw new IllegalArgumentException("The user is already registered.");
        }

        User user = modelMapper.map(userData, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserData user = getUser(username);

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(user.getPermission())
                .build();
    }
}
