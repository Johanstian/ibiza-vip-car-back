package com.ibiza.vip.car.core.repository;

import com.ibiza.vip.car.core.model.Tarea;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TareaRepository extends MongoRepository<Tarea, String> {
}
