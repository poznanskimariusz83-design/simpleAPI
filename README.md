# Simple Customer API

Prosty serwis API zwracający dane fikcyjnego klienta w formacie JSON z wbudowaną autentykacją JWT.

## Instalacja

```bash
npm install
```

## Konfiguracja

Skopiuj plik `.env.example` do `.env` i dostosuj wartości:

```bash
cp .env.example .env
```

Zmienialne parametry w `.env`:
- `JWT_SECRET` - Tajny klucz JWT (zmień w produkcji!)
- `JWT_REFRESH_SECRET` - Tajny klucz dla refresh tokenów
- `DEMO_USERNAME` - Login do dema (domyślnie: `user`)
- `DEMO_PASSWORD` - Hasło do dema (domyślnie: `password123`)

## Uruchomienie

### Tryb produkcji
```bash
npm start
```

### Tryb deweloperski (z auto-reload)
```bash
npm run dev
```

API będzie dostępne na `http://localhost:3000`

---

## 🔐 Autentykacja JWT

### 1. Logowanie - GET Access Token

**POST /api/auth/login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "password": "password123"
  }'
```

**Odpowiedź:**
```json
{
  "success": true,
  "message": "Logowanie pomyślne",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "1h",
    "tokenType": "Bearer"
  }
}
```

### 2. Odświeżanie Token

**POST /api/auth/refresh**

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

**Odpowiedź:**
```json
{
  "success": true,
  "message": "Token odświeżony pomyślnie",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "1h"
  }
}
```

---

## 📚 Dostępne Endpointy

### Endpointy Publiczne (bez autentykacji)

#### **GET /** - Główny endpoint
Zwraca informacje o API i dostępne endpointy.

```bash
curl http://localhost:3000/
```

**Odpowiedź:**
```json
{
  "message": "Simple Customer API",
  "version": "1.0.0",
  "endpoints": {
    "public": {
      "root": "GET /",
      "login": "POST /api/auth/login",
      "refresh": "POST /api/auth/refresh"
    },
    "protected": {
      "customer": "GET /api/customer",
      "customerInfo": "GET /api/customer/info",
      "products": "GET /api/customer/products",
      "services": "GET /api/customer/services"
    }
  }
}
```

---

### Endpointy Chronione (wymagają JWT w nagłówku)

> **Wymagany nagłówek:**
> ```
> Authorization: Bearer <ACCESS_TOKEN>
> ```

#### **GET /api/customer** - Pełne dane klienta
Zwraca kompletne informacje o kliencie z wszystkimi produktami i usługami.

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3000/api/customer
```

**Odpowiedź:**
```json
{
  "success": true,
  "data": {
    "nrKlienta": "KL-2024-001234",
    "imie": "Jan",
    "nazwisko": "Kowalski",
    "email": "jan.kowalski@example.com",
    "telefon": "+48 123 456 789",
    "adres": {
      "ulica": "ul. Pulaskiego 12",
      "miasto": "Warszawa",
      "kodPocztowy": "00-123",
      "kraj": "Polska"
    },
    "produkty": [...],
    "uslugi": [...],
    "status": "aktywny"
  },
  "timestamp": "2024-06-15T14:30:00.000Z",
  "authenticatedAs": "user"
}
```

---

#### **GET /api/customer/info** - Podstawowe informacje
Zwraca tylko podstawowe dane kontaktowe klienta.

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3000/api/customer/info
```

**Odpowiedź:**
```json
{
  "success": true,
  "nrKlienta": "KL-2024-001234",
  "imie": "Jan",
  "nazwisko": "Kowalski",
  "email": "jan.kowalski@example.com",
  "telefon": "+48 123 456 789",
  "status": "aktywny",
  "timestamp": "2024-06-15T14:30:00.000Z",
  "authenticatedAs": "user"
}
```

---

#### **GET /api/customer/products** - Lista produktów
Zwraca wszystkie produkty zakupione przez klienta.

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3000/api/customer/products
```

**Odpowiedź:**
```json
{
  "success": true,
  "nrKlienta": "KL-2024-001234",
  "produkty": [
    {
      "id": "PROD-001",
      "nazwa": "Pakiet Basic",
      "opis": "Podstawowy pakiet usług",
      "cena": 99.99,
      "waluta": "PLN",
      "dataZakupu": "2024-01-15"
    },
    ...
  ],
  "iloscProduktow": 3,
  "timestamp": "2024-06-15T14:30:00.000Z",
  "authenticatedAs": "user"
}
```

---

#### **GET /api/customer/services** - Lista usług
Zwraca wszystkie usługi dostępne dla klienta.

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3000/api/customer/services
```

**Odpowiedź:**
```json
{
  "success": true,
  "nrKlienta": "KL-2024-001234",
  "uslugi": [
    {
      "id": "USL-001",
      "nazwa": "Wsparcie 24/7",
      "opis": "Całodobowe wsparcie techniczne",
      "status": "aktywna",
      "dataRozpoczecia": "2024-01-15"
    },
    ...
  ],
  "iloscUslug": 3,
  "timestamp": "2024-06-15T14:30:00.000Z",
  "authenticatedAs": "user"
}
```

---

## 🧪 Przykład pełnego flow'u

### Krok 1: Logowanie
```bash
ACCESS_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"password123"}' \
  | jq -r '.data.accessToken')

echo "Access Token: $ACCESS_TOKEN"
```

### Krok 2: Użycie tokenu do dostępu do chronionych danych
```bash
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:3000/api/customer
```

### Krok 3: Odświeżenie tokenu
```bash
REFRESH_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"password123"}' \
  | jq -r '.data.refreshToken')

curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

---

## 📋 Struktura projektu

```
simpleAPI/
├── index.js              # Główny plik aplikacji
├── middleware/
│   └── auth.js          # Middleware JWT
├── package.json         # Zależności
├── .env                 # Zmienne środowiska (lokalnie)
├── .env.example         # Szablon zmiennych środowiska
└── README.md            # Ten plik
```

---

## 🔑 Zmienne Środowiska

| Zmienna | Default | Opis |
|---------|---------|------|
| `PORT` | 3000 | Port serwera |
| `NODE_ENV` | development | Środowisko (development/production) |
| `JWT_SECRET` | dev_secret_key_12345 | Tajny klucz JWT ⚠️ Zmień w produkcji! |
| `JWT_REFRESH_SECRET` | dev_refresh_secret_67890 | Tajny klucz refresh tokenu ⚠️ Zmień w produkcji! |
| `JWT_EXPIRES_IN` | 1h | Czas ważności access tokenu |
| `JWT_REFRESH_EXPIRES_IN` | 7d | Czas ważności refresh tokenu |
| `DEMO_USERNAME` | user | Login do demonstracji |
| `DEMO_PASSWORD` | password123 | Hasło do demonstracji |

---

## 🚀 Wdrożenie w Produkcji

1. **Zmień tajne klucze:**
   ```bash
   JWT_SECRET=your_strong_random_key_here
   JWT_REFRESH_SECRET=another_strong_random_key_here
   ```

2. **Skonfiguruj bazę danych:**
   - Zastąp walidację `DEMO_USERNAME/PASSWORD` rzeczywistą bazą danych
   - Przechowuj hasła w postaci zahaszowanej (np. bcrypt)

3. **Dodaj HTTPS:**
   - Zawsze używaj HTTPS w produkcji
   - Ustaw secure flag na cookies

4. **Monitorowanie:**
   - Loguj próby nieudanego logowania
   - Monitoruj zastosowanie tokenów

---

## 📦 Wymagania

- Node.js 14+
- npm

## 🔧 Zależności

- **express**: Framework sieciowy
- **cors**: Obsługa Cross-Origin Resource Sharing
- **jsonwebtoken**: Obsługa JWT tokenów
- **dotenv**: Zarządzanie zmiennymi środowiska
- **nodemon** (dev): Auto-reload podczas deweloperstwa

## ⚖️ Licencja

ISC
