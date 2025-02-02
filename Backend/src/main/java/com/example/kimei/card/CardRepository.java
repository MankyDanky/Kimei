package com.example.kimei.card;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;

public interface CardRepository extends JpaRepository<Card, Integer> {
    List<Card> findByDeckID(int deckID);

    @Transactional
    void deleteByDeckID(int deckID);
}
