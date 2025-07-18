(define-data-var admin principal tx-sender)

;; Farmer data: {premium-paid: uint, has-claimed: bool}
(define-map farmers principal {premium-paid: uint, has-claimed: bool})

;; Constants
(define-constant ERR-NOT-ADMIN u100)
(define-constant ERR-ALREADY-REGISTERED u101)
(define-constant ERR-NOT-REGISTERED u102)
(define-constant ERR-ALREADY-CLAIMED u103)
(define-constant ERR-NO-PREMIUM u104)

;; Only admin check
(define-private (is-admin)
  (is-eq tx-sender (var-get admin)))

;; Register farmer
(define-public (register-farmer (farmer principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-ADMIN))
    (asserts! (is-none (map-get? farmers farmer)) (err ERR-ALREADY-REGISTERED))
    (ok (map-set farmers farmer {premium-paid: u0, has-claimed: false}))
  )
)

;; Pay premium
(define-public (pay-premium (amount uint))
  (let ((record (map-get? farmers tx-sender)))
    (match record
      record-val
      (begin
        (map-set farmers tx-sender {
          premium-paid: (+ (get premium-paid record-val) amount),
          has-claimed: (get has-claimed record-val)
        })
        (ok true)
      )
      (err ERR-NOT-REGISTERED)
    )
  )
)

;; Claim insurance
(define-public (claim-insurance)
  (let ((record (map-get? farmers tx-sender)))
    (match record
      record-val
      (begin
        (asserts! (not (get has-claimed record-val)) (err ERR-ALREADY-CLAIMED))
        (asserts! (> (get premium-paid record-val) u0) (err ERR-NO-PREMIUM))
        (map-set farmers tx-sender {
          premium-paid: u0,
          has-claimed: true
        })
        (ok true)
      )
      (err ERR-NOT-REGISTERED)
    )
  )
)

;; Admin approves payout
(define-public (approve-payout (farmer principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-ADMIN))
    (let ((record (map-get? farmers farmer)))
      (match record
        record-val
        (ok {farmer: farmer, payout: (get premium-paid record-val)})
        (err ERR-NOT-REGISTERED)
      )
    )
  )
)
