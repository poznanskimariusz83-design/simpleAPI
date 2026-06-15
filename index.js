const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock customer data
const mockCustomer = {
  nrKlienta: "KL-2024-001234",
  imie: "Jan",
  nazwisko: "Kowalski",
  email: "jan.kowalski@example.com",
  telefon: "+48 123 456 789",
  adres: {
    ulica: "ul. Pulaskiego 12",
    miasto: "Warszawa",
    kodPocztowy: "00-123",
    kraj: "Polska"
  },
  produkty: [
    {
      id: "PROD-001",
      nazwa: "Pakiet Basic",
      opis: "Podstawowy pakiet usług",
      cena: 99.99,
      waluta: "PLN",
      dataZakupu: "2024-01-15"
    },
    {
      id: "PROD-002",
      nazwa: "Pakiet Premium",
      opis: "Zaawansowany pakiet z dodatkowymi funkcjami",
      cena: 299.99,
      waluta: "PLN",
      dataZakupu: "2024-02-20"
    },
    {
      id: "PROD-003",
      nazwa: "Pakiet Enterprise",
      opis: "Pakiet dla dużych przedsiębiorstw",
      cena: 999.99,
      waluta: "PLN",
      dataZakupu: "2024-03-10"
    }
  ],
  uslugi: [
    {
      id: "USL-001",
      nazwa: "Wsparcie 24/7",
      opis: "Całodobowe wsparcie techniczne",
      status: "aktywna",
      dataRozpoczecia: "2024-01-15"
    },
    {
      id: "USL-002",
      nazwa: "Backup i archiwizacja",
      opis: "Automatyczne kopie zapasowe danych",
      status: "aktywna",
      dataRozpoczecia: "2024-02-01"
    },
    {
      id: "USL-003",
      nazwa: "Raportowanie analityczne",
      opis: "Zaawansowane raporty i analizy",
      status: "zawieszena",
      dataRozpoczecia: "2024-03-01"
    }
  ],
  dataDodania: "2024-01-10",
  typ: "klient_indywidualny",
  status: "aktywny"
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: "Simple Customer API",
    version: "1.0.0",
    endpoints: {
      customer: "/api/customer",
      products: "/api/customer/products",
      services: "/api/customer/services"
    }
  });
});

// Get complete customer data
app.get('/api/customer', (req, res) => {
  res.json({
    success: true,
    data: mockCustomer,
    timestamp: new Date().toISOString()
  });
});

// Get only customer products
app.get('/api/customer/products', (req, res) => {
  res.json({
    success: true,
    nrKlienta: mockCustomer.nrKlienta,
    produkty: mockCustomer.produkty,
    iloscProduktow: mockCustomer.produkty.length,
    timestamp: new Date().toISOString()
  });
});

// Get only customer services
app.get('/api/customer/services', (req, res) => {
  res.json({
    success: true,
    nrKlienta: mockCustomer.nrKlienta,
    uslugi: mockCustomer.uslugi,
    iloscUslug: mockCustomer.uslugi.length,
    timestamp: new Date().toISOString()
  });
});

// Get customer basic info
app.get('/api/customer/info', (req, res) => {
  res.json({
    success: true,
    nrKlienta: mockCustomer.nrKlienta,
    imie: mockCustomer.imie,
    nazwisko: mockCustomer.nazwisko,
    email: mockCustomer.email,
    telefon: mockCustomer.telefon,
    status: mockCustomer.status,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint nie znaleziony",
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server uruchomiony na http://localhost:${PORT}`);
  console.log(`📍 Dostępne endpointy:`);
  console.log(`   - GET / - główny endpoint`);
  console.log(`   - GET /api/customer - pełne dane klienta`);
  console.log(`   - GET /api/customer/info - podstawowe info`);
  console.log(`   - GET /api/customer/products - lista produktów`);
  console.log(`   - GET /api/customer/services - lista usług`);
});
