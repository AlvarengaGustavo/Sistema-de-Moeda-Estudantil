package com.moedaestudantil.dto;

// 1. Importações do Lombok
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 2. Importação da sua entidade (ajuste o pacote se necessário)
import com.moedaestudantil.model.Aluno; 

// 3. Anotações do Lombok
@Getter
@Setter
@NoArgsConstructor // Cria o construtor padrão: public AlunoResponseDTO() {}
@AllArgsConstructor // Cria o construtor com todos os campos
public class AlunoResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private String rg;
    private String endereco;
    private String instituicaoDeEnsino;
    private String curso;

    // 4. Construtor de mapeamento (o que você pediu)
    //    Usado para converter a Entidade (Aluno) para este DTO
    public AlunoResponseDTO(Aluno aluno) {
        this.id = aluno.getId();
        this.nome = aluno.getNome();
        this.email = aluno.getEmail();
        this.cpf = aluno.getCpf();
        this.rg = aluno.getRg();
        this.endereco = aluno.getEndereco();
        this.instituicaoDeEnsino = aluno.getInstituicaoDeEnsino();
        this.curso = aluno.getCurso();
    }
}