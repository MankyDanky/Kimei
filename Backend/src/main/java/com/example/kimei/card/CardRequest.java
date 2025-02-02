package com.example.kimei.card;

import com.example.kimei.deck.Deck;
import com.example.kimei.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CardRequest(Deck deck, Card card, User user) {
    
}
