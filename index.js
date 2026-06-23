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

// Mock customer data - rozszerzona baza klientów
const mockCustomers = {
  "KL-001": {
    nrKlienta: "KL-001",
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
      }
    ],
    dataDodania: "2024-01-10",
    typ: "klient_indywidualny",
    status: "aktywny"
  },
  "KL-002": {
    nrKlienta: "KL-002",
    imie: "Maria",
    nazwisko: "Nowak",
    email: "maria.nowak@example.com",
    telefon: "+48 987 654 321",
    adres: {
      ulica: "ul. Marszałkowska 50",
      miasto: "Kraków",
      kodPocztowy: "31-223",
      kraj: "Polska"
    },
    produkty: [
      {
        id: "PROD-003",
        nazwa: "Pakiet Enterprise",
        opis: "Pakiet dla dużych przedsiębiorstw",
        cena: 999.99,
        waluta: "PLN",
        dataZakupu: "2024-03-10"
      },
      {
        id: "PROD-004",
        nazwa: "Rozszerzenie API",
        opis: "Dostęp do zaawansowanych API",
        cena: 199.99,
        waluta: "PLN",
        dataZakupu: "2024-04-05"
      }
    ],
    uslugi: [
      {
        id: "USL-003",
        nazwa: "Raportowanie analityczne",
        opis: "Zaawansowane raporty i analizy",
        status: "aktywna",
        dataRozpoczecia: "2024-03-01"
      },
      {
        id: "USL-004",
        nazwa: "Konsultacje biznesowe",
        opis: "Dostęp do zespołu ekspertów",
        status: "aktywna",
        dataRozpoczecia: "2024-03-15"
      },
      {
        id: "USL-005",
        nazwa: "Integracja systemów",
        opis: "Asystencja przy integracji z istniejącymi systemami",
        status: "zaplanowana",
        dataRozpoczecia: "2024-07-01"
      }
    ],
    dataDodania: "2024-02-15",
    typ: "klient_biznesowy",
    status: "aktywny"
  },
  "KL-003": {
    nrKlienta: "KL-003",
    imie: "Piotr",
    nazwisko: "Lewandowski",
    email: "piotr.lew@example.com",
    telefon: "+48 555 666 777",
    adres: {
      ulica: "ul. Główna 15",
      miasto: "Gdańsk",
      kodPocztowy: "80-001",
      kraj: "Polska"
    },
    produkty: [
      {
        id: "PROD-001",
        nazwa: "Pakiet Basic",
        opis: "Podstawowy pakiet usług",
        cena: 99.99,
        waluta: "PLN",
        dataZakupu: "2024-04-01"
      }
    ],
    uslugi: [
      {
        id: "USL-006",
        nazwa: "Wsparcie email",
        opis: "Wsparcie techniczne via email",
        status: "aktywna",
        dataRozpoczecia: "2024-04-01"
      }
    ],
    dataDodania: "2024-04-01",
    typ: "klient_indywidualny",
    status: "nowy"
  },
  "KL-004": {
    nrKlienta: "KL-004",
    imie: "Anna",
    nazwisko: "Wiśniewska",
    email: "anna.w@example.com",
    telefon: "+48 111 222 333",
    adres: {
      ulica: "ul. Zawalna 8",
      miasto: "Wrocław",
      kodPocztowy: "50-082",
      kraj: "Polska"
    },
    produkty: [
      {
        id: "PROD-005",
        nazwa: "Pakiet Startup",
        opis: "Pakiet dla startupów",
        cena: 149.99,
        waluta: "PLN",
        dataZakupu: "2024-05-10"
      },
      {
        id: "PROD-002",
        nazwa: "Pakiet Premium",
        opis: "Zaawansowany pakiet z dodatkowymi funkcjami",
        cena: 299.99,
        waluta: "PLN",
        dataZakupu: "2024-06-01"
      }
    ],
    uslugi: [
      {
        id: "USL-007",
        nazwa: "Szkolenia zespołu",
        opis: "Szkolenia dla zespołu w zakresie użytkowania platformy",
        status: "aktywna",
        dataRozpoczecia: "2024-05-15"
      },
      {
        id: "USL-008",
        nazwa: "Dedykowany account manager",
        opis: "Przydzielony menedżer konta",
        status: "aktywna",
        dataRozpoczecia: "2024-05-20"
      }
    ],
    dataDodania: "2024-05-08",
    typ: "klient_biznesowy",
    status: "aktywny"
  },
  "KL-005": {
    nrKlienta: "KL-005",
    imie: "Robert",
    nazwisko: "Majewski",
    email: "r.majewski@example.com",
    telefon: "+48 333 444 555",
    adres: {
      ulica: "ul. Floriańska 22",
      miasto: "Poznań",
      kodPocztowy: "61-001",
      kraj: "Polska"
    },
    produkty: [
      {
        id: "PROD-003",
        nazwa: "Pakiet Enterprise",
        opis: "Pakiet dla dużych przedsiębiorstw",
        cena: 999.99,
        waluta: "PLN",
        dataZakupu: "2024-05-25"
      }
    ],
    uslugi: [
      {
        id: "USL-003",
        nazwa: "Raportowanie analityczne",
        opis: "Zaawansowane raporty i analizy",
        status: "aktywna",
        dataRozpoczecia: "2024-06-01"
      },
      {
        id: "USL-009",
        nazwa: "Monitoring 24/7",
        opis: "Ciągłe monitorowanie systemu",
        status: "aktywna",
        dataRozpoczecia: "2024-05-25"
      },
      {
        id: "USL-010",
        nazwa: "Disaster Recovery",
        opis: "Plan odzyskiwania po awariach",
        status: "aktywna",
        dataRozpoczecia: "2024-06-01"
      }
    ],
    dataDodania: "2024-05-20",
    typ: "klient_biznesowy",
    status: "premium"
  }
};

// Domyślny klient (fallback)
const mockCustomer = mockCustomers["KL-001"];

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
        customers: "GET /api/customers",
        customer: "GET /api/customer?id=KL-001",
        customerInfo: "GET /api/customer/info?id=KL-001",
        products: "GET /api/customer/products?id=KL-001",
        services: "GET /api/customer/services?id=KL-001"
      },
      dostepneKlienci: Object.keys(mockCustomers).join(", ")
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

/**
 * Get all customers list
 * GET /api/customers
 */
app.get('/api/customers', verifyToken, (req, res) => {
  try {
    const customersList = Object.values(mockCustomers).map(customer => ({
      nrKlienta: customer.nrKlienta,
      imie: customer.imie,
      nazwisko: customer.nazwisko,
      email: customer.email,
      status: customer.status,
      typ: customer.typ,
      dataDodania: customer.dataDodania
    }));

    res.json({
      success: true,
      iloscKlientow: customersList.length,
      klienci: customersList,
      timestamp: new Date().toISOString(),
      authenticatedAs: req.user.username
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
 * Get complete customer data by ID
 * GET /api/customer?id=KL-001
 * lub bez id zwraca domyślnego klienta
 */
app.get('/api/customer', verifyToken, (req, res) => {
  try {
    const customerId = req.query.id || 'KL-001';
    
    // Sprawdzenie czy klient istnieje
    if (!mockCustomers[customerId]) {
      return res.status(404).json({
        success: false,
        error: 'Klient nie znaleziony',
        message: `Klient z ID: ${customerId} nie istnieje w bazie danych`,
        dostepneKlienci: Object.keys(mockCustomers),
        przyklad: '/api/customer?id=KL-001'
      });
    }

    const customer = mockCustomers[customerId];

    res.json({
      success: true,
      data: customer,
      timestamp: new Date().toISOString(),
      authenticatedAs: req.user.username
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
 * Get only customer products by ID
 * GET /api/customer/products?id=KL-001
 */
app.get('/api/customer/products', verifyToken, (req, res) => {
  try {
    const customerId = req.query.id || 'KL-001';
    
    // Sprawdzenie czy klient istnieje
    if (!mockCustomers[customerId]) {
      return res.status(404).json({
        success: false,
        error: 'Klient nie znaleziony',
        message: `Klient z ID: ${customerId} nie istnieje w bazie danych`,
        dostepneKlienci: Object.keys(mockCustomers),
        przyklad: '/api/customer/products?id=KL-001'
      });
    }

    const customer = mockCustomers[customerId];

    res.json({
      success: true,
      nrKlienta: customer.nrKlienta,
      imie: customer.imie,
      nazwisko: customer.nazwisko,
      produkty: customer.produkty,
      iloscProduktow: customer.produkty.length,
      timestamp: new Date().toISOString(),
      authenticatedAs: req.user.username
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
 * Get only customer services by ID
 * GET /api/customer/services?id=KL-001
 */
app.get('/api/customer/services', verifyToken, (req, res) => {
  try {
    const customerId = req.query.id || 'KL-001';
    
    // Sprawdzenie czy klient istnieje
    if (!mockCustomers[customerId]) {
      return res.status(404).json({
        success: false,
        error: 'Klient nie znaleziony',
        message: `Klient z ID: ${customerId} nie istnieje w bazie danych`,
        dostepneKlienci: Object.keys(mockCustomers),
        przyklad: '/api/customer/services?id=KL-001'
      });
    }

    const customer = mockCustomers[customerId];

    res.json({
      success: true,
      nrKlienta: customer.nrKlienta,
      imie: customer.imie,
      nazwisko: customer.nazwisko,
      uslugi: customer.uslugi,
      iloscUslug: customer.uslugi.length,
      timestamp: new Date().toISOString(),
      authenticatedAs: req.user.username
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
 * Get customer basic info by ID
 * GET /api/customer/info?id=KL-001
 */
app.get('/api/customer/info', verifyToken, (req, res) => {
  try {
    const customerId = req.query.id || 'KL-001';
    
    // Sprawdzenie czy klient istnieje
    if (!mockCustomers[customerId]) {
      return res.status(404).json({
        success: false,
        error: 'Klient nie znaleziony',
        message: `Klient z ID: ${customerId} nie istnieje w bazie danych`,
        dostepneKlienci: Object.keys(mockCustomers),
        przyklad: '/api/customer/info?id=KL-001'
      });
    }

    const customer = mockCustomers[customerId];

    res.json({
      success: true,
      nrKlienta: customer.nrKlienta,
      imie: customer.imie,
      nazwisko: customer.nazwisko,
      email: customer.email,
      telefon: customer.telefon,
      adres: customer.adres,
      status: customer.status,
      typ: customer.typ,
      dataDodania: customer.dataDodania,
      timestamp: new Date().toISOString(),
      authenticatedAs: req.user.username
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Błąd serwera',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint nie znaleziony",
    path: req.path,
    message: "Sprawdź dostępne endpointy na GET /"
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
  console.log(`   - GET /api/customers - lista wszystkich klientów`);
  console.log(`   - GET /api/customer?id=KL-001 - pełne dane klienta`);
  console.log(`   - GET /api/customer/info?id=KL-001 - podstawowe info`);
  console.log(`   - GET /api/customer/products?id=KL-001 - lista produktów`);
  console.log(`   - GET /api/customer/services?id=KL-001 - lista usług`);
  console.log(`\n👥 DOSTĘPNI KLIENCI:`);
  Object.keys(mockCustomers).forEach(id => {
    const customer = mockCustomers[id];
    console.log(`   - ${id}: ${customer.imie} ${customer.nazwisko} (${customer.typ})`);
  });
  console.log(`\n📝 DEMO DANE LOGOWANIA:`);
  console.log(`   - Username: ${process.env.DEMO_USERNAME || 'user'}`);
  console.log(`   - Password: ${process.env.DEMO_PASSWORD || 'password123'}`);
  console.log(`\n💡 PRZYKŁADOWE ZAPYTANIA:`);
  console.log(`   1. curl -X POST http://localhost:${PORT}/api/auth/login \\`);
  console.log(`      -H "Content-Type: application/json" \\`);
  console.log(`      -d '{"username":"user","password":"password123"}'`);
  console.log(`   2. curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:${PORT}/api/customers`);
  console.log(`   3. curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:${PORT}/api/customer?id=KL-002`);
});
