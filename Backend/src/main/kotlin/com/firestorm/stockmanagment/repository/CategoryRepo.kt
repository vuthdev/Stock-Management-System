package com.firestorm.stockmanagment.repository

import com.firestorm.stockmanagment.model.Category
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoryRepo: JpaRepository<Category, Long> {
}