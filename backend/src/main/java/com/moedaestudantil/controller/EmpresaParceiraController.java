package com.moedaestudantil.controller;

import com.moedaestudantil.dto.EmpresaParceiraRequestDTO;
import com.moedaestudantil.dto.EmpresaParceiraResponseDTO;
import com.moedaestudantil.service.EmpresaParceiraService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@Validated
public class EmpresaParceiraController {

    private final EmpresaParceiraService empresaService;

    public EmpresaParceiraController(EmpresaParceiraService empresaService) {
        this.empresaService = empresaService;
    }

    @PostMapping
    public ResponseEntity<EmpresaParceiraResponseDTO> criar(@Valid @RequestBody EmpresaParceiraRequestDTO dto) {
        EmpresaParceiraResponseDTO criado = empresaService.criar(dto);
        return new ResponseEntity<>(criado, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EmpresaParceiraResponseDTO>> listar() {
        return ResponseEntity.ok(empresaService.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaParceiraResponseDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(empresaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaParceiraResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody EmpresaParceiraRequestDTO dto) {
        return ResponseEntity.ok(empresaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        empresaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
