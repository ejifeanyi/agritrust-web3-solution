;; Insurance Premium Payment Contract

(define-data-var admin principal tx-sender)

;; Tracks total premium paid per user
(define-map premiums principal uint)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-INVALID-AMOUNT u101)

;; Internal admin check
(define-private (is-admin)
  (is-eq tx-sender (var-get admin)))

;; Pay insurance premium
(define-public (pay-premium (amount uint))
  (begin
    (asserts! (> amount u0) (err ERR-INVALID-AMOUNT))
    (let ((prev (default-to u0 (map-get? premiums tx-sender))))
      (map-set premiums tx-sender (+ prev amount))
    )
    (ok true)))

;; Read-only: Check user premium
(define-read-only (get-premium (user principal))
  (default-to u0 (map-get? premiums user)))

;; Transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)))
