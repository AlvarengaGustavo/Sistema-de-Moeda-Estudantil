package com.moedaestudantil.dto;

// Usaremos Lombok para reduzir o boilerplate (getters, setters, etc.)
// Se não estiver a usar, pode criar os getters/setters manualmente.
// import lombok.Getter;
// import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

// @Getter // Removido
// @Setter // Removido
public class ProfessorDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    @Size(min = 11, max = 11, message = "CPF deve ter 11 dígitos")
    private String cpf;

    @NotBlank(message = "Departamento é obrigatório")
    private String departamento;

    @NotBlank
    private String instituicao;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    /**
     * A senha só é obrigatória na criação.
     * Na atualização, se for nula ou vazia, manteremos a senha antiga.
     */
    private String senha;

    // Não incluímos campos como saldoMoedas, ultimaCota, etc.
    // O service irá gerir isso.
    
    // --- GETTERS E SETTERS MANUAIS ---
    // Adicionados porque o Lombok não está a funcionar no seu ambiente

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getInstituicao() {
        return instituicao;
    }

    public void setInstituicao(String instituicao) {
        this.instituicao = instituicao;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}