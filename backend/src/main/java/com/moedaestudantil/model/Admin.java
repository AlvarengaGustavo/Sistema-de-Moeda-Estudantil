package com.moedaestudantil.model;

import javax.persistence.*;

@Entity
@Table(name = "admins", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"email"})
})
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    // Construtores, Getters e Setters
    public Admin() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}