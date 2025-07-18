(define-map marketplace
  { id: uint }
  {
    price: uint,
    quantity: uint,
    seller: principal
  }
)

(define-public (list-item (id uint) (price uint) (quantity uint))
  (begin
    (map-set marketplace
      { id: id }
      { price: price, quantity: quantity, seller: tx-sender }
    )
    (ok true)
  )
)
