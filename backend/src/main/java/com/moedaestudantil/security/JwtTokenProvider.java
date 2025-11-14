package com.moedaestudantil.security;

import com.moedaestudantil.dto.login.UserDTO;
import com.moedaestudantil.dto.login.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // 1. Gere uma chave secreta segura (ex: online) e coloque no application.properties
    // Ex: jwt.secret=sua-chave-secreta-muito-longa-e-segura-com-pelo-menos-256-bits
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration.ms}")
    private int jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Gera um token JWT para o usuário.
     * Armazenamos o ID, email, nome e ROLE dentro do token.
     */
    public String generateToken(UserDTO user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("id", user.getId())
                .claim("nome", user.getNome())
                .claim("role", user.getRole().name()) // Armazena a role como string
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}