package com.levelup.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.levelup.backend.entity.Status;
import com.levelup.backend.entity.User;

public interface StatusRepository extends JpaRepository<Status, Long> {

    List<Status> findByUser(User user);

    List<Status> findByExpiresAtAfter(LocalDateTime now);

    void deleteByUser(User user);

}
