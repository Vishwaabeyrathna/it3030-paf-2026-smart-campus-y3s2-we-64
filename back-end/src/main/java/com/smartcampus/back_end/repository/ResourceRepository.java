package com.smartcampus.back_end.repository;

import com.smartcampus.back_end.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
}
