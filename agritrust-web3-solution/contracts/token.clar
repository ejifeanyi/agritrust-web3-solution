(define-data-var total-supply uint u1000000)

(define-public (mint (amount uint))
    (begin
        (var-set total-supply (+ (var-get total-supply) amount))
        (ok (var-get total-supply))
    )
)
