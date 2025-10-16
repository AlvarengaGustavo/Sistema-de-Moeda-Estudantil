package com.moedaestudantil.dto;

public class AlunoResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private String rg;
    private String endereco;
    private String instituicaoDeEnsino;
    private String curso;

    public AlunoResponseDTO() {}

    public AlunoResponseDTO(Long id, String nome, String email, String cpf, String rg, String endereco, String instituicaoDeEnsino, String curso) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.rg = rg;
        this.endereco = endereco;
        this.instituicaoDeEnsino = instituicaoDeEnsino;
        this.curso = curso;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getInstituicaoDeEnsino() {
        return instituicaoDeEnsino;
    }

    public void setInstituicaoDeEnsino(String instituicaoDeEnsino) {
        this.instituicaoDeEnsino = instituicaoDeEnsino;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }
}
