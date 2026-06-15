require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  verifyToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken
} = require('./middleware/auth');

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

// ============================================
// PUBLICZNE ENDPOINTY
// ============================================

// Główny endpoint
app.get('/', (req, res) => {
  res.json({
    message: "Simple Customer API",
    version: "1.0.0",
    endpoints: {
      public: {
        root: "GET /",
        login: "POST /api/auth/login",
        refresh: "POST /api/auth/refresh"
      },
      protected: {
        customer: "GET /api/customer",
        customerInfo: "GET /api/customer/info",
        products: "GET /api/customer/products",
        services: "GET /api/customer/services"
      }
    }
  });
});

// ============================================
// AUTHENTICATION ENDPOINTY
// ============================================

/**
 * Login endpoint - zwraca access i refresh token
 * POST /api/auth/login
 * Body: { username: string, password: string }
 */
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Walidacja danych wejściowych
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Brak loginu lub hasła',
        message: 'Wymagane pola: username, password'
      });
    }

    // Weryfikacja danych (w rzeczywistej aplikacji sprawdzaj bazę danych)
    const demoUsername = process.env.DEMO_USERNAME || 'user';
    const demoPassword = process.env.DEMO_PASSWORD || 'password123';

    if (username !== demoUsername || password !== demoPassword) {
      return res.status(401).json({
        success: false,
        error: 'Nieprawidłowe dane logowania',
        message: 'Login lub hasło są niepoprawne'
      });
    }

    // Generowanie tokenów
    const userId = 'user-001';
    const accessToken = generateAccessToken(userId, username);
    const refreshToken = generateRefreshToken(userId, username);

    return res.json({
      success: true,
      message: 'Logowanie pomyślne',
      data: {
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        tokenType: 'Bearer'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Błąd serwera',
      message: error.message
    });
  }
});

/**
 * Refresh token endpoint - zwraca nowy access token
 * POST /api/auth/refresh
 * Body: { refreshToken: string }
 */
app.post('/api/auth/refresh', verifyRefreshToken, (req, res) => {
  try {
    const { userId, username } = req.user;
    const newAccessToken = generateAccessToken(userId, username);

    return res.json({
      success: true,
      message: 'Token odświeżony pomyślnie',
      data: {
        accessToken: newAccessToken,
        tokenType: 'Bearer',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Błąd serwera',
      message: error.message
    });
  }
});

// ============================================
// CHRONIONE ENDPOINTY (wymagają JWT token)
// ============================================

// Get complete customer data
app.get('/api/customer', verifyToken, (req, res) => {
  res.json({
    success: true,
    data: mockCustomer,
    timestamp: new Date().toISOString(),
    authenticatedAs: req.user.username
  });
});

// Get only customer products
app.get('/api/customer/products', verifyToken, (req, res) => {
  res.json({
    success: true,
    nrKlienta: mockCustomer.nrKlienta,
    produkty: mockCustomer.produkty,
    iloscProduktow: mockCustomer.produkty.length,
    timestamp: new Date().toISOString(),
    authenticatedAs: req.user.username
  });
});

// Get only customer services
app.get('/api/customer/services', verifyToken, (req, res) => {
  res.json({
    success: true,
    nrKlienta: mockCustomer.nrKlienta,
    uslugi: mockCustomer.uslugi,
    iloscUslug: mockCustomer.uslugi.length,
    timestamp: new Date().toISOString(),
    authenticatedAs: req.user.username
  });
});

// Get customer basic info
app.get('/api/customer/info', verifyToken, (req, res) => {
  res.json({
    success: true,
    nrKlienta: mockCustomer.nrKlienta,
    imie: mockCustomer.imie,
    nazwisko: mockCustomer.nazwisko,
    email: mockCustomer.email,
    telefon: mockCustomer.telefon,
    status: mockCustomer.status,
    timestamp: new Date().toISOString(),
    authenticatedAs: req.user.username
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
  console.log(`\n📍 ENDPOINTY PUBLICZNE:`);
  console.log(`   - GET / - główny endpoint`);
  console.log(`   - POST /api/auth/login - logowanie`);
  console.log(`   - POST /api/auth/refresh - odświeżanie tokenu`);
  console.log(`\n🔒 ENDPOINTY CHRONIONE (wymagają JWT):`);
  console.log(`   - GET /api/customer - pełne dane klienta`);
  console.log(`   - GET /api/customer/info - podstawowe info`);
  console.log(`   - GET /api/customer/products - lista produktów`);
  console.log(`   - GET /api/customer/services - lista usług`);
  console.log(`\n📝 DEMO DANE LOGOWANIA:`);
  console.log(`   - Username: ${process.env.DEMO_USERNAME || 'user'}`);
  console.log(`   - Password: ${process.env.DEMO_PASSWORD || 'password123'}`);
});
