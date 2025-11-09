/**
 * Jest configuration and setup file for TerraLinke test suite
 */

import '@testing-library/jest-dom';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
process.env.NEXT_PUBLIC_ALGOD_PORT = '443';
process.env.NEXT_PUBLIC_ALGOD_TOKEN = '';

// Mock Algorand SDK
jest.mock('algosdk', () => ({
  Algodv2: jest.fn().mockImplementation(() => ({
    healthCheck: jest.fn().mockResolvedValue({ round: 12345 }),
    getApplicationByID: jest.fn().mockResolvedValue({
      id: 744174033,
      params: {
        creator: 'CREATOR123...',
        'approval-program': 'mock-program',
        'clear-state-program': 'mock-clear'
      }
    }),
    getTransactionParams: jest.fn().mockResolvedValue({
      fee: 1000,
      firstRound: 12345,
      lastRound: 12355,
      genesisHash: 'mock-hash',
      genesisID: 'testnet-v1.0'
    })
  })),
  generateAccount: jest.fn(() => ({
    addr: 'MOCK7WALLET2ADDRESS3FOR4TESTING5PURPOSES6ONLY',
    sk: new Uint8Array(64)
  })),
  secretKeyToMnemonic: jest.fn(() => 'mock mnemonic phrase for testing only'),
  mnemonicToSecretKey: jest.fn(() => ({
    addr: 'MOCK7WALLET2ADDRESS3FOR4TESTING5PURPOSES6ONLY',
    sk: new Uint8Array(64)
  }))
}));

// Mock wallet connections
global.window = global.window || {};
global.window.AlgoSigner = {
  connect: jest.fn().mockResolvedValue(true),
  accounts: jest.fn().mockResolvedValue([
    { address: 'MOCK7WALLET2ADDRESS3FOR4TESTING5PURPOSES6ONLY' }
  ]),
  signTxn: jest.fn().mockResolvedValue(['mock-signed-txn'])
};

// Mock PeraWallet
global.window.PeraWallet = {
  connect: jest.fn().mockResolvedValue(['MOCK7WALLET2ADDRESS3FOR4TESTING5PURPOSES6ONLY']),
  disconnect: jest.fn().mockResolvedValue(true),
  signTransaction: jest.fn().mockResolvedValue(['mock-signed-txn'])
};

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({
      proposals: [
        {
          id: 1,
          title: 'Mock Proposal 1',
          description: 'Test proposal for unit testing',
          funding: 50000,
          votes: 25,
          category: 'renewable_energy',
          creator: 'MOCK7WALLET2ADDRESS3FOR4TESTING5PURPOSES6ONLY',
          created: '2025-11-09T12:00:00Z',
          status: 'active'
        },
        {
          id: 2,
          title: 'Mock Proposal 2',
          description: 'Another test proposal',
          funding: 75000,
          votes: 30,
          category: 'reforestation',
          creator: 'ANOTHER2MOCK3WALLET4ADDRESS5FOR6TESTING',
          created: '2025-11-08T12:00:00Z',
          status: 'active'
        }
      ],
      success: true
    }),
    text: () => Promise.resolve('Mock response text')
  })
);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(global, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock matchMedia
global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}));

// Mock performance
global.performance = global.performance || {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(() => []),
  getEntriesByType: jest.fn(() => [])
};

// Mock console methods to reduce test noise
const originalConsoleError = console.error;
console.error = jest.fn((...args) => {
  // Only log actual errors, not React warnings during tests
  if (args[0] && !args[0].includes('Warning:')) {
    originalConsoleError(...args);
  }
});

// Global test utilities
global.testUtils = {
  // Helper to create mock proposals
  createMockProposal: (overrides = {}) => ({
    id: Math.floor(Math.random() * 1000),
    title: 'Mock Test Proposal',
    description: 'This is a mock proposal for testing purposes',
    funding: 50000,
    votes: 25,
    category: 'renewable_energy',
    creator: 'MOCK7WALLET2ADDRESS3FOR4TESTING5PURPOSES6ONLY',
    created: new Date().toISOString(),
    status: 'active',
    ...overrides
  }),

  // Helper to create mock user
  createMockUser: (overrides = {}) => ({
    address: 'MOCK7WALLET2ADDRESS3FOR4TESTING5PURPOSES6ONLY',
    balance: 100000,
    isConnected: true,
    walletType: 'pera',
    ...overrides
  }),

  // Helper to wait for async operations in tests
  waitFor: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),

  // Helper to trigger mock blockchain transaction
  mockTransaction: (success = true) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve({
            txId: 'MOCKTRANSACTIONID123456789',
            confirmedRound: 12345,
            poolError: '',
            applicationIndex: 744174033
          });
        } else {
          reject(new Error('Mock transaction failed'));
        }
      }, 100);
    });
  }
};

// Setup test database mock
global.mockDatabase = {
  proposals: [
    {
      id: 1,
      title: 'Solar Panel Installation',
      description: 'Install solar panels in rural communities',
      funding: 50000,
      votes: 25,
      category: 'renewable_energy',
      creator: 'MOCK7WALLET2ADDRESS3FOR4TESTING5PURPOSES6ONLY',
      created: '2025-11-09T12:00:00Z',
      status: 'active',
      aiScore: 85
    },
    {
      id: 2,
      title: 'Reforestation Project',
      description: 'Plant 10,000 trees in deforested areas',
      funding: 30000,
      votes: 40,
      category: 'reforestation',
      creator: 'ANOTHER2MOCK3WALLET4ADDRESS5FOR6TESTING',
      created: '2025-11-08T12:00:00Z',
      status: 'active',
      aiScore: 92
    }
  ],
  users: [
    {
      address: 'MOCK7WALLET2ADDRESS3FOR4TESTING5PURPOSES6ONLY',
      balance: 100000,
      reputation: 85,
      votingPower: 100,
      proposalsSubmitted: 3,
      votesCase: 15
    }
  ],
  votes: [
    {
      proposalId: 1,
      voter: 'MOCK7WALLET2ADDRESS3FOR4TESTING5PURPOSES6ONLY',
      voteType: 'approve',
      stakeAmount: 1000,
      timestamp: '2025-11-09T12:30:00Z'
    }
  ]
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

// Global error handling for tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('🧪 Jest test environment configured for TerraLinke');
console.log('📋 Available test utilities: global.testUtils');
console.log('🗄️ Mock database available: global.mockDatabase');
console.log('✅ All mocks and helpers loaded successfully');