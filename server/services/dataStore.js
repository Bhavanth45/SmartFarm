const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'smartfarm_local_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial template seed if file doesn't exist
const getInitialDb = () => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('password123', salt);

  const farmerId = '660f11111111111111111111';
  const buyerId = '660f22222222222222222222';
  const field1Id = '660f33333333333333333331';
  const field2Id = '660f33333333333333333332';

  return {
    users: [
      {
        _id: farmerId,
        name: 'Ramesh Kumar',
        phone: '9876543210',
        email: 'ramesh.farmer@smartfarm.in',
        password: hashedPassword,
        role: 'Farmer',
        farmLocation: 'Nashik, Maharashtra',
        createdAt: new Date().toISOString()
      },
      {
        _id: buyerId,
        name: 'Priya Sharma (Mandi Procurement)',
        phone: '9988776655',
        email: 'priya.buyer@apmcagri.com',
        password: hashedPassword,
        role: 'Buyer',
        farmLocation: 'Vashi APMC Mandi, Navi Mumbai',
        createdAt: new Date().toISOString()
      }
    ],
    fields: [
      {
        _id: field1Id,
        userId: farmerId,
        name: 'Plot 1: Poblano Peppers (Greenhouse A)',
        crop: 'Poblano Pepper',
        area: '4.5 Acres',
        healthScore: 94,
        healthStatus: 'Excellent',
        soilMoisture: 78,
        moistureStatus: 'Healthy & Moist',
        pesticideShield: true,
        lastPesticideSpray: '2 days ago (Neem Bio-Shield)',
        temp: 24.2,
        weatherText: 'Partly Sunny',
        rainChance: '10%',
        wind: '8 km/h',
        marketPrice: '₹65 / kg',
        marketTrend: '+8% this week',
        zones: [
          { id: 'z1', name: 'North Plot', moisture: 78, status: 'Healthy', color: '#22c55e', pestProtected: true },
          { id: 'z2', name: 'Center Plot', moisture: 42, status: 'Needs Water', color: '#eab308', pestProtected: false },
          { id: 'z3', name: 'South Plot', moisture: 74, status: 'Healthy', color: '#22c55e', pestProtected: true }
        ],
        createdAt: new Date().toISOString()
      },
      {
        _id: field2Id,
        userId: farmerId,
        name: 'Plot 2: Sharbati Winter Wheat',
        crop: 'Winter Wheat (Gehun)',
        area: '12.0 Acres',
        healthScore: 88,
        healthStatus: 'Good',
        soilMoisture: 65,
        moistureStatus: 'Healthy & Moist',
        pesticideShield: false,
        lastPesticideSpray: 'Not Applied',
        temp: 22.8,
        weatherText: 'Clear Sky',
        rainChance: '5%',
        wind: '11 km/h',
        marketPrice: '₹28 / kg',
        marketTrend: '+4% this week',
        zones: [
          { id: 'z1', name: 'Canal Zone', moisture: 68, status: 'Healthy', color: '#22c55e', pestProtected: false },
          { id: 'z2', name: 'Middle Terrace', moisture: 62, status: 'Healthy', color: '#22c55e', pestProtected: false },
          { id: 'z3', name: 'Ridge Plot', moisture: 54, status: 'Needs Water', color: '#eab308', pestProtected: false }
        ],
        createdAt: new Date().toISOString()
      }
    ],
    tasks: [
      {
        _id: '660f44444444444444444441',
        userId: farmerId,
        fieldId: field1Id,
        text: 'Irrigate Center Plot with 15-minute drip pulse',
        time: 'Today, 4:00 PM',
        priority: 'High',
        done: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: '660f44444444444444444442',
        userId: farmerId,
        fieldId: field1Id,
        text: 'Inspect sticky yellow traps for whiteflies',
        time: 'Tomorrow Morning',
        priority: 'Normal',
        done: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: '660f44444444444444444443',
        userId: farmerId,
        fieldId: field2Id,
        text: 'Soil nitrogen test before flowering stage',
        time: 'Friday',
        priority: 'Normal',
        done: true,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ],
    telemetrylogs: [
      {
        _id: '660f55555555555555555551',
        fieldId: field1Id,
        moistureBefore: 38,
        moistureAfter: 78,
        action: 'DRIP_IRRIGATION_PULSE',
        temp: 24.2,
        timestamp: new Date().toISOString()
      }
    ],
    orders: [
      {
        orderId: 'ORD-982134',
        buyerId: buyerId,
        crop: 'Poblano Pepper (Capsicum)',
        farmerName: 'Ramesh Kumar',
        farmerPhone: '9876543210',
        location: 'Nashik, Maharashtra',
        quantityKg: 1000,
        ratePerKg: 65,
        totalAmount: 65000,
        status: 'Confirmed (Payment Escrow)',
        orderDate: new Date().toLocaleDateString('en-IN')
      }
    ]
  };
};

// Read Database
const readDb = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDb();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[DataStore] Error reading local DB file:', err.message);
    return getInitialDb();
  }
};

// Write Database
const writeDb = (db) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DataStore] Error writing local DB file:', err.message);
  }
};

// Generate 24-char hex ID compatible with MongoDB ObjectId
const generateObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Math.floor(Math.random() * 0xffffffffffff).toString(16).padStart(12, '0');
  const counter = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
  return (timestamp + random + counter).slice(0, 24);
};

const dataStore = {
  // DB File Path
  dbFilePath: DB_FILE,

  // ================= USERS =================
  findUserById: (id) => {
    const db = readDb();
    const user = db.users.find(u => String(u._id) === String(id));
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  findUserWithPassword: (identifier) => {
    const db = readDb();
    const clean = String(identifier).trim().toLowerCase();
    return db.users.find(u => 
      u.phone === clean || (u.email && u.email.toLowerCase() === clean)
    );
  },

  createUser: async ({ name, phone, email, password, role, farmLocation }) => {
    const db = readDb();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      _id: generateObjectId(),
      name: name.trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim().toLowerCase() : undefined,
      password: hashedPassword,
      role: role || 'Farmer',
      farmLocation: farmLocation || 'India',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDb(db);

    const { password: pw, ...safeUser } = newUser;
    return safeUser;
  },

  // ================= FIELDS =================
  getFields: (userId) => {
    const db = readDb();
    return db.fields.filter(f => String(f.userId) === String(userId));
  },

  getFieldById: (fieldId, userId) => {
    const db = readDb();
    return db.fields.find(f => String(f._id) === String(fieldId) && String(f.userId) === String(userId));
  },

  createField: (userId, fieldData) => {
    const db = readDb();
    const moisture = Number(fieldData.soilMoisture) || 65;
    const isMoist = moisture >= 60;

    const newField = {
      _id: generateObjectId(),
      userId: String(userId),
      name: fieldData.name.trim(),
      crop: fieldData.crop.trim(),
      area: fieldData.area || '5.0 Acres',
      healthScore: isMoist ? 92 : 72,
      healthStatus: isMoist ? 'Excellent' : 'Needs Water',
      soilMoisture: moisture,
      moistureStatus: isMoist ? 'Healthy & Moist' : 'Needs Water',
      pesticideShield: false,
      lastPesticideSpray: 'Not Applied',
      temp: 24.5,
      weatherText: 'Partly Sunny',
      rainChance: '10%',
      wind: '8 km/h',
      marketPrice: fieldData.marketPrice || '₹50 / kg',
      marketTrend: '+5% this week',
      zones: fieldData.zones || [
        { id: 'z1', name: 'North Plot', moisture: moisture, status: isMoist ? 'Healthy' : 'Needs Water', color: isMoist ? '#22c55e' : '#eab308', pestProtected: false },
        { id: 'z2', name: 'Center Plot', moisture: Math.max(30, moisture - 15), status: moisture - 15 >= 60 ? 'Healthy' : 'Needs Water', color: moisture - 15 >= 60 ? '#22c55e' : '#eab308', pestProtected: false },
        { id: 'z3', name: 'South Plot', moisture: Math.min(90, moisture + 10), status: 'Healthy', color: '#22c55e', pestProtected: false }
      ],
      createdAt: new Date().toISOString()
    };

    db.fields.unshift(newField);
    writeDb(db);
    return newField;
  },

  waterField: (fieldId, userId) => {
    const db = readDb();
    const fieldIndex = db.fields.findIndex(f => String(f._id) === String(fieldId) && String(f.userId) === String(userId));
    if (fieldIndex === -1) return null;

    const field = db.fields[fieldIndex];
    const prevMoisture = field.soilMoisture;
    const newMoisture = Math.min(95, prevMoisture + 15);

    field.soilMoisture = newMoisture;
    field.moistureStatus = 'Freshly Watered';
    field.healthScore = Math.min(99, field.healthScore + 6);
    field.healthStatus = 'Excellent';
    field.lastWateredAt = new Date().toISOString();

    if (field.zones && Array.isArray(field.zones)) {
      field.zones.forEach(z => {
        z.moisture = Math.min(95, (z.moisture || 50) + 20);
        z.status = 'Healthy';
        z.color = '#22c55e';
      });
    }

    db.fields[fieldIndex] = field;

    // Log telemetry
    db.telemetrylogs.push({
      _id: generateObjectId(),
      fieldId: field._id,
      moistureBefore: prevMoisture,
      moistureAfter: newMoisture,
      action: 'DRIP_PULSE_IRRIGATION',
      timestamp: new Date().toISOString()
    });

    writeDb(db);
    return field;
  },

  deleteField: (fieldId, userId) => {
    const db = readDb();
    const initialLen = db.fields.length;
    db.fields = db.fields.filter(f => !(String(f._id) === String(fieldId) && String(f.userId) === String(userId)));
    if (db.fields.length !== initialLen) {
      writeDb(db);
      return true;
    }
    return false;
  },

  updateFieldPrice: (fieldId, userId, newPrice) => {
    const db = readDb();
    const fieldIndex = db.fields.findIndex(f => 
      (String(f._id) === String(fieldId) || String(f.id) === String(fieldId)) && 
      (String(f.userId) === String(userId) || !userId)
    );
    if (fieldIndex === -1) return null;

    db.fields[fieldIndex].marketPrice = newPrice;
    writeDb(db);
    return db.fields[fieldIndex];
  },

  // ================= TASKS =================
  getTasks: (userId, fieldId) => {
    const db = readDb();
    return db.tasks.filter(t => {
      const matchUser = String(t.userId) === String(userId);
      if (!matchUser) return false;
      if (fieldId) return String(t.fieldId) === String(fieldId);
      return true;
    });
  },

  createTask: (userId, taskData) => {
    const db = readDb();
    const newTask = {
      _id: generateObjectId(),
      userId: String(userId),
      fieldId: taskData.fieldId || null,
      text: taskData.text.trim(),
      time: taskData.time || 'Today',
      priority: taskData.priority || 'Normal',
      done: false,
      createdAt: new Date().toISOString()
    };

    db.tasks.unshift(newTask);
    writeDb(db);
    return newTask;
  },

  toggleTask: (taskId, userId) => {
    const db = readDb();
    const task = db.tasks.find(t => String(t._id) === String(taskId) && String(t.userId) === String(userId));
    if (!task) return null;

    task.done = !task.done;
    task.completedAt = task.done ? new Date().toISOString() : null;
    writeDb(db);
    return task;
  },

  deleteTask: (taskId, userId) => {
    const db = readDb();
    const initialLen = db.tasks.length;
    db.tasks = db.tasks.filter(t => !(String(t._id) === String(taskId) && String(t.userId) === String(userId)));
    if (db.tasks.length !== initialLen) {
      writeDb(db);
      return true;
    }
    return false;
  },

  // ================= ORDERS =================
  getOrders: (buyerId) => {
    const db = readDb();
    if (!buyerId) return db.orders;
    return db.orders.filter(o => String(o.buyerId) === String(buyerId));
  },

  createOrder: (orderData) => {
    const db = readDb();
    const newOrder = {
      _id: generateObjectId(),
      orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      ...orderData,
      createdAt: new Date().toISOString()
    };
    db.orders.unshift(newOrder);
    writeDb(db);
    return newOrder;
  },

  // ================= STATS & SYNC =================
  getStats: () => {
    const db = readDb();
    return {
      usersCount: db.users.length,
      fieldsCount: db.fields.length,
      tasksCount: db.tasks.length,
      ordersCount: db.orders.length,
      telemetryLogsCount: db.telemetrylogs.length
    };
  },

  getAllData: () => {
    return readDb();
  }
};

module.exports = dataStore;
