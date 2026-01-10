package com.firestorm.stockmanagment.controller

import com.firestorm.stockmanagment.dto.request.CategoryRequest
import com.firestorm.stockmanagment.dto.response.CategoryResponse
import com.firestorm.stockmanagment.service.CategoryService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RestController
@RequestMapping("/api/v1/categories")
class CategoryController (
    private val categoryService: CategoryService
) {
    @GetMapping
    fun getAll() =
        categoryService.getAll()

    @GetMapping("/{categoryId}")
    fun getById(@PathVariable categoryId: Long): ResponseEntity<CategoryResponse> =
        ResponseEntity.ok(categoryService.getById(categoryId))

    @PostMapping
    fun create(@RequestBody category: CategoryRequest): ResponseEntity<CategoryResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(categoryService.save(category))

    @PutMapping("/{categoryId}")
    fun update(@PathVariable categoryId: Long, @RequestBody category: CategoryRequest): ResponseEntity<CategoryResponse> =
        ResponseEntity.status(HttpStatus.OK).body(categoryService.update(category, categoryId))

    @DeleteMapping("/{categoryId}")
    fun delete(@PathVariable categoryId: Long): ResponseEntity<Unit> =
        ResponseEntity.status(HttpStatus.NO_CONTENT).body(categoryService.delete(categoryId))
}