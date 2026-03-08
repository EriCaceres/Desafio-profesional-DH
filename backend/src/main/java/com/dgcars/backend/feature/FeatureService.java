package com.dgcars.backend.feature;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FeatureService {

    private final FeatureRepository repo;

    public FeatureService(FeatureRepository repo) {
        this.repo = repo;
    }

    public List<Feature> findAll() {
        return repo.findAll();
    }

    public Feature create(Feature f) {
        if (f.getName() == null || f.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        if (f.getIcon() == null || f.getIcon().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ícono es obligatorio");
        }
        if (repo.findByName(f.getName()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre de característica ya existe");
        }
        return repo.save(f);
    }

    public Feature update(Long id, Feature f) {
        Feature existing = repo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Característica no encontrada"));

        if (f.getName() == null || f.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        if (f.getIcon() == null || f.getIcon().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ícono es obligatorio");
        }

        existing.setName(f.getName());
        existing.setIcon(f.getIcon());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Característica no encontrada");
        }
        repo.deleteById(id);
    }
}
