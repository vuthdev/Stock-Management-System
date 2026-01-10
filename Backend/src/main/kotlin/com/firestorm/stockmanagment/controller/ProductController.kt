package com.firestorm.stockmanagment.controller

import com.firestorm.stockmanagment.dto.request.ProductRequest
import com.firestorm.stockmanagment.dto.response.ProductResponse
import com.firestorm.stockmanagment.service.ProductService
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
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RestController
@RequestMapping("/api/v1/products")
class ProductController (
    private val productService: ProductService,
) {

    @GetMapping
    fun getAllProducts(): List<ProductResponse> =
        productService.findAll()

    @GetMapping("/{productId}")
    fun getById(@PathVariable productId: Long): ProductResponse =
        productService.findById(productId)

    @PostMapping
    fun create(@RequestBody request: ProductRequest): ResponseEntity<ProductResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(productService.save(request))

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{productId}")
    fun update(@PathVariable productId: Long, @RequestBody request: ProductRequest): ProductResponse =
        productService.update(request, productId)


    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{productId}")
    fun delete(@PathVariable productId: Long) =
        productService.delete(productId)
}