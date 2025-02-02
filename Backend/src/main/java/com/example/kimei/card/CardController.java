package com.example.kimei.card;

import java.util.List;

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

import com.example.kimei.deck.Deck;
import com.example.kimei.deck.DeckRepository;
import com.example.kimei.user.User;
import com.example.kimei.user.UserRepository;

@RestController
public class CardController {
    @Autowired
    private CardRepository cardRepository;
    @Autowired
    private DeckRepository deckRepository;
    @Autowired
    private UserRepository userRepository;

    // Validate user and deck
    boolean validateUserAndDeck(User user, Deck deck) {
        if (userRepository.existsById(user.getID())) {
            User attemptedUser = userRepository.findById(user.getID()).get();
            if (attemptedUser.getPassword().equals(user.getPassword())) {
                if (deckRepository.existsById(deck.getID())) {
                    return true;
                }
            }
        }
        return false;
    }

    // Add card to deck in database
    @CrossOrigin
    @PostMapping("/card")
    public ResponseEntity<Card> addCard(@RequestBody CardRequest cardRequest) {
        if (validateUserAndDeck(cardRequest.user(), cardRequest.deck())) {
            Card card = cardRequest.card();
            card.setDeck(deckRepository.findById(cardRequest.deck().getID()).get());
            return new ResponseEntity<>(cardRepository.save(card), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Get cards by deck from database
    @CrossOrigin
    @PutMapping("/cards")
    public ResponseEntity<List<Card>> getCardsByDeck(@RequestBody CardRequest cardRequest) {
        if (validateUserAndDeck(cardRequest.user(), cardRequest.deck())) {
            return new ResponseEntity<>(cardRepository.findByDeckID(cardRequest.deck().getID()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Delete card from deck in database
    @CrossOrigin
    @DeleteMapping("/card")
    public ResponseEntity<HttpStatus> deleteCard(@RequestBody CardRequest cardRequest) {
        if (validateUserAndDeck(cardRequest.user(), cardRequest.deck())) {
            if (cardRepository.existsById(cardRequest.card().getID())) {
                cardRepository.deleteById(cardRequest.card().getID());
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Delete all cards from deck in database
    @CrossOrigin
    @DeleteMapping("/cards")
    public ResponseEntity<HttpStatus> deleteCards(@RequestBody CardRequest cardRequest) {
        if (validateUserAndDeck(cardRequest.user(), cardRequest.deck())) {
            cardRepository.deleteByDeckID(cardRequest.deck().getID());
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Update card in deck in database
    @CrossOrigin
    @PutMapping("/card")
    public ResponseEntity<Card> updateCard(@RequestBody CardRequest cardRequest) {
        if (validateUserAndDeck(cardRequest.user(), cardRequest.deck())) {
            Card card = cardRequest.card();
            if (cardRepository.existsById(card.getID())) {
                card.setDeck(deckRepository.findById(cardRequest.deck().getID()).get());
                return new ResponseEntity<>(cardRepository.save(card), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
