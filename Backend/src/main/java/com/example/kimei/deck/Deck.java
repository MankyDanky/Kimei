package com.example.kimei.deck;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.example.kimei.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "decks")
public class Deck {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int ID;
    @Column(name = "deck_name")
    private String deckName;

    @ManyToOne
    @JoinColumn(name="user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;

    public Deck(String deckName) {
        this.deckName = deckName;
    }

    public Deck() {}
    
    public int getID() {
        return ID;
    }
    public void setID(int iD) {
        ID = iD;
    }
    public String getDeckName() {
        return deckName;
    }
    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}   
