package com.firestorm.stockmanagment.repository

import com.firestorm.stockmanagment.model.Order
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface OrderRepo: JpaRepository<Order, Long> {
}