package com.moedaestudantil.dto.login;

public class LoginResponseDTO {

    private String token;
    private UserDTO user;

    // Construtor padrão
    public LoginResponseDTO() {}

    // Construtor com campos
    public LoginResponseDTO(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
    
    // Getters e Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserDTO getUser() {
        return user;
    }
    
    public void setUser(UserDTO user) {
        this.user = user;
    }
}