package com.moedaestudantil.dto.login;

import com.moedaestudantil.model.Admin;
import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.model.Professor;


public class UserDTO {

    private Long id;
    private String nome;
    private String email;
    private int saldoMoedas = 0;
    private UserRole role;

    // Construtores sobrecarregados para cada tipo de entidade

    public UserDTO(Aluno aluno) {
        this.id = aluno.getId();
        this.nome = aluno.getNome();
        this.email = aluno.getEmail();
        this.saldoMoedas = aluno.getSaldoMoedas();
        this.role = UserRole.ALUNO;
    }

    public UserDTO(Professor professor) {
        this.id = professor.getId();
        this.nome = professor.getNome();
        this.email = professor.getEmail();
        this.role = UserRole.PROFESSOR;
    }

    public UserDTO(EmpresaParceira empresa) {
        this.id = empresa.getId();
        this.nome = empresa.getNome();
        this.email = empresa.getEmail();
        this.role = UserRole.EMPRESA;
    }

    public UserDTO(Admin admin) {
        this.id = admin.getId();
        this.nome = "";
        this.email = admin.getEmail();
        this.role = UserRole.ADMIN;
    }

    // Getters (necessários para a serialização JSON)
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public int getSaldoMoedas() { return saldoMoedas;}
    public UserRole getRole() { return role; }
}
