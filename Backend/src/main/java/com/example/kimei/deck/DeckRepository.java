package com.example.kimei.deck;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;

public interface DeckRepository extends JpaRepository<Deck, Integer> {
    List<Deck> findByUserID(int userID);

    @Transactional
    void deleteByUserID(int userID);
}
