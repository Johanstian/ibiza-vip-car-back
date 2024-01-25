package com.ibiza.vip.car.core.controller;

import com.ibiza.vip.car.core.model.Tarea;
import com.ibiza.vip.car.core.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tareas")
@CrossOrigin()
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    @GetMapping
    List<Tarea> index() {
        return tareaRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    Tarea create(@RequestBody Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    @PutMapping("{id}")
    Tarea update(@PathVariable String id, @RequestBody Tarea tarea) {
        Tarea tareaFromDb = tareaRepository.findById(id).orElseThrow(RuntimeException::new);
        tareaFromDb.setNombre(tarea.getNombre());
        tareaFromDb.setCompletado(tarea.isCompletado());
        tareaRepository.save(tareaFromDb);
        return tareaRepository.save(tareaFromDb);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable String id) {
        Tarea tarea = tareaRepository.findById(id).orElseThrow(RuntimeException::new);
        tareaRepository.delete(tarea);
    }
}
