package com.levelup.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.levelup.backend.entity.Notification;
import com.levelup.backend.entity.User;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByTimestampDesc(User user);

    void deleteByUser(User user);

}
