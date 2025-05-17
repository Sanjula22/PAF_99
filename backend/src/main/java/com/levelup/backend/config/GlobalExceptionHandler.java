//package com.levelup.backend.config;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.ResponseStatus;
//import org.springframework.web.servlet.resource.NoResourceFoundException;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@ControllerAdvice
//@Configuration
//public class GlobalExceptionHandler {
//
//    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
//
//    @ExceptionHandler(NoResourceFoundException.class)
//    @ResponseStatus(HttpStatus.NOT_FOUND)
//    public ResponseEntity<Map<String, String>> handleNoResourceFoundException(NoResourceFoundException ex) {
//        logger.warn("Resource not found: {}", ex.getMessage());
//        Map<String, String> error = new HashMap<>();
//        error.put("error", "Resource not found: " + ex.getResourcePath());
//        error.put("details", ex.getClass().getSimpleName());
//        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
//    }
//
//    @ExceptionHandler(Exception.class)
//    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
//    public ResponseEntity<Map<String, String>> handleAllExceptions(Exception ex) {
//        logger.error("Unexpected error occurred", ex);
//        Map<String, String> error = new HashMap<>();
//        error.put("error", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred");
//        error.put("details", ex.getClass().getSimpleName());
//        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//
//    @ExceptionHandler(RuntimeException.class)
//    @ResponseStatus(HttpStatus.BAD_REQUEST)
//    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
//        logger.error("Runtime error occurred", ex);
//        Map<String, String> error = new HashMap<>();
//        error.put("error", ex.getMessage());
//        error.put("details", ex.getClass().getSimpleName());
//        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
//    }
//
//    @Bean(name = "globalExceptionHandlerConfig")
//    public GlobalExceptionHandler globalExceptionHandler() {
//        return this;
//    }
//}