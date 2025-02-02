package com.example.kimei.card;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.example.kimei.deck.Deck;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "cards")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int ID;
    @Column(name="card_front")
    private String cardFront;
    @Column(name="card_back")
    private String cardBack;
    @Lob
    @Column(name="image")
    private String image;

    @ManyToOne
    @JoinColumn(name="deck_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Deck deck;

    public Card() {}

    public Card(String cardFront, String cardBack, String image) {
        this.cardFront = cardFront;
        this.cardBack = cardBack;
        this.image = image;
    }

    public int getID() {
        return ID;
    }

    public void setID(int iD) {
        ID = iD;
    }

    public String getCardFront() {
        return cardFront;
    }

    public void setCardFront(String cardFront) {
        this.cardFront = cardFront;
    }

    public String getCardBack() {
        return cardBack;
    }

    public void setCardBack(String cardBack) {
        this.cardBack = cardBack;
    }

    public Deck getDeck() {
        return deck;
    }

    public void setDeck(Deck deck) {
        this.deck = deck;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
