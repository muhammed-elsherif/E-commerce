curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "muhaaat@gmail.com", "password": "123123"}'

curl -X POST http://localhost:4000/api/payments/card \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODA4MzViMzY4MzgxNDRiY2U5ZGExYjgiLCJpYXQiOjE3NDUzNzAyNTUsImV4cCI6MTc0NTM3MTE1NX0.lxI4a_xsszm_TOjOicKG_JrXzOH7Sa88cfl4qGAOtlo" \
  -d '{"cardNumber": "4111111111111111", "expiryDate": "12/25", "cvv": "123", "cardholderName": "Test User"}'

curl -X GET http://localhost:4000/api/payments/cards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODA4MzViMzY4MzgxNDRiY2U5ZGExYjgiLCJpYXQiOjE3NDUzNzAyNTUsImV4cCI6MTc0NTM3MTE1NX0.lxI4a_xsszm_TOjOicKG_JrXzOH7Sa88cfl4qGAOtlo" \
  -d '{"cardNumber": "4111111111111111", "expiryDate": "12/25", "cvv": "123", "cardholderName": "Test User"}'

for i in {1..150}; do
  curl -X GET http://localhost:4000/api/payments/cards
done

curl -X POST http://localhost:4000/api/payments/card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111111111111111", "expiryDate": "12/25", "cvv": "123", "cardholderName": "SELECT * FROM users"}'