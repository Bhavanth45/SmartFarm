import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Sun,
  Droplets,
  Wind,
  CloudRain,
  CheckCircle,
  Circle,
  TrendingUp,
  Plus,
  X,
  Trash2,
  Sparkles,
  User,
  LogIn,
  LogOut,
  Lock,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Calendar,
  AlertTriangle,
  Check,
  ArrowRight,
  Package,
  Database
} from 'lucide-react';
import initialData from './fieldsData.json';
import { api } from './services/api';
import './App.css';

// Predefined All-Season Agronomic Crop Matrix
const SEASON_RECOMMENDATIONS = [
  {
    id: 'kharif',
    season: 'Kharif (Monsoon Season)',
    period: 'June to October',
    weather: 'Warm & Humid with heavy monsoon rainfall (26°C - 34°C)',
    waterRequirement: 'High (Rainfed & Supplemental)',
    idealSoil: 'Alluvial, Deep Clayey Loam, Black Cotton Soil',
    bestCrops: [
      { name: 'Paddy / Basmati Rice', profit: '₹2,400 - ₹4,200 / quintal', risk: 'Low', tip: 'Transplant 25-day seedlings before heavy July rains.' },
      { name: 'Cotton (Kapas)', profit: '₹6,500 - ₹7,800 / quintal', risk: 'Medium', tip: 'Maintain ridge-and-furrow planting to avoid root rot.' },
      { name: 'Soybean', profit: '₹4,600 - ₹5,200 / quintal', risk: 'Low', tip: 'Inoculate with Rhizobium culture before sowing.' },
      { name: 'Maize (Corn)', profit: '₹2,100 - ₹2,600 / quintal', risk: 'Low', tip: 'Ensure proper field drainage during early vegetative stage.' }
    ]
  },
  {
    id: 'rabi',
    season: 'Rabi (Winter Season)',
    period: 'October to March',
    weather: 'Cool, crisp weather with low humidity (12°C - 24°C)',
    waterRequirement: 'Moderate (Sensor-guided Drip/Canal)',
    idealSoil: 'Well-drained Sandy Loam, Silt Loam',
    bestCrops: [
      { name: 'Winter Wheat (Gehun)', profit: '₹2,275 - ₹2,900 / quintal', risk: 'Low', tip: 'Sow between Nov 1 - 20 for optimal tillering and crown roots.' },
      { name: 'Mustard (Sarson)', profit: '₹5,400 - ₹6,100 / quintal', risk: 'Low', tip: 'Watch for aphid attacks during mid-December flowering.' },
      { name: 'Chickpea / Bengal Gram (Chana)', profit: '₹5,200 - ₹5,900 / quintal', risk: 'Medium', tip: 'Avoid waterlogging; requires 2 to 3 light irrigations only.' },
      { name: 'Green Peas (Matar)', profit: '₹3,500 - ₹5,000 / quintal', risk: 'Medium', tip: 'High early-market spot rates in November.' }
    ]
  },
  {
    id: 'zaid',
    season: 'Zaid (Summer Season)',
    period: 'March to June',
    weather: 'Hot & Dry weather with long sunshine hours (30°C - 42°C)',
    waterRequirement: 'Frequent & Controlled (Drip Irrigation mandatory)',
    idealSoil: 'Sandy Riverbed Loam, Well-aerated soils',
    bestCrops: [
      { name: 'Watermelon (Tarbooj)', profit: '₹1,400 - ₹2,200 / quintal', risk: 'Low', tip: 'Use plastic silver mulch film to preserve soil moisture.' },
      { name: 'Cucumber (Kheera)', profit: '₹2,000 - ₹3,200 / quintal', risk: 'Low', tip: 'Fast 45-day turnaround with steady daily picking.' },
      { name: 'Moong Dal (Green Gram)', profit: '₹7,500 - ₹8,600 / quintal', risk: 'Low', tip: 'Enriches soil nitrogen reserves for the next Kharif crop.' },
      { name: 'Muskmelon (Kharbooja)', profit: '₹2,200 - ₹3,400 / quintal', risk: 'Medium', tip: 'Withhold watering 5 days before harvest for higher Brix sweetness.' }
    ]
  },
  {
    id: 'perennial',
    season: 'Perennial & High-Value Cash Crops',
    period: 'Year-Round / Polyhouse',
    weather: 'Controlled micro-climate or temperate hill slopes',
    waterRequirement: 'Precision Automated Drip',
    idealSoil: 'Rich Organic Loam, pH 6.0 - 7.5',
    bestCrops: [
      { name: 'Poblano Pepper / Capsicum', profit: '₹5,500 - ₹7,200 / quintal', risk: 'Medium', tip: 'Maintain trellis support; spray potassium bicarbonate against mildew.' },
      { name: 'Fuji Apples (Seb)', profit: '₹14,000 - ₹19,000 / quintal', risk: 'Medium', tip: 'Prune branches in winter; apply calcium spray during fruit sizing.' },
      { name: 'Sugarcane (Ganna)', profit: '₹315 - ₹350 / quintal (FRP)', risk: 'Low', tip: 'Adopt trash mulching to reduce soil water evaporation by 40%.' }
    ]
  }
];

// Predefined Pesticides & Bio-Inputs Catalog
const PESTICIDE_CATALOG = [
  { id: 'pest-1', name: 'Neem-Bio Organic Shield (10,000 ppm)', category: 'Bio-Insecticide', target: 'Aphids, Whiteflies, Thrips & Caterpillars', price: 380, volume: '1 Litre', boost: 8, badge: '100% Organic' },
  { id: 'pest-2', name: 'Potassium Bicarbonate Antifungal Spray', category: 'Bio-Fungicide', target: 'Downy Mildew, Powdery Mildew, Leaf Spots', price: 450, volume: '500 Grams', boost: 10, badge: 'Instant Protection' },
  { id: 'pest-3', name: 'Copper Hydroxide Blight Barrier', category: 'Broad Spectrum', target: 'Bacterial Blight, Fruit Anthracnose', price: 520, volume: '1 Kg', boost: 9, badge: 'Heavy Duty' },
  { id: 'pest-4', name: 'Trichoderma Viride Bio-Fungicide', category: 'Root Inoculant', target: 'Root Rot, Collar Rot, Wilt & Damp-off', price: 290, volume: '1 Kg', boost: 7, badge: 'Root Defense' },
  { id: 'pest-5', name: 'NPK 19:19:19 Foliar Tonic + Zinc', category: 'Micro-Nutrient', target: 'Chlorosis, Leaf Yellowing & Growth Stunt', price: 340, volume: '1 Kg', boost: 6, badge: 'Growth Booster' }
];

// Initial Harvest Marketplace for Buyers
const INITIAL_MARKETPLACE_LISTINGS = [
  { id: 'list-1', farmerName: 'Ramesh Kumar', farmerPhone: '9876543210', location: 'Nashik, Maharashtra', crop: 'Poblano Pepper (Capsicum)', quantity: '4,500 kg', pricePerKg: 65, grade: 'Grade A+ (Export Quality)', harvestReady: 'Ready in 3 Days', fieldId: 'field-1' },
  { id: 'list-2', farmerName: 'Ramesh Kumar', farmerPhone: '9876543210', location: 'Nashik, Maharashtra', crop: 'Winter Wheat (Sharbati Gehun)', quantity: '12,000 kg', pricePerKg: 28, grade: 'Grade A (Golden Grains)', harvestReady: 'Ready in 10 Days', fieldId: 'field-2' },
  { id: 'list-3', farmerName: 'Gurpreet Singh', farmerPhone: '9812345678', location: 'Ludhiana, Punjab', crop: 'Basmati Rice (1121 Extra Long)', quantity: '18,500 kg', pricePerKg: 92, grade: 'Export Grade', harvestReady: 'Immediate Dispatch', fieldId: 'field-ext-1' },
  { id: 'list-4', farmerName: 'Devendra Patil', farmerPhone: '9765432190', location: 'Jalgaon, Maharashtra', crop: 'G9 Grand Naine Bananas', quantity: '8,000 kg', pricePerKg: 22, grade: 'Premium Table Grade', harvestReady: 'Ready in 2 Days', fieldId: 'field-ext-2' }
];

export default function App() {
  // Current Logged-in User Session (Persisted)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smartfarm_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [dbStatus, setDbStatus] = useState('checking'); // 'connected' | 'offline'
  const [dbInfo, setDbInfo] = useState({
    status: 'checking',
    mode: 'LOCAL_PERSISTENT_STORE',
    label: 'Connecting...',
    atlasConnected: false,
    counts: null,
    wifiNotice: null
  });
  const [showDbModal, setShowDbModal] = useState(false);

  // Active View Tab for Farmer: 'fields' | 'seasons' | 'pesticides'
  const [farmerActiveTab, setFarmerActiveTab] = useState('fields');

  // Active View Tab for Buyer: 'marketplace' | 'orders'
  const [buyerActiveTab, setBuyerActiveTab] = useState('marketplace');

  // Auth Modal State
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authRole, setAuthRole] = useState('farmer'); // 'farmer' or 'buyer'
  const [authName, setAuthName] = useState('');
  const [authIdentifier, setAuthIdentifier] = useState(''); // phone or email
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // User-specific Fields Data (Loaded per user ID)
  const [userFields, setUserFields] = useState(() => {
    if (!currentUser) return [];
    const storageKey = `smartfarm_fields_${currentUser.id || currentUser.phone || currentUser.email}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    return initialData.fields.map(f => ({
      ...f,
      pesticideShield: true,
      lastPesticideSpray: '2 days ago',
      zones: [
        { id: 'z1', name: 'North Plot', moisture: 78, status: 'Healthy', color: '#22c55e', pestProtected: true },
        { id: 'z2', name: 'Center Plot', moisture: 42, status: 'Needs Water', color: '#eab308', pestProtected: false },
        { id: 'z3', name: 'South Plot', moisture: 74, status: 'Healthy', color: '#22c55e', pestProtected: true }
      ]
    }));
  });

  const [selectedFieldId, setSelectedFieldId] = useState(userFields[0]?.id || 'field-1');
  const activeField = userFields.find(f => f.id === selectedFieldId || f._id === selectedFieldId) || userFields[0];

  // Buyer Orders State
  const [buyerOrders, setBuyerOrders] = useState(() => {
    const saved = localStorage.getItem('smartfarm_buyer_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Add Field Modal State
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newCropName, setNewCropName] = useState('Poblano Pepper');
  const [newArea, setNewArea] = useState('5.0 Acres');
  const [newMoisture, setNewMoisture] = useState(65);
  const [newTargetPrice, setNewTargetPrice] = useState('60');
  const [newInitialTask, setNewInitialTask] = useState('Setup drip irrigation & calibrate soil sensors');
  const [newInitialPriority, setNewInitialPriority] = useState('High');

  // Custom Task Input State inside Field
  const [customTaskText, setCustomTaskText] = useState('');
  const [customTaskPriority, setCustomTaskPriority] = useState('Normal');
  const [customTaskDue, setCustomTaskDue] = useState('Today');

  // Buyer Purchase Modal State
  const [buyingListing, setBuyingListing] = useState(null);
  const [purchaseQty, setPurchaseQty] = useState(500);

  // Dynamic Marketplace Listings State (Reflected between Farmer & Mandi)
  const [marketplaceListings, setMarketplaceListings] = useState(() => {
    const saved = localStorage.getItem('smartfarm_mandi_listings');
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE_LISTINGS;
  });

  // Dynamic Mandi Price Input State for Farmer
  const [customMandiPrice, setCustomMandiPrice] = useState(65);

  // Status Toast Feedback
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Sync userFields to localStorage per-user
  useEffect(() => {
    if (currentUser && currentUser.role === 'farmer') {
      const storageKey = `smartfarm_fields_${currentUser.id || currentUser.phone || currentUser.email}`;
      localStorage.setItem(storageKey, JSON.stringify(userFields));
    }
  }, [userFields, currentUser]);

  // Sync buyerOrders to localStorage
  useEffect(() => {
    localStorage.setItem('smartfarm_buyer_orders', JSON.stringify(buyerOrders));
  }, [buyerOrders]);

  // Sync marketplaceListings to localStorage
  useEffect(() => {
    localStorage.setItem('smartfarm_mandi_listings', JSON.stringify(marketplaceListings));
  }, [marketplaceListings]);

  // Keep customMandiPrice synced with activeField
  useEffect(() => {
    if (activeField && activeField.marketPrice) {
      const num = parseInt(String(activeField.marketPrice).replace(/[^0-9]/g, ''), 10) || 65;
      setCustomMandiPrice(num);
    }
  }, [selectedFieldId, userFields]);

  // Check MongoDB Backend Connectivity & load data
  useEffect(() => {
    const checkAndSyncBackend = async () => {
      try {
        const healthData = await api.getHealth();
        if (healthData && (healthData.status === 'HEALTHY' || healthData.success !== false)) {
          const dbMeta = healthData.database || {};
          const isAtlas = !!dbMeta.atlasConnected;
          setDbStatus('connected');
          setDbInfo({
            status: 'connected',
            mode: dbMeta.mode || (isAtlas ? 'MONGODB_ATLAS' : 'LOCAL_PERSISTENT_STORE'),
            label: isAtlas ? 'MongoDB Atlas Live' : (dbMeta.statusLabel || 'MongoDB Connected'),
            atlasConnected: isAtlas,
            counts: dbMeta.counts,
            wifiNotice: dbMeta.wifiNotice
          });

          // If logged in, fetch fields from MongoDB
          if (currentUser && currentUser.role === 'farmer') {
            const fieldsRes = await api.getFields();
            if (fieldsRes && fieldsRes.success && fieldsRes.data && fieldsRes.data.length > 0) {
              setUserFields(fieldsRes.data);
              setSelectedFieldId(fieldsRes.data[0]._id || fieldsRes.data[0].id);
            }
          }

          // If logged in as buyer, fetch orders from backend
          if (currentUser && currentUser.role === 'buyer') {
            const ordersRes = await api.getOrders();
            if (ordersRes && ordersRes.success && ordersRes.data && ordersRes.data.length > 0) {
              setBuyerOrders(ordersRes.data);
            }
          }
        }
      } catch (err) {
        // Graceful fallback: continue without disruptive offline error notices
      }
    };
    checkAndSyncBackend();
  }, [currentUser]);

  // Recalculate Field Health Score dynamically based on plot moisture & pesticide shield
  const calculateFieldHealth = (field) => {
    if (!field || !field.zones || field.zones.length === 0) return 85;
    const avgMoisture = field.zones.reduce((acc, z) => acc + (z.moisture || 50), 0) / field.zones.length;
    let score = Math.round(avgMoisture * 0.95);
    if (field.pesticideShield) score += 8;
    return Math.min(99, Math.max(35, score));
  };

  // ==================== AUTHENTICATION HANDLERS ====================
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'register') {
      if (!authName.trim()) {
        setAuthError('Please enter your full name.');
        return;
      }
      if (authPassword.length < 6) {
        setAuthError('Password must be at least 6 characters long.');
        return;
      }
      if (authPassword !== authConfirmPassword) {
        setAuthError('Passwords do not match.');
        return;
      }

      // 1. Send Registration to MongoDB Backend
      const backendRes = await api.register({
        name: authName.trim(),
        phone: authIdentifier.trim(),
        email: authIdentifier.includes('@') ? authIdentifier.trim() : undefined,
        password: authPassword,
        role: authRole === 'buyer' ? 'Buyer' : 'Farmer'
      });

      if (backendRes && backendRes.token) {
        localStorage.setItem('smartfarm_token', backendRes.token);
      }

      const newUser = {
        id: backendRes?.user?.id || 'user-' + Date.now(),
        name: authName.trim(),
        identifier: authIdentifier.trim(),
        role: authRole,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('smartfarm_active_user', JSON.stringify(newUser));
      setCurrentUser(newUser);

      // Create Initial Field for new farmer in MongoDB
      if (authRole === 'farmer') {
        const initialFieldData = {
          name: 'Plot 1: Main Farm',
          crop: 'Tomato (Tamatar)',
          soilMoisture: 65,
          marketPrice: '₹40 / kg'
        };

        const createRes = await api.createField(initialFieldData);
        if (createRes && createRes.success && createRes.data) {
          setUserFields([createRes.data]);
          setSelectedFieldId(createRes.data._id);
        } else {
          // Local fallback
          const localField = {
            id: 'field-' + Date.now(),
            name: 'Plot 1: Main Farm',
            crop: 'Tomato (Tamatar)',
            area: '4.0 Acres',
            healthScore: 88,
            healthStatus: 'Good',
            soilMoisture: 65,
            moistureStatus: 'Healthy & Moist',
            pesticideShield: false,
            lastPesticideSpray: 'Not Applied',
            temp: 24,
            weatherText: 'Sunny & Clear',
            rainChance: '5%',
            wind: '8 km/h',
            marketPrice: '₹40 / kg',
            marketTrend: '+6% this week',
            zones: [
              { id: 'z1', name: 'North Plot', moisture: 70, status: 'Healthy', color: '#22c55e', pestProtected: false },
              { id: 'z2', name: 'Center Plot', moisture: 55, status: 'Needs Water', color: '#eab308', pestProtected: false },
              { id: 'z3', name: 'South Plot', moisture: 68, status: 'Healthy', color: '#22c55e', pestProtected: false }
            ],
            tasks: [
              { id: 1, text: 'Soil preparation and basal compost spray', time: 'Today', priority: 'High', done: false }
            ]
          };
          setUserFields([localField]);
          setSelectedFieldId(localField.id);
        }
      }

      showToast(`Welcome to SmartFarm, ${newUser.name}! Stored to database.`);
    } else {
      // Login mode
      if (!authIdentifier.trim() || !authPassword) {
        setAuthError('Please enter your mobile/email and password.');
        return;
      }

      // 1. Send Login to MongoDB Backend
      const backendRes = await api.login(authIdentifier.trim(), authPassword);

      if (backendRes && backendRes.token) {
        localStorage.setItem('smartfarm_token', backendRes.token);
      }

      const loggedInUser = {
        id: backendRes?.user?.id || 'user-' + authIdentifier.replace(/[^a-zA-Z0-9]/g, ''),
        name: backendRes?.user?.name || (authIdentifier.includes('@') ? authIdentifier.split('@')[0] : 'Farmer ' + authIdentifier.slice(-4)),
        identifier: authIdentifier.trim(),
        role: authRole,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('smartfarm_active_user', JSON.stringify(loggedInUser));
      setCurrentUser(loggedInUser);

      // Load user's fields from MongoDB
      if (authRole === 'farmer') {
        const fieldsRes = await api.getFields();
        if (fieldsRes && fieldsRes.success && fieldsRes.data && fieldsRes.data.length > 0) {
          setUserFields(fieldsRes.data);
          setSelectedFieldId(fieldsRes.data[0]._id || fieldsRes.data[0].id);
        }
      }

      showToast(`Logged in successfully as ${loggedInUser.name}`);
    }

    setAuthPassword('');
    setAuthConfirmPassword('');
  };

  // Quick 1-Click Demo Login (Connects with MongoDB seed data)
  const handleQuickDemo = async (role, demoName, demoId) => {
    const phone = demoId === 'farmer-ramesh' ? '9876543210' : '9988776655';
    
    // Attempt login to MongoDB Backend
    const res = await api.login(phone, 'password123');
    if (res && res.token) {
      localStorage.setItem('smartfarm_token', res.token);
    }

    const demoUser = {
      id: res?.user?.id || demoId,
      name: res?.user?.name || demoName,
      identifier: phone,
      role: role
    };

    localStorage.setItem('smartfarm_active_user', JSON.stringify(demoUser));
    setCurrentUser(demoUser);

    if (role === 'farmer') {
      const fieldsRes = await api.getFields();
      if (fieldsRes && fieldsRes.success && fieldsRes.data && fieldsRes.data.length > 0) {
        setUserFields(fieldsRes.data);
        setSelectedFieldId(fieldsRes.data[0]._id || fieldsRes.data[0].id);
      } else {
        // Fallback demo data
        const rameshFields = initialData.fields.map(f => ({
          ...f,
          pesticideShield: true,
          lastPesticideSpray: 'Yesterday (Neem Bio-Shield)',
          zones: [
            { id: 'z1', name: 'North Plot', moisture: 78, status: 'Healthy', color: '#22c55e', pestProtected: true },
            { id: 'z2', name: 'Center Plot', moisture: 42, status: 'Needs Water', color: '#eab308', pestProtected: false },
            { id: 'z3', name: 'South Plot', moisture: 74, status: 'Healthy', color: '#22c55e', pestProtected: true }
          ]
        }));
        setUserFields(rameshFields);
        setSelectedFieldId(rameshFields[0].id);
      }
    }

    showToast(`Signed in as ${demoName} (${role.toUpperCase()})`);
  };

  const handleLogout = () => {
    localStorage.removeItem('smartfarm_active_user');
    localStorage.removeItem('smartfarm_token');
    setCurrentUser(null);
    showToast('You have been logged out.');
  };

  // ==================== FARMER ACTIONS (WATERING & PESTICIDES) ====================
  // Water an entire field & save to MongoDB
  const handleWaterEntireField = async () => {
    if (!activeField) return;

    // Call MongoDB water endpoint
    const fieldDbId = activeField._id || activeField.id;
    if (fieldDbId) {
      api.waterField(fieldDbId);
    }

    setUserFields(prev =>
      prev.map(f => {
        if (f.id === activeField.id || f._id === activeField._id) {
          const updatedZones = f.zones.map(z => ({
            ...z,
            moisture: Math.min(95, z.moisture + 28),
            status: 'Healthy',
            color: '#22c55e'
          }));
          const updatedField = {
            ...f,
            soilMoisture: 88,
            moistureStatus: 'Freshly Watered & Optimal',
            zones: updatedZones
          };
          updatedField.healthScore = calculateFieldHealth(updatedField);
          updatedField.healthStatus = 'Excellent';
          return updatedField;
        }
        return f;
      })
    );
    showToast(`💧 ${activeField.name} watered! Saved to MongoDB.`);
  };

  // Water a single plot
  const handleWaterSinglePlot = (plotId) => {
    setUserFields(prev =>
      prev.map(f => {
        if (f.id === activeField.id || f._id === activeField._id) {
          const updatedZones = f.zones.map(z => {
            if (z.id === plotId || z._id === plotId) {
              const newMoist = Math.min(95, z.moisture + 32);
              return {
                ...z,
                moisture: newMoist,
                status: 'Healthy',
                color: '#22c55e'
              };
            }
            return z;
          });
          const avgM = Math.round(updatedZones.reduce((a, b) => a + b.moisture, 0) / updatedZones.length);
          const updatedField = {
            ...f,
            soilMoisture: avgM,
            moistureStatus: avgM >= 60 ? 'Healthy & Moist' : 'Needs Water',
            zones: updatedZones
          };
          updatedField.healthScore = calculateFieldHealth(updatedField);
          updatedField.healthStatus = updatedField.healthScore >= 90 ? 'Excellent' : 'Good';
          return updatedField;
        }
        return f;
      })
    );
    showToast(`💧 Plot watered! Moisture updated in database.`);
  };

  // Apply Pesticide Spray to field
  const handleApplyPesticideSpray = (pesticideName = 'Neem-Bio Organic Shield') => {
    if (!activeField) return;
    setUserFields(prev =>
      prev.map(f => {
        if (f.id === activeField.id || f._id === activeField._id) {
          const updatedZones = f.zones.map(z => ({ ...z, pestProtected: true }));
          const updatedField = {
            ...f,
            pesticideShield: true,
            lastPesticideSpray: `Applied Today (${pesticideName})`,
            zones: updatedZones
          };
          updatedField.healthScore = calculateFieldHealth(updatedField);
          return updatedField;
        }
        return f;
      })
    );
    showToast(`🛡️ ${pesticideName} applied! Health Score updated in database.`);
  };

  // ==================== TASK MANAGEMENT ====================
  const handleAddCustomTask = async (e) => {
    e.preventDefault();
    if (!customTaskText.trim()) return;

    // Save Task to MongoDB Backend
    const taskRes = await api.createTask({
      text: customTaskText.trim(),
      priority: customTaskPriority,
      time: customTaskDue,
      fieldId: activeField._id || null
    });

    const newTask = {
      id: taskRes?.data?._id || Date.now(),
      _id: taskRes?.data?._id,
      text: customTaskText.trim(),
      priority: customTaskPriority,
      time: customTaskDue,
      done: false
    };

    setUserFields(prev =>
      prev.map(f => {
        if (f.id === activeField.id || f._id === activeField._id) {
          return {
            ...f,
            tasks: [newTask, ...f.tasks]
          };
        }
        return f;
      })
    );

    setCustomTaskText('');
    showToast('Task added and saved to MongoDB!');
  };

  const handleToggleTask = async (taskId) => {
    api.toggleTask(taskId);

    setUserFields(prev =>
      prev.map(f => {
        if (f.id === activeField.id || f._id === activeField._id) {
          return {
            ...f,
            tasks: f.tasks.map(t => (t.id === taskId || t._id === taskId ? { ...t, done: !t.done } : t))
          };
        }
        return f;
      })
    );
  };

  const handleDeleteTask = async (taskId, e) => {
    e.stopPropagation();
    api.deleteTask(taskId);

    setUserFields(prev =>
      prev.map(f => {
        if (f.id === activeField.id || f._id === activeField._id) {
          return {
            ...f,
            tasks: f.tasks.filter(t => t.id !== taskId && t._id !== taskId)
          };
        }
        return f;
      })
    );
    showToast('Task removed from database.');
  };

  // ==================== FIELD CREATION (STORES IN MONGODB) ====================
  const handleCreateField = async (e) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    const moistureVal = Number(newMoisture) || 65;

    // 1. Send to MongoDB Backend
    const createRes = await api.createField({
      name: newFieldName.trim(),
      crop: newCropName.trim(),
      soilMoisture: moistureVal,
      marketPrice: `₹${newTargetPrice || 50} / kg`
    });

    const isMoist = moistureVal >= 60;
    const createdField = createRes?.data || {
      id: 'field-' + Date.now(),
      name: newFieldName.trim(),
      crop: newCropName.trim(),
      area: newArea.trim() || '5.0 Acres',
      healthScore: isMoist ? 92 : 72,
      healthStatus: isMoist ? 'Excellent' : 'Needs Water',
      soilMoisture: moistureVal,
      moistureStatus: isMoist ? 'Healthy & Moist' : 'Needs Water',
      pesticideShield: false,
      lastPesticideSpray: 'Not Applied',
      temp: 24.5,
      weatherText: 'Partly Sunny',
      rainChance: '10%',
      wind: '8 km/h',
      marketPrice: `₹${newTargetPrice || 50} / kg`,
      marketTrend: '+5% this week',
      zones: [
        { id: 'z1', name: 'North Plot', moisture: moistureVal, status: isMoist ? 'Healthy' : 'Needs Water', color: isMoist ? '#22c55e' : '#eab308', pestProtected: false },
        { id: 'z2', name: 'Center Plot', moisture: Math.max(30, moistureVal - 15), status: moistureVal - 15 >= 60 ? 'Healthy' : 'Needs Water', color: moistureVal - 15 >= 60 ? '#22c55e' : '#eab308', pestProtected: false },
        { id: 'z3', name: 'South Plot', moisture: Math.min(90, moistureVal + 10), status: 'Healthy', color: '#22c55e', pestProtected: false }
      ],
      tasks: [
        { id: Date.now() + 1, text: newInitialTask || `Initial inspection for ${newCropName}`, time: 'Today', priority: newInitialPriority, done: false }
      ]
    };

    createdField.healthScore = calculateFieldHealth(createdField);

    setUserFields([...userFields, createdField]);
    setSelectedFieldId(createdField._id || createdField.id);
    setShowAddFieldModal(false);
    setNewFieldName('');
    showToast(`✅ ${createdField.name} saved directly to MongoDB Atlas!`);
  };

  const handleDeleteField = async (fieldId) => {
    if (userFields.length <= 1) {
      alert('You must keep at least one field.');
      return;
    }

    // Call MongoDB Delete
    api.deleteField(fieldId);

    const filtered = userFields.filter(f => f.id !== fieldId && f._id !== fieldId);
    setUserFields(filtered);
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(filtered[0]?._id || filtered[0]?.id);
    }
    showToast('Field deleted from MongoDB.');
  };

  // ==================== DYNAMIC MANDI PRICE UPDATE (REFLECTED LIVE IN MANDI) ====================
  const handleUpdateFieldPrice = async (newPriceVal) => {
    const numericPrice = Number(newPriceVal);
    if (!numericPrice || numericPrice <= 0) {
      showToast('⚠️ Please enter a valid price greater than ₹0.');
      return;
    }

    const formattedPrice = `₹${numericPrice} / kg`;

    // 1. Update userFields state locally
    setUserFields(prevFields =>
      prevFields.map(f => {
        if (f.id === activeField.id || f._id === activeField._id) {
          return { ...f, marketPrice: formattedPrice };
        }
        return f;
      })
    );

    // 2. Persist to Backend API (MongoDB Atlas & Local DB)
    const fieldDbId = activeField._id || activeField.id;
    if (fieldDbId) {
      api.updateFieldPrice(fieldDbId, numericPrice);
    }

    // 3. Immediately reflect in Mandi Wholesale Marketplace listings
    setMarketplaceListings(prevListings => {
      const cropQuery = (activeField.crop || '').toLowerCase().trim();
      const currentFieldId = String(activeField._id || activeField.id);

      const hasMatch = prevListings.some(item =>
        (item.fieldId && String(item.fieldId) === currentFieldId) ||
        (item.crop && (item.crop.toLowerCase().includes(cropQuery) || cropQuery.includes(item.crop.toLowerCase())))
      );

      if (hasMatch) {
        return prevListings.map(item => {
          const match =
            (item.fieldId && String(item.fieldId) === currentFieldId) ||
            (item.crop && (item.crop.toLowerCase().includes(cropQuery) || cropQuery.includes(item.crop.toLowerCase())));
          if (match) {
            return {
              ...item,
              pricePerKg: numericPrice,
              lastPriceUpdated: 'Just now by Farmer',
              isDynamicUpdated: true
            };
          }
          return item;
        });
      } else {
        const newListing = {
          id: 'list-' + Date.now(),
          farmerName: currentUser?.name || 'Ramesh Kumar',
          farmerPhone: currentUser?.phone || currentUser?.identifier || '9876543210',
          location: currentUser?.farmLocation || 'Maharashtra, India',
          crop: activeField.crop,
          quantity: activeField.area ? `${parseFloat(activeField.area) * 1000} kg` : '6,000 kg',
          pricePerKg: numericPrice,
          grade: 'Grade A+ (Farmer Direct)',
          harvestReady: 'Ready in 2 Days',
          fieldId: currentFieldId,
          isDynamicUpdated: true,
          lastPriceUpdated: 'Just now by Farmer'
        };
        return [newListing, ...prevListings];
      }
    });

    setCustomMandiPrice(numericPrice);
    showToast(`📈 Mandi rate for ${activeField.crop} updated to ₹${numericPrice}/kg! Reflected live on Buyer Terminal.`);
  };

  // ==================== BUYER ORDER EXECUTION ====================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!buyingListing || purchaseQty <= 0) return;

    const totalAmount = purchaseQty * buyingListing.pricePerKg;
    const newOrderData = {
      crop: buyingListing.crop,
      farmerName: buyingListing.farmerName,
      farmerPhone: buyingListing.farmerPhone,
      location: buyingListing.location,
      quantityKg: purchaseQty,
      ratePerKg: buyingListing.pricePerKg,
      totalAmount: totalAmount,
      status: 'Confirmed (Payment Escrow)',
      orderDate: new Date().toLocaleDateString('en-IN')
    };

    // Store in backend database
    const res = await api.createOrder(newOrderData);
    const persistedOrder = res?.data || {
      orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      ...newOrderData
    };

    setBuyerOrders([persistedOrder, ...buyerOrders]);
    setBuyingListing(null);
    setBuyerActiveTab('orders');
    showToast(`🎉 Order Placed! ₹${totalAmount.toLocaleString('en-IN')} stored in database for ${persistedOrder.crop}.`);
  };

  return (
    <div className="farm-app">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-banner">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==================== GLOBAL APP HEADER ==================== */}
      <header className="top-nav">
        <div className="logo-section">
          <div className="logo-icon">
            <Sprout size={24} color="#ffffff" />
          </div>
          <div>
            <h1 className="logo-title">SmartFarm Agritech OS</h1>
            <p className="logo-sub">Precision Field Management & Mandi Marketplace</p>
          </div>
        </div>

        {/* User Profile & Auth Actions */}
        <div className="header-right-tools">
          {currentUser ? (
            <div className="user-profile-badge">
              <div className="avatar-circle">
                <User size={15} />
              </div>
              <div className="user-details">
                <span className="user-name">{currentUser.name}</span>
                <span className={`user-role-tag ${currentUser.role}`}>
                  {currentUser.role === 'farmer' ? '👨‍🌾 Certified Farmer' : '🛒 Mandi Bulk Buyer'}
                </span>
              </div>
              <button className="btn-logout" onClick={handleLogout} title="Log Out">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="unauth-header-chips">
              <span className="guest-label">Guest Mode</span>
              <button className="btn-signin-nav" onClick={() => setAuthMode('login')}>
                <LogIn size={15} /> Sign In / Register
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ==================== IF NOT LOGGED IN: COMPACT SMALL BOX AUTH ==================== */}
      {!currentUser ? (
        <div className="auth-portal-screen auth-center-layout">
          <div className="auth-smallbox-card">
            {/* Box Header */}
            <div className="auth-box-header">
              <div className="auth-box-icon">
                <Sprout size={26} color="#16a34a" />
              </div>
              <h2 className="auth-box-title">
                {authMode === 'login' ? 'Sign In to SmartFarm' : 'Create an Account'}
              </h2>
              <p className="auth-box-subtitle">
                {authMode === 'login'
                  ? 'Access crop sensors, irrigation & live Mandi terminal'
                  : 'Join the next-gen precision agritech network'}
              </p>
            </div>

            {/* Auth Tab Switch */}
            <div className="auth-tab-switch">
              <button
                type="button"
                className={`tab-switch-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`tab-switch-btn ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
              >
                Register
              </button>
            </div>

            {authError && (
              <div className="auth-error-chip">
                <AlertTriangle size={14} />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="auth-form-fields">
              <div className="form-group">
                <label>I am signing in as:</label>
                <div className="role-selector-pill">
                  <button
                    type="button"
                    className={`role-option-btn ${authRole === 'farmer' ? 'selected' : ''}`}
                    onClick={() => setAuthRole('farmer')}
                  >
                    👨‍🌾 Farmer
                  </button>
                  <button
                    type="button"
                    className={`role-option-btn ${authRole === 'buyer' ? 'selected' : ''}`}
                    onClick={() => setAuthRole('buyer')}
                  >
                    🛒 Mandi Buyer
                  </button>
                </div>
              </div>

              {authMode === 'register' && (
                <div className="form-group">
                  <label>Full Name *</label>
                  <div className="input-with-icon">
                    <User size={16} />
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Mobile Number or Email *</label>
                <div className="input-with-icon">
                  <Phone size={16} />
                  <input
                    type="text"
                    placeholder="9876543210 or email"
                    value={authIdentifier}
                    onChange={(e) => setAuthIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password *</label>
                <div className="input-with-icon">
                  <Lock size={16} />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <div className="input-with-icon">
                    <Lock size={16} />
                    <input
                      type="password"
                      placeholder="Re-enter password"
                      value={authConfirmPassword}
                      onChange={(e) => setAuthConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn-auth-primary">
                {authMode === 'register' ? 'Register Account' : 'Sign In'}
              </button>
            </form>

            {/* Quick 1-Click Demo Accounts */}
            <div className="auth-box-demo">
              <div className="auth-box-divider">
                <span>or 1-click demo access</span>
              </div>
              <div className="auth-box-demo-grid">
                <button
                  type="button"
                  className="btn-compact-demo farmer"
                  onClick={() => handleQuickDemo('farmer', 'Ramesh Kumar (Farmer)', 'farmer-ramesh')}
                  title="1-Click Login as Farmer Ramesh"
                >
                  <span className="demo-emoji">👨‍🌾</span>
                  <div className="demo-txt">
                    <strong>Farmer Demo</strong>
                    <small>Ramesh Kumar</small>
                  </div>
                </button>
                <button
                  type="button"
                  className="btn-compact-demo buyer"
                  onClick={() => handleQuickDemo('buyer', 'Priya Sharma (Mandi Wholesale)', 'buyer-priya')}
                  title="1-Click Login as Mandi Buyer Priya"
                >
                  <span className="demo-emoji">🛒</span>
                  <div className="demo-txt">
                    <strong>Buyer Demo</strong>
                    <small>Priya Sharma</small>
                  </div>
                </button>
              </div>
            </div>

            <div className="auth-box-footer">
              <Database size={12} color="#16a34a" />
              <span>MongoDB Atlas Cloud Synced</span>
            </div>
          </div>
        </div>
      ) : currentUser.role === 'buyer' ? (
        /* ==================== BUYER DEDICATED PORTAL ==================== */
        <div className="buyer-portal-wrapper">
          <div className="portal-subbar">
            <div className="subbar-left">
              <h2>Mandi Procurement Terminal</h2>
              <p>Direct wholesale purchasing from verified local farmers with farm-level quality tracking.</p>
            </div>
            <div className="subbar-tabs">
              <button
                className={`subbar-tab-btn ${buyerActiveTab === 'marketplace' ? 'active' : ''}`}
                onClick={() => setBuyerActiveTab('marketplace')}
              >
                <Package size={15} /> Available Harvests
              </button>
              <button
                className={`subbar-tab-btn ${buyerActiveTab === 'orders' ? 'active' : ''}`}
                onClick={() => setBuyerActiveTab('orders')}
              >
                <ShoppingBag size={15} /> My Procurements ({buyerOrders.length})
              </button>
            </div>
          </div>

          {buyerActiveTab === 'marketplace' ? (
            <div className="marketplace-grid">
              {marketplaceListings.map(item => (
                <div key={item.id} className="card harvest-listing-card">
                  <div className="listing-top">
                    <span className="badge-quality">{item.grade}</span>
                    <span className="badge-dispatch">{item.harvestReady}</span>
                  </div>

                  <h3 className="listing-crop-title">{item.crop}</h3>
                  <div className="listing-price-row">
                    <span className="price-tag">₹{item.pricePerKg}</span>
                    <span className="price-unit">/ kg wholesale</span>
                    {item.isDynamicUpdated && (
                      <span className="badge-dynamic-updated" title="Price dynamically updated by farmer in real time">
                        🟢 Live Farmer Rate
                      </span>
                    )}
                  </div>

                  <div className="listing-meta-box">
                    <div><strong>Farmer:</strong> {item.farmerName}</div>
                    <div><strong>Location:</strong> {item.location}</div>
                    <div><strong>Available Lot:</strong> <span className="highlight-qty">{item.quantity}</span></div>
                    <div><strong>Contact:</strong> +91 {item.farmerPhone}</div>
                  </div>

                  <button className="btn-buy-lot" onClick={() => setBuyingListing(item)}>
                    <ShoppingBag size={15} /> Purchase Lot / Place Order
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card orders-history-card">
              <h3>My Purchase Orders & Logistics</h3>
              {buyerOrders.length === 0 ? (
                <div className="empty-state-box">
                  <Package size={36} color="#94a3b8" />
                  <p>You haven't placed any crop procurement orders yet.</p>
                  <button className="btn-action-light" onClick={() => setBuyerActiveTab('marketplace')}>
                    Browse Available Crops
                  </button>
                </div>
              ) : (
                <div className="orders-table-wrapper">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Crop</th>
                        <th>Farmer Details</th>
                        <th>Quantity</th>
                        <th>Mandi Rate</th>
                        <th>Total Billing</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buyerOrders.map(ord => (
                        <tr key={ord.orderId}>
                          <td className="font-mono font-bold">{ord.orderId}</td>
                          <td><strong>{ord.crop}</strong></td>
                          <td>{ord.farmerName} ({ord.location})</td>
                          <td>{ord.quantityKg.toLocaleString('en-IN')} kg</td>
                          <td>₹{ord.ratePerKg}/kg</td>
                          <td className="text-emerald font-bold">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                          <td><span className="status-badge-active">{ord.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ==================== FARMER DASHBOARD ==================== */
        <div className="farmer-dashboard-wrapper">
          
          <div className="farmer-module-nav">
            <button
              className={`module-nav-btn ${farmerActiveTab === 'fields' ? 'active' : ''}`}
              onClick={() => setFarmerActiveTab('fields')}
            >
              <Sprout size={16} /> My Farm & Plots
            </button>
            <button
              className={`module-nav-btn ${farmerActiveTab === 'seasons' ? 'active' : ''}`}
              onClick={() => setFarmerActiveTab('seasons')}
            >
              <Calendar size={16} /> All-Season Crop Recommendations
            </button>
            <button
              className={`module-nav-btn ${farmerActiveTab === 'pesticides' ? 'active' : ''}`}
              onClick={() => setFarmerActiveTab('pesticides')}
            >
              <ShieldCheck size={16} /> Pesticides & Bio-Inputs Store
            </button>
          </div>

          {/* TAB 1: MY FIELDS, PLOT WATERING & TASKS */}
          {farmerActiveTab === 'fields' && (
            <>
              {/* Field Selector Bar */}
              <div className="field-bar-container">
                <span className="selector-label">Your Fields:</span>
                <div className="field-buttons">
                  {userFields.map(f => {
                    const isAllWatered = (f.soilMoisture || 60) >= 60;
                    const fieldKey = f._id || f.id;
                    return (
                      <button
                        key={fieldKey}
                        className={`field-btn ${(f.id === activeField?.id || f._id === activeField?._id) ? 'active' : ''}`}
                        onClick={() => setSelectedFieldId(fieldKey)}
                      >
                        <span
                          className="field-status-dot"
                          style={{ backgroundColor: isAllWatered ? '#22c55e' : '#eab308' }}
                          title={isAllWatered ? 'Soil Watered & Healthy' : 'Needs Irrigation'}
                        />
                        {f.name} ({f.crop})
                      </button>
                    );
                  })}

                  <button className="btn-add-field" onClick={() => setShowAddFieldModal(true)}>
                    <Plus size={15} /> Add New Field
                  </button>
                </div>
              </div>

              {activeField && (
                <div className="dashboard-grid">
                  {/* Left Column: Crop Health, Weather, Interactive Plots */}
                  <div className="main-column">
                    
                    {/* Big Health Banner with Dynamic Score & Spray Protection */}
                    <div className="card health-banner">
                      <div className="health-left">
                        <div className="health-badge-row">
                          <span className="pill-crop">{activeField.crop}</span>
                          <span className="pill-area">{activeField.area || '5.0 Acres'}</span>

                          {activeField.pesticideShield ? (
                            <span className="pill-pesticide-shield">
                              <ShieldCheck size={13} /> Pest Shield Active
                            </span>
                          ) : (
                            <span className="pill-pesticide-alert">
                              <AlertTriangle size={13} /> Pest Shield Expired
                            </span>
                          )}

                          {userFields.length > 1 && (
                            <button
                              className="btn-delete-field"
                              onClick={() => handleDeleteField(activeField._id || activeField.id)}
                              title="Delete this field from MongoDB"
                            >
                              <Trash2 size={14} /> Remove Field
                            </button>
                          )}
                        </div>

                        <h2 className="health-title">
                          Crop Health: {activeField.healthStatus || 'Good'} ({activeField.healthScore || 85}%)
                        </h2>
                        <p className="health-desc">
                          Field conditions: <strong>{activeField.moistureStatus}</strong>. Last pesticide spray: <em>{activeField.lastPesticideSpray}</em>.
                        </p>

                        {/* Interactive Soil Moisture Progress */}
                        <div className="moisture-meter-box">
                          <div className="moisture-label-row">
                            <span>
                              Mean Soil Moisture: <strong>{activeField.soilMoisture}%</strong>
                            </span>
                            <span>Target Zone: 60% – 85%</span>
                          </div>
                          <div className="meter-track">
                            <div
                              className="meter-fill"
                              style={{
                                width: `${activeField.soilMoisture}%`,
                                backgroundColor: activeField.soilMoisture >= 60 ? '#16a34a' : '#eab308'
                              }}
                            />
                          </div>
                        </div>

                        {/* Quick Field-Level Actions */}
                        <div className="field-action-button-row">
                          <button className="btn-water-field" onClick={handleWaterEntireField}>
                            <Droplets size={15} /> Water All Plots (15m Pulse)
                          </button>
                          <button
                            className="btn-spray-field"
                            onClick={() => handleApplyPesticideSpray('Neem-Bio Organic Shield')}
                          >
                            <Shield size={15} /> Apply Bio-Pesticide Spray
                          </button>
                        </div>
                      </div>

                      <div className="health-right">
                        <div
                          className="health-score-circle"
                          style={{
                            borderColor: activeField.healthScore >= 85 ? '#22c55e' : activeField.healthScore >= 60 ? '#eab308' : '#ef4444'
                          }}
                        >
                          <span className="score-num">{activeField.healthScore}%</span>
                          <span className="score-label">Live Score</span>
                        </div>
                        <span className="score-hint">Synced with MongoDB</span>
                      </div>
                    </div>

                    {/* Weather Metric Tiles */}
                    <div className="weather-grid">
                      <div className="card weather-box">
                        <div className="weather-header">
                          <Sun size={20} className="icon-sun" />
                          <span>Air Temperature</span>
                        </div>
                        <div className="weather-big-text">{activeField.temp}°C</div>
                        <div className="weather-sub">{activeField.weatherText}</div>
                      </div>

                      <div className="card weather-box">
                        <div className="weather-header">
                          <CloudRain size={20} className="icon-rain" />
                          <span>Precipitation Chance</span>
                        </div>
                        <div className="weather-big-text">{activeField.rainChance}</div>
                        <div className="weather-sub">Clear spray window</div>
                      </div>

                      <div className="card weather-box">
                        <div className="weather-header">
                          <Wind size={20} className="icon-wind" />
                          <span>Wind Speed</span>
                        </div>
                        <div className="weather-big-text">{(activeField.wind || '9 km/h').split(' ')[0]} <span className="unit">km/h</span></div>
                        <div className="weather-sub">Gentle breeze, safe for spray</div>
                      </div>
                    </div>

                    {/* Visual Plot Grid */}
                    <div className="card field-map-card">
                      <div className="card-header-simple">
                        <div>
                          <h3>{activeField.name} Plot Array & Hydration Zones</h3>
                          <p className="card-sub-p">
                            🟢 <strong>Green</strong> = Watered & Optimal (&gt;=60%) | 🟡 <strong>Yellow</strong> = Needs Water (&lt;60%)
                          </p>
                        </div>
                      </div>

                      <div className="field-visual-boxes">
                        {(activeField.zones || []).map((zone, idx) => {
                          const isWatered = (zone.moisture || 60) >= 60;
                          const zoneKey = zone._id || zone.id || idx;
                          return (
                            <div
                              key={zoneKey}
                              className={`zone-plot-card ${isWatered ? 'is-watered' : 'needs-water'}`}
                            >
                              <div className="zone-card-top">
                                <div className="zone-indicator-group">
                                  <span
                                    className="zone-dot"
                                    style={{ backgroundColor: isWatered ? '#22c55e' : '#eab308' }}
                                  />
                                  <h4>{zone.name}</h4>
                                </div>
                                <span className={`zone-status-badge ${isWatered ? 'healthy' : 'dry'}`}>
                                  {isWatered ? 'Watered' : 'Needs Water'}
                                </span>
                              </div>

                              <div className="zone-moisture-display">
                                <span className="zone-m-lbl">Moisture Level:</span>
                                <span className="zone-m-val font-mono">{zone.moisture}%</span>
                              </div>

                              <div className="zone-mini-meter">
                                <div
                                  className="zone-mini-fill"
                                  style={{
                                    width: `${zone.moisture}%`,
                                    backgroundColor: isWatered ? '#22c55e' : '#eab308'
                                  }}
                                />
                              </div>

                              <div className="zone-plot-actions">
                                <button
                                  className="btn-water-plot"
                                  onClick={() => handleWaterSinglePlot(zone.id || zone._id)}
                                >
                                  <Droplets size={13} /> Water Plot
                                </button>
                                <button
                                  className="btn-spray-plot"
                                  onClick={() => handleApplyPesticideSpray(`Plot Spray (${zone.name})`)}
                                >
                                  <Shield size={13} /> Spray Plot
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Custom Task Assignment & Mandi Rate */}
                  <div className="side-column">
                    
                    <div className="card tasks-card">
                      <div className="card-header-simple">
                        <div className="task-title-wrap">
                          <Sparkles size={18} className="icon-sparkle" />
                          <h3>Tasks for {activeField.crop}</h3>
                        </div>
                        <span className="badge-count">
                          {(activeField.tasks || []).filter(t => !t.done).length} Pending
                        </span>
                      </div>

                      <form onSubmit={handleAddCustomTask} className="custom-task-creator">
                        <input
                          type="text"
                          placeholder="Add new task (e.g. Apply zinc spray, weed plot 2)..."
                          value={customTaskText}
                          onChange={(e) => setCustomTaskText(e.target.value)}
                          className="task-input-field"
                        />

                        <div className="priority-bar-selector">
                          <span className="priority-lbl">Set Priority:</span>
                          <div className="priority-buttons">
                            {['Urgent', 'High', 'Normal', 'Low'].map(p => (
                              <button
                                key={p}
                                type="button"
                                className={`priority-btn ${p.toLowerCase()} ${customTaskPriority === p ? 'selected' : ''}`}
                                onClick={() => setCustomTaskPriority(p)}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="task-form-bottom-row">
                          <select
                            value={customTaskDue}
                            onChange={(e) => setCustomTaskDue(e.target.value)}
                            className="task-due-select"
                          >
                            <option value="Today">Due Today</option>
                            <option value="Tomorrow">Due Tomorrow</option>
                            <option value="In 3 Days">Due in 3 Days</option>
                            <option value="Next Week">Due Next Week</option>
                          </select>

                          <button type="submit" className="btn-add-task-submit">
                            <Plus size={14} /> Add Task
                          </button>
                        </div>
                      </form>

                      <div className="task-list">
                        {(activeField.tasks || []).map(task => {
                          const taskKey = task._id || task.id;
                          return (
                            <div
                              key={taskKey}
                              className={`task-item ${task.done ? 'task-done' : ''}`}
                              onClick={() => handleToggleTask(taskKey)}
                            >
                              <div className="task-checkbox">
                                {task.done ? (
                                  <CheckCircle size={20} color="#16a34a" />
                                ) : (
                                  <Circle size={20} color="#94a3b8" />
                                )}
                              </div>
                              <div className="task-content">
                                <span className="task-text">{task.text}</span>
                                <div className="task-meta-row">
                                  <span className={`priority-chip ${(task.priority || 'normal').toLowerCase()}`}>
                                    {task.priority || 'Normal'}
                                  </span>
                                  <span className="task-time">{task.time}</span>
                                </div>
                              </div>

                              <button
                                className="btn-trash-task"
                                onClick={(e) => handleDeleteTask(taskKey, e)}
                                title="Delete task from database"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mandi Rate Card with Dynamic Pricing Controller */}
                    <div className="card market-card">
                      <div className="market-top">
                        <span className="market-tag">Current Mandi Benchmark</span>
                        <span className="market-gain">
                          <TrendingUp size={14} /> {activeField.marketTrend || '+8% this week'}
                        </span>
                      </div>

                      <div className="market-crop-name">{activeField.crop}</div>

                      <div className="market-price-header-row">
                        <div className="market-price-big">
                          ₹{parseInt(String(activeField.marketPrice || '').replace(/[^0-9]/g, ''), 10) || customMandiPrice || 65} <span className="price-unit-sub">/ kg</span>
                        </div>
                        <span className="mandi-live-badge">
                          <span className="live-pulse-dot"></span> Live in Mandi
                        </span>
                      </div>

                      {/* Dynamic Price Adjuster */}
                      <div className="price-adjuster-box">
                        <div className="adjuster-header-row">
                          <span className="adjuster-title">⚡ Farmer Dynamic Rate Controller</span>
                          <span className="adjuster-hint">Instant Mandi Sync</span>
                        </div>

                        {/* Quick increment/decrement buttons */}
                        <div className="quick-stepper-row">
                          <span className="stepper-label">Quick Adjust:</span>
                          <div className="stepper-buttons">
                            <button
                              type="button"
                              className="btn-stepper minus"
                              onClick={() => {
                                const curr = parseInt(String(activeField.marketPrice || '').replace(/[^0-9]/g, ''), 10) || 65;
                                handleUpdateFieldPrice(Math.max(5, curr - 5));
                              }}
                              title="Decrease price by ₹5"
                            >
                              - ₹5
                            </button>
                            <button
                              type="button"
                              className="btn-stepper minus"
                              onClick={() => {
                                const curr = parseInt(String(activeField.marketPrice || '').replace(/[^0-9]/g, ''), 10) || 65;
                                handleUpdateFieldPrice(Math.max(5, curr - 2));
                              }}
                              title="Decrease price by ₹2"
                            >
                              - ₹2
                            </button>
                            <button
                              type="button"
                              className="btn-stepper plus"
                              onClick={() => {
                                const curr = parseInt(String(activeField.marketPrice || '').replace(/[^0-9]/g, ''), 10) || 65;
                                handleUpdateFieldPrice(curr + 2);
                              }}
                              title="Increase price by ₹2"
                            >
                              + ₹2
                            </button>
                            <button
                              type="button"
                              className="btn-stepper plus"
                              onClick={() => {
                                const curr = parseInt(String(activeField.marketPrice || '').replace(/[^0-9]/g, ''), 10) || 65;
                                handleUpdateFieldPrice(curr + 5);
                              }}
                              title="Increase price by ₹5"
                            >
                              + ₹5
                            </button>
                            <button
                              type="button"
                              className="btn-stepper plus boost"
                              onClick={() => {
                                const curr = parseInt(String(activeField.marketPrice || '').replace(/[^0-9]/g, ''), 10) || 65;
                                handleUpdateFieldPrice(curr + 10);
                              }}
                              title="Increase price by ₹10"
                            >
                              + ₹10
                            </button>
                          </div>
                        </div>

                        {/* Custom Price Input & Update Button */}
                        <div className="custom-rate-input-group">
                          <div className="input-with-symbol">
                            <span className="symbol-inr">₹</span>
                            <input
                              type="number"
                              min="5"
                              max="2000"
                              value={customMandiPrice}
                              onChange={(e) => setCustomMandiPrice(e.target.value)}
                              placeholder="Set Rate"
                              className="mandi-number-input"
                            />
                            <span className="symbol-kg">/ kg</span>
                          </div>

                          <button
                            type="button"
                            className="btn-publish-rate"
                            onClick={() => handleUpdateFieldPrice(customMandiPrice)}
                          >
                            Set & Publish Rate
                          </button>
                        </div>
                      </div>

                      <p className="market-note">
                        Wholesale spot rate increases are instantly broadcast to the <strong>Mandi Buyer Marketplace</strong> and reflected in all purchase orders.
                      </p>

                      <button
                        className="btn-market"
                        onClick={() => {
                          const curr = parseInt(String(activeField.marketPrice || '').replace(/[^0-9]/g, ''), 10) || 65;
                          handleUpdateFieldPrice(curr);
                          showToast(`✅ ${activeField.name} is published live in Mandi at ₹${curr}/kg!`);
                        }}
                      >
                        Publish Harvest Lot to Buyer Mandi
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: ALL-SEASON CROP & WEATHER RECOMMENDATIONS */}
          {farmerActiveTab === 'seasons' && (
            <div className="card seasons-matrix-card">
              <div className="card-header-simple">
                <div>
                  <h2>All-Season Agricultural Advisory & Crop Recommendation Matrix</h2>
                  <p className="card-sub-p">
                    Verified agronomist recommendations for Kharif, Rabi, Zaid, and High-Value Perennial crops.
                  </p>
                </div>
              </div>

              <div className="seasons-grid">
                {SEASON_RECOMMENDATIONS.map(s => (
                  <div key={s.id} className="season-card-column">
                    <div className="season-column-header">
                      <h3>{s.season}</h3>
                      <span className="season-period-badge"><Calendar size={13} /> {s.period}</span>
                    </div>

                    <div className="season-info-box">
                      <div><strong>Weather Pattern:</strong> {s.weather}</div>
                      <div><strong>Water Demand:</strong> {s.waterRequirement}</div>
                      <div><strong>Ideal Soil:</strong> {s.idealSoil}</div>
                    </div>

                    <h4 className="best-crops-title">Recommended High-Yield Crops:</h4>
                    <div className="season-crop-list">
                      {s.bestCrops.map((c, i) => (
                        <div key={i} className="season-crop-card">
                          <div className="crop-header-row">
                            <strong>{c.name}</strong>
                            <span className="crop-profit font-mono">{c.profit}</span>
                          </div>
                          <div className="crop-tip">💡 {c.tip}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PESTICIDES & BIO-INPUTS STORE */}
          {farmerActiveTab === 'pesticides' && (
            <div className="card pesticide-store-card">
              <div className="card-header-simple">
                <div>
                  <h2>Farmer's Bio-Pesticide & Crop Protection Store</h2>
                  <p className="card-sub-p">
                    Purchase and apply verified organic bio-pesticides and foliar boosters directly to <strong>{activeField?.name}</strong> to improve crop health scores.
                  </p>
                </div>
              </div>

              <div className="pesticides-grid">
                {PESTICIDE_CATALOG.map(p => (
                  <div key={p.id} className="card pesticide-item-card">
                    <div className="pesticide-top">
                      <span className="pesticide-category">{p.category}</span>
                      <span className="pesticide-badge-green">{p.badge}</span>
                    </div>

                    <h3 className="pesticide-title">{p.name}</h3>
                    <p className="pesticide-target"><strong>Protects Against:</strong> {p.target}</p>

                    <div className="pesticide-pricing-row">
                      <span className="pesticide-price font-mono">₹{p.price}</span>
                      <span className="pesticide-volume">/ {p.volume}</span>
                      <span className="health-boost-pill">+{p.boost}% Health Score</span>
                    </div>

                    <button
                      className="btn-order-pesticide"
                      onClick={() => handleApplyPesticideSpray(p.name)}
                    >
                      <ShieldCheck size={16} /> Buy & Apply to {activeField?.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================== BUYER ORDER MODAL ==================== */}
      {buyingListing && (
        <div className="modal-backdrop" onClick={() => setBuyingListing(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Procure Harvest from {buyingListing.farmerName}</h3>
              <button className="btn-close-modal" onClick={() => setBuyingListing(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="modal-form">
              <div className="order-summary-box">
                <div><strong>Crop:</strong> {buyingListing.crop} ({buyingListing.grade})</div>
                <div><strong>Mandi Rate:</strong> ₹{buyingListing.pricePerKg} / kg</div>
                <div><strong>Location:</strong> {buyingListing.location}</div>
                <div><strong>Dispatch:</strong> {buyingListing.harvestReady}</div>
              </div>

              <div className="form-group">
                <label>Quantity to Purchase (kg) *</label>
                <input
                  type="number"
                  min="50"
                  max="50000"
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(Number(e.target.value))}
                  required
                />
              </div>

              <div className="order-total-calc">
                <span>Total Procurement Cost:</span>
                <span className="total-amount font-mono">
                  ₹{(purchaseQty * buyingListing.pricePerKg).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setBuyingListing(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Confirm & Reserve Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD FIELD MODAL ==================== */}
      {showAddFieldModal && (
        <div className="modal-backdrop" onClick={() => setShowAddFieldModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add a New Field (Saves to MongoDB)</h3>
              <button className="btn-close-modal" onClick={() => setShowAddFieldModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateField} className="modal-form">
              <div className="form-group">
                <label>Field Name / Identifier *</label>
                <input
                  type="text"
                  placeholder="e.g. Field 3: East Ridge, Valley Meadow"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Crop Grown *</label>
                  <select
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    className="select-styled"
                  >
                    <option value="Poblano Pepper">Poblano Pepper (Capsicum)</option>
                    <option value="Winter Wheat">Winter Wheat (Gehun)</option>
                    <option value="Fuji Apples">Fuji Apples (Seb)</option>
                    <option value="Tomato">Tomato (Tamatar)</option>
                    <option value="Basmati Rice">Basmati Rice (Dhan)</option>
                    <option value="Cotton">Cotton (Kapas)</option>
                    <option value="Sugarcane">Sugarcane (Ganna)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Acreage / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 6.5 Acres"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target Mandi Price (₹ / kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 55"
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Initial Soil Moisture ({newMoisture}%)</label>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    value={newMoisture}
                    onChange={(e) => setNewMoisture(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group task-assign-section">
                <label>Initial Task Assignment for Field</label>
                <input
                  type="text"
                  placeholder="e.g. Setup drip line & check nursery seedlings"
                  value={newInitialTask}
                  onChange={(e) => setNewInitialTask(e.target.value)}
                />
                <div className="task-prio-picker">
                  <span>Priority:</span>
                  {['High', 'Normal', 'Urgent'].map(p => (
                    <button
                      key={p}
                      type="button"
                      className={`btn-pill-prio ${newInitialPriority === p ? 'active' : ''}`}
                      onClick={() => setNewInitialPriority(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddFieldModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Field in Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DATABASE STORAGE STATUS MODAL ==================== */}
      {showDbModal && (
        <div className="modal-backdrop" onClick={() => setShowDbModal(false)}>
          <div className="modal-card db-status-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <Database size={22} color="#16a34a" />
                <div>
                  <h3>SmartFarm Database Architecture & Diagnostics</h3>
                  <p className="modal-subtext">Real-time status of Cloud Atlas and Local Persistent engines</p>
                </div>
              </div>
              <button className="btn-close-modal" onClick={() => setShowDbModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="db-modal-content">
              {/* Primary Engine Banner */}
              <div className={`db-engine-card ${dbInfo.atlasConnected ? 'atlas-live' : 'local-active'}`}>
                <div className="db-engine-header">
                  <span className="engine-status-dot"></span>
                  <h4>{dbInfo.atlasConnected ? 'MongoDB Atlas Cloud Cluster (Active)' : 'Local Persistent Storage Engine (Active)'}</h4>
                </div>
                <p className="engine-desc">
                  {dbInfo.atlasConnected
                    ? 'Connected directly to MongoDB Atlas cluster (cluster0.1u5khck.mongodb.net). All changes are written to the cloud in real time!'
                    : 'Outbound TCP port 27017 is blocked on your current Wi-Fi network (campus/hostel router firewall). To prevent data loss or server timeouts, SmartFarm is safely persisting all records into server/data/smartfarm_local_db.json on disk!'}
                </p>
              </div>

              {/* Live Record Counts */}
              {dbInfo.counts && (
                <div className="db-counts-grid">
                  <div className="db-count-box">
                    <span className="count-num">{dbInfo.counts.usersCount ?? 2}</span>
                    <span className="count-label">Registered Users</span>
                  </div>
                  <div className="db-count-box">
                    <span className="count-num">{dbInfo.counts.fieldsCount ?? userFields.length}</span>
                    <span className="count-label">Managed Fields</span>
                  </div>
                  <div className="db-count-box">
                    <span className="count-num">{dbInfo.counts.tasksCount ?? 3}</span>
                    <span className="count-label">Scheduled Tasks</span>
                  </div>
                  <div className="db-count-box">
                    <span className="count-num">{dbInfo.counts.ordersCount ?? buyerOrders.length}</span>
                    <span className="count-label">Mandi Orders</span>
                  </div>
                </div>
              )}

              {/* Instructions on connecting to Atlas */}
              <div className="db-instructions-box">
                <h5>📡 How to connect directly to MongoDB Atlas Cloud:</h5>
                <ol>
                  <li>
                    <strong>Turn ON Mobile Hotspot:</strong> Enable Personal Hotspot on your mobile phone (Jio / Airtel / Vi). Mobile cellular networks do not block port 27017.
                  </li>
                  <li>
                    <strong>Connect Laptop Wi-Fi:</strong> Join your phone's hotspot Wi-Fi on Windows.
                  </li>
                  <li>
                    <strong>Atlas IP Whitelist:</strong> Ensure <code>0.0.0.0/0</code> is added in MongoDB Atlas <em>Network Access</em>.
                  </li>
                  <li>
                    <strong>Sync Data to Cloud:</strong> Run <code>npm run sync:atlas</code> in the <code>server</code> folder to push all local records to MongoDB Atlas!
                  </li>
                </ol>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-submit"
                  onClick={async () => {
                    setShowDbModal(false);
                    showToast('Checking database connection...');
                    try {
                      const data = await api.getHealth();
                      if (data && (data.status === 'HEALTHY' || data.success !== false)) {
                        const dbMeta = data.database || {};
                        const isAtlas = !!dbMeta.atlasConnected;
                        setDbStatus('connected');
                        setDbInfo({
                          status: 'connected',
                          mode: dbMeta.mode || (isAtlas ? 'MONGODB_ATLAS' : 'LOCAL_PERSISTENT_STORE'),
                          label: isAtlas ? 'MongoDB Atlas Live' : (dbMeta.statusLabel || 'MongoDB Connected'),
                          atlasConnected: isAtlas,
                          counts: dbMeta.counts,
                          wifiNotice: dbMeta.wifiNotice
                        });
                        showToast(isAtlas ? '✅ Connected to MongoDB Atlas Cloud!' : 'ℹ️ Running on Local Persistent Engine');
                      } else {
                        setDbStatus('offline');
                        setDbInfo({ status: 'offline', label: 'Backend Offline', atlasConnected: false });
                        showToast('⚠️ Backend server offline');
                      }
                    } catch (e) {
                      showToast('Backend server not responding');
                    }
                  }}
                >
                  Refresh Connection State
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}