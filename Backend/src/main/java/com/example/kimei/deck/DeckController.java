package com.example.kimei.deck;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.kimei.user.User;
import com.example.kimei.user.UserRepository;

@RestController
public class DeckController {
    @Autowired
    private DeckRepository deckRepository;
    @Autowired
    private UserRepository userRepository;

    // Validate user
    boolean validateUser(User user) {
        if (userRepository.existsById(user.getID())) {
            User attemptedUser = userRepository.findById(user.getID()).get();
            if (attemptedUser.getPassword().equals(user.getPassword())) {
                return true;
            }
        }
        return false;
    }

    // Add deck of user to database
    @CrossOrigin
    @PostMapping("/deck")
    public ResponseEntity<Deck> addDeck(@RequestBody DeckRequest deckRequest) {
        System.out.println(deckRequest.user().getID());
        if (validateUser(deckRequest.user())) {
            Deck deck = deckRequest.deck();
            deck.setUser(userRepository.findById(deckRequest.user().getID()).get());
            return new ResponseEntity<>(deckRepository.save(deckRequest.deck()), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Get decks of user from database
    @CrossOrigin
    @PutMapping("/decks")
    public ResponseEntity<List<Deck>> getDecks(@RequestBody User user) {
        if (validateUser(user)) {
            return new ResponseEntity<>(deckRepository.findByUserID(user.getID()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
    }

    // Get deck of user by ID from database
    @CrossOrigin
    @PutMapping("/deck/{id}")
    public ResponseEntity<Deck> getDeck(@RequestBody User user, @PathVariable("id") int id) {
        if (validateUser(user)) {
            if (deckRepository.existsById(id)) {
                if (deckRepository.findById(id).get().getUser().getID() == user.getID()) {
                    return new ResponseEntity<>(deckRepository.findById(id).get(), HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Delete deck of user from database
    @CrossOrigin
    @DeleteMapping("/deck")
    public ResponseEntity<HttpStatus> deleteDeck(@RequestBody DeckRequest deckRequest) {
        if (validateUser(deckRequest.user())) {
            Deck deck = deckRequest.deck();
            if (deckRepository.existsById(deck.getID())) {
                deckRepository.deleteById(deck.getID());
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Delete all decks of user from database
    @CrossOrigin
    @DeleteMapping("/decks")
    public ResponseEntity<HttpStatus> deleteDecks(@RequestBody DeckRequest deckRequest) {
        if (validateUser(deckRequest.user())) {
            deckRepository.deleteByUserID(deckRequest.user().getID());
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Update deck of user in database
    @CrossOrigin
    @PutMapping("/deck")
    public ResponseEntity<Deck> updateDeck(@RequestBody DeckRequest deckRequest) {
        if (validateUser(deckRequest.user())) {
            Deck deck = deckRequest.deck();
            if (deckRepository.existsById(deck.getID())) {
                deck.setUser(userRepository.findById(deckRequest.user().getID()).get());
                return new ResponseEntity<>(deckRepository.save(deck), HttpStatus.OK);
            } else {    
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
