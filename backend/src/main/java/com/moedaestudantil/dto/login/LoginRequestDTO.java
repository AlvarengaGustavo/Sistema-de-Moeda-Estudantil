package com.moedaestudantil.dto.login;

/**
 * DTO que representa o corpo da requisição de login (o que o front-end envia).
 * Convertido para uma classe padrão para compatibilidade com Java 11 (que não suporta 'records').
 */
public class LoginRequestDTO {

    private String email;
    private String senha;

    // Construtor padrão (necessário para deserialização do Jackson/JSON)
    public LoginRequestDTO() {}

    // Construtor com campos (opcional, mas útil)
    public LoginRequestDTO(String email, String senha) {
        this.email = email;
        this.senha = senha;
    }

    // Getters (necessários para o AuthService e serialização)
    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }

    // Setters (necessários para deserialização)
    public void setEmail(String email) {
        this.email = email;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}