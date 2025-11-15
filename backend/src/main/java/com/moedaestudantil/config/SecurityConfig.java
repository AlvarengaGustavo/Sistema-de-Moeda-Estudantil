package com.moedaestudantil.config;

// 1. [NOVAS IMPORTAÇÕES]
import com.moedaestudantil.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity // 2. [NOVO] Ativa a segurança web do Spring
public class SecurityConfig {

    // 3. [NOVO] Injeta o "porteiro" (filtro JWT) que criámos
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * O seu Bean existente (está correto)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 4. [NOVO] Bean que configura o CORS (para corrigir o seu erro de CORS)
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // [IMPORTANTE] Troque "http://localhost:3000" pela porta do seu React
        // (ex: "http://localhost:5173" se estiver a usar Vite)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173")); 
        
        // Métodos permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        
        // Cabeçalhos permitidos (essencial para o Authorization)
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuração a TODAS as rotas da API
        source.registerCorsConfiguration("/**", configuration); 
        
        return source;
    }

    /**
     * 5. [NOVO] Bean que configura toda a cadeia de segurança
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Ativa o CORS usando o Bean que criámos
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Desabilita CSRF (necessário para APIs stateless/JWT)
            .csrf(csrf -> csrf.disable())
            
            // Configura a política de sessão para STATELESS (não usar sessões)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Define as regras de autorização
            .authorizeHttpRequests(authorize -> authorize
                // Permite acesso público ao endpoint de login
                .antMatchers("/api/auth/login").permitAll() 
                
                // Exige autenticação para todas as outras rotas
                .anyRequest().authenticated() 
            )
            
            // [CRUCIAL] Adiciona o nosso filtro JWT antes do filtro padrão.
            // É ISTO que corrige o erro "principal is null".
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}