package com.example.kimei.deck;

import com.example.kimei.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DeckRequest(Deck deck, User user) {

}
