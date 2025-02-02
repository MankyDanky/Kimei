package com.example.kimei.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    UserRepository userRepository;

    @CrossOrigin
    @PutMapping("/user/login")
    public ResponseEntity<User> getUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            User attemptedUser = userRepository.findByEmail(user.getEmail());
            if (attemptedUser.getPassword().equals(user.getPassword())) {
                return new ResponseEntity<>(attemptedUser, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @CrossOrigin
    @PostMapping("/user")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) == null) {
            return new ResponseEntity<>(userRepository.save(user), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @CrossOrigin
    @DeleteMapping("/user")
    public ResponseEntity<HttpStatus> deleteUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            User attemptedUser = userRepository.findByEmail(user.getEmail());
            if (attemptedUser.getPassword().equals(user.getPassword())) {
                userRepository.deleteById(attemptedUser.getID());
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @CrossOrigin
    @PutMapping("/user")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            User attemptedUser = userRepository.findByEmail(user.getEmail());
            if (attemptedUser.getPassword().equals(user.getPassword())) {
                user.setID(attemptedUser.getID());
                return new ResponseEntity<>(userRepository.save(user), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
