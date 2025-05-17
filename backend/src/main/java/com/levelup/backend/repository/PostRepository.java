package com.levelup.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.levelup.backend.entity.Post;
import com.levelup.backend.entity.User;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUser(User user);

    List<Post> findByUserInOrderByCreatedAtDesc(List<User> users);

}
