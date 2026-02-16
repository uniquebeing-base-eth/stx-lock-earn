;; Stack Lock - Self-Accountability Smart Contract
;; V1: Lock STX, complete goal before deadline, or lose funds forever

;; ============================================
;; DATA
;; ============================================

(define-map locks
  { id: uint }
  {
    owner: principal,
    amount: uint,
    deadline: uint,
    completed: bool,
    withdrawn: bool
  }
)

(define-data-var next-lock-id uint u1)

;; ============================================
;; ERROR CODES
;; ============================================

(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-ALREADY-COMPLETED (err u101))
(define-constant ERR-DEADLINE-PASSED (err u102))
(define-constant ERR-NOT-COMPLETED (err u103))
(define-constant ERR-ALREADY-WITHDRAWN (err u104))
(define-constant ERR-LOCK-NOT-FOUND (err u105))
(define-constant ERR-INVALID-AMOUNT (err u106))
(define-constant ERR-INVALID-DEADLINE (err u107))

;; ============================================
;; READ-ONLY FUNCTIONS
;; ============================================

(define-read-only (get-lock (id uint))
  (map-get? locks { id: id })
)

(define-read-only (get-next-lock-id)
  (var-get next-lock-id)
)

;; ============================================
;; PUBLIC FUNCTIONS
;; ============================================

;; 1. Create a new lock
;; - Transfers STX from caller to contract
;; - Stores lock data
;; - Increments next-lock-id
(define-public (create-lock (amount uint) (deadline uint))
  (let
    (
      (lock-id (var-get next-lock-id))
    )
    ;; Validate amount > 0
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    ;; Validate deadline > current block height
    (asserts! (> deadline stacks-block-height) ERR-INVALID-DEADLINE)
    ;; Transfer STX from sender to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    ;; Store lock
    (map-set locks
      { id: lock-id }
      {
        owner: tx-sender,
        amount: amount,
        deadline: deadline,
        completed: false,
        withdrawn: false
      }
    )
    ;; Increment ID
    (var-set next-lock-id (+ lock-id u1))
    ;; Return lock ID
    (ok lock-id)
  )
)

;; 2. Mark a lock as completed
;; - Only owner can call
;; - Only before deadline
;; - Only if not already completed
(define-public (complete-lock (id uint))
  (let
    (
      (lock (unwrap! (map-get? locks { id: id }) ERR-LOCK-NOT-FOUND))
    )
    ;; Only owner
    (asserts! (is-eq tx-sender (get owner lock)) ERR-NOT-OWNER)
    ;; Not already completed
    (asserts! (not (get completed lock)) ERR-ALREADY-COMPLETED)
    ;; Before deadline
    (asserts! (<= stacks-block-height (get deadline lock)) ERR-DEADLINE-PASSED)
    ;; Update lock
    (map-set locks
      { id: id }
      (merge lock { completed: true })
    )
    (ok true)
  )
)

;; 3. Withdraw STX after completion
;; - Must be owner
;; - Must be completed
;; - Must not already be withdrawn
;; - Must be before deadline
(define-public (withdraw (id uint))
  (let
    (
      (lock (unwrap! (map-get? locks { id: id }) ERR-LOCK-NOT-FOUND))
    )
    ;; Only owner
    (asserts! (is-eq tx-sender (get owner lock)) ERR-NOT-OWNER)
    ;; Must be completed
    (asserts! (get completed lock) ERR-NOT-COMPLETED)
    ;; Not already withdrawn
    (asserts! (not (get withdrawn lock)) ERR-ALREADY-WITHDRAWN)
    ;; Before deadline
    (asserts! (<= stacks-block-height (get deadline lock)) ERR-DEADLINE-PASSED)
    ;; Transfer STX back to owner
    (try! (as-contract (stx-transfer? (get amount lock) tx-sender (get owner lock))))
    ;; Update lock
    (map-set locks
      { id: id }
      (merge lock { withdrawn: true })
    )
    (ok true)
  )
)
