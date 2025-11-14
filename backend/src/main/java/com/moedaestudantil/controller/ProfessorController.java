package com.moedaestudantil.controller;

import com.moedaestudantil.dto.EnviarMoedasRequestDTO;
import com.moedaestudantil.dto.ExtratoResponseDTO;
import com.moedaestudantil.dto.ProfessorDTO;
import com.moedaestudantil.dto.ProfessorResponseDTO;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.service.ProfessorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/professores")
@Validated
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @GetMapping
    public ResponseEntity<List<ProfessorResponseDTO>> listar() {
        return ResponseEntity.ok(professorService.listarProfessores());
    }

    @PostMapping
    public ResponseEntity<Professor> createProfessor(@Valid @RequestBody ProfessorDTO professorDTO) {
        Professor novoProfessor = professorService.createProfessor(professorDTO);
        // Retorna o professor criado com status 201 Created
        return new ResponseEntity<>(novoProfessor, HttpStatus.CREATED);
    }

    /**
     * Endpoint para atualizar um professor existente. PUT /api/professores/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Professor> updateProfessor(@PathVariable Long id, @Valid @RequestBody ProfessorDTO professorDTO) {
        Professor professorAtualizado = professorService.updateProfessor(id, professorDTO);
        return ResponseEntity.ok(professorAtualizado);
    }

    /**
     * Endpoint para excluir um professor. DELETE /api/professores/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfessor(@PathVariable Long id) {
        professorService.deleteProfessor(id);
        // Retorna 204 No Content
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{professorId}/enviar-moedas")
    public ResponseEntity<Void> enviarMoedas(@PathVariable Long professorId,
            @Valid
            @RequestBody EnviarMoedasRequestDTO req) {
        professorService.enviarMoedas(professorId, req);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/{professorId}/extrato")
    public ResponseEntity<ExtratoResponseDTO> extrato(@PathVariable Long professorId) {
        return ResponseEntity.ok(professorService.extratoProfessor(professorId));
    }
}
