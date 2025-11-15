package com.moedaestudantil.security;

// Adicionamos a importação explícita para o JwtTokenProvider
import com.moedaestudantil.security.JwtTokenProvider; 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * [FICHEIRO NOVO]
 * Este é o filtro que intercepta TODAS as requisições para validar o token JWT.
 * Ele é o "porteiro" que diz ao Spring Security quem é o utilizador logado.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Este método é executado para cada requisição.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        try {
            // 1. Tenta extrair o token da requisição
            String token = getTokenFromRequest(request);

            // 2. Verifica se o token existe e é válido
            // (Adicione o método validateToken ao seu JwtTokenProvider)
            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                
                // 3. Se for válido, obtém os dados de autenticação (Principal)
                // (Adicione o método getAuthentication ao seu JwtTokenProvider)
                Authentication authentication = jwtTokenProvider.getAuthentication(token);
                
                // 4. [CRUCIAL] Define a autenticação no Contexto de Segurança do Spring
                // É ISTO que faz o 'Principal' deixar de ser nulo no Controller.
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            // Se houver um erro ao validar o token, apenas logamos.
            logger.error("Não foi possível definir a autenticação do utilizador: {}", ex.getMessage());
        }

        // 5. Continua a cadeia de filtros (passa a requisição para o próximo filtro)
        filterChain.doFilter(request, response);
    }

    /**
     * Método auxiliar para extrair o token "Bearer" do cabeçalho Authorization.
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        // O cabeçalho deve ser: "Authorization: Bearer <token>"
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            // Retorna apenas a parte do <token>
            return bearerToken.substring(7);
        }

        return null;
    }
}