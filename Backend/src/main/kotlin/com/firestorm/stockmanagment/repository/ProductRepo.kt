package com.firestorm.stockmanagment.repository

import com.firestorm.stockmanagment.model.Product
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProductRepo: JpaRepository<Product, Long> {
}