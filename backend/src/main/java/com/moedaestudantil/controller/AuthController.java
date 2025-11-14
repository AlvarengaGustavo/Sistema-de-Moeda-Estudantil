package com.moedaestudantil.controller;

import com.moedaestudantil.dto.login.LoginRequestDTO;
import com.moedaestudantil.dto.login.LoginResponseDTO;
import com.moedaestudantil.service.AuthService;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // Endpoint base para autenticação
@CrossOrigin(origins = "*") // Permite requisições do front-end (ajuste se necessário)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint de Login.
     * Recebe um email e senha e retorna um JWT se for válido.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            LoginResponseDTO response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        // } catch (Exception e) {
        //     // Retorna 401 Unauthorized se as credenciais forem inválidas
        //     return ResponseEntity.status(401).build();
        } catch (Exception e) {
            // Retorna 500 para outros erros inesperados
            return ResponseEntity.status(500).build();
        }
    }
}