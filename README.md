# Simple Customer API

Prosty serwis API zwracający dane fikcyjnego klienta w formacie JSON.

## Instalacja

```bash
npm install
```

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

## Dostępne Endpointy

### 1. **GET /** - Główny endpoint
Zwraca informacje o API i dostępne endpointy.

```
curl http://localhost:3000/
```

**Odpowiedź:**
```json
{
  "message": "Simple Customer API",
  "version": "1.0.0",
  "endpoints": {
    "customer": "/api/customer",
    "products": "/api/customer/products",
    "services": "/api/customer/services"
  }
}
```

---

### 2. **GET /api/customer** - Pełne dane klienta
Zwraca kompletne informacje o kliencie z wszystkimi produktami i usługami.

```
curl http://localhost:3000/api/customer
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
  "timestamp": "2024-06-15T14:30:00.000Z"
}
```

---

### 3. **GET /api/customer/info** - Podstawowe informacje
Zwraca tylko podstawowe dane kontaktowe klienta.

```
curl http://localhost:3000/api/customer/info
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
  "timestamp": "2024-06-15T14:30:00.000Z"
}
```

---

### 4. **GET /api/customer/products** - Lista produktów
Zwraca wszystkie produkty zakupione przez klienta.

```
curl http://localhost:3000/api/customer/products
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
  "timestamp": "2024-06-15T14:30:00.000Z"
}
```

---

### 5. **GET /api/customer/services** - Lista usług
Zwraca wszystkie usługi dostępne dla klienta.

```
curl http://localhost:3000/api/customer/services
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
  "timestamp": "2024-06-15T14:30:00.000Z"
}
```

---

## Dane Klienta

### Struktura klienta:
- **nrKlienta**: Unikalny numer klienta
- **imie**: Imię
- **nazwisko**: Nazwisko
- **email**: Adres email
- **telefon**: Numer telefonu
- **adres**: Dane adresu (ulica, miasto, kod pocztowy, kraj)
- **produkty**: Lista zakupionych produktów
- **uslugi**: Lista dostępnych usług
- **status**: Status konta (aktywny/zawieszony)

### Produkty:
- ID produktu
- Nazwa
- Opis
- Cena
- Data zakupu

### Usługi:
- ID usługi
- Nazwa
- Opis
- Status (aktywna/zawieszena)
- Data rozpoczęcia

## Wymagania

- Node.js 14+
- npm

## Zależności

- **express**: Framework sieciowy
- **cors**: Obsługa Cross-Origin Resource Sharing
- **nodemon** (dev): Auto-reload podczas deweloperstwa

## Licencja

ISC
