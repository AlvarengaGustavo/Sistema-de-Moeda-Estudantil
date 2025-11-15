package com.moedaestudantil.security;

import com.moedaestudantil.dto.login.UserDTO;
import com.moedaestudantil.dto.login.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException; // Importar
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException; // Importar
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException; // Importar
import io.jsonwebtoken.UnsupportedJwtException; // Importar
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger; // Importar
import org.slf4j.LoggerFactory; // Importar
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Importar
import org.springframework.security.core.Authentication; // Importar
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Importar
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Collections; // Importar
import java.util.Date;
import java.util.List; // Importar

@Component
public class JwtTokenProvider {
    
    // [NOVO] Logger
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret:c9e3697b6254fad7a7870e50864c5e31cf3c7ceda681cfd6297176cfe42e4bf2}")
    private String jwtSecret;

    @Value("${jwt.expiration.ms:86400000}") // Padrão de 24 horas
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

    // --- [NOVOS MÉTODOS PARA O JwtAuthenticationFilter] ---

    /**
     * Extrai todas as informações (claims) do token.
     */
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Valida o token (verifica se não expirou, assinatura correta, etc.)
     */
    public boolean validateToken(String token) {
        try {
            getClaimsFromToken(token);
            return true;
        } catch (SignatureException ex) {
            logger.error("Assinatura JWT inválida");
        } catch (MalformedJwtException ex) {
            logger.error("Token JWT malformado");
        } catch (ExpiredJwtException ex) {
            logger.error("Token JWT expirado");
        } catch (UnsupportedJwtException ex) {
            logger.error("Token JWT não suportado");
        } catch (IllegalArgumentException ex) {
            logger.error("Claims do JWT estão vazias");
        }
        return false;
    }

    /**
     * Obtém o objeto 'Authentication' (o 'Principal') a partir do token,
     * para ser usado pelo Spring Security.
     */
    public Authentication getAuthentication(String token) {
        Claims claims = getClaimsFromToken(token);

        // Extrai o email (subject)
        String email = claims.getSubject();
        
        // Extrai a role
        String role = claims.get("role", String.class);
        
        // Cria a autoridade (role) para o Spring Security
        // O "ROLE_" é um prefixo que o Spring Security espera
        List<SimpleGrantedAuthority> authorities = 
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));

        // Cria o 'Principal' (UsernamePasswordAuthenticationToken)
        // O primeiro argumento é o 'principal' (o email),
        // O segundo é 'credentials' (não temos, então é nulo),
        // O terceiro são as 'authorities' (roles).
        return new UsernamePasswordAuthenticationToken(email, null, authorities);
    }
}