/**
 * In-Memory User Store
 * Replace with MongoDB/PostgreSQL in production using the commented Mongoose schema below
 */

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// In-memory storage (resets on server restart)
const users = new Map();
const sessions = new Map();

// ── User methods ──
const UserStore = {
  async create({ name, email, phone, password, googleId, avatar }) {
    const id = uuidv4();
    const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

    const user = {
      id,
      name,
      email: email?.toLowerCase() || null,
      phone: phone || null,
      password: hashedPassword,
      googleId: googleId || null,
      avatar: avatar || null,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        currency: 'USD',
        notifications: { email: true, sms: !!phone, push: false },
        theme: 'dark',
      },
      savedSearches: [],
      bookingHistory: [],
    };

    users.set(id, user);
    return user;
  },

  async findById(id) {
    return users.get(id) || null;
  },

  async findByEmail(email) {
    if (!email) return null;
    const lower = email.toLowerCase();
    for (const user of users.values()) {
      if (user.email === lower) return user;
    }
    return null;
  },

  async findByPhone(phone) {
    if (!phone) return null;
    for (const user of users.values()) {
      if (user.phone === phone) return user;
    }
    return null;
  },

  async findByGoogleId(googleId) {
    for (const user of users.values()) {
      if (user.googleId === googleId) return user;
    }
    return null;
  },

  async verifyPassword(user, password) {
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
  },

  async update(id, updates) {
    const user = users.get(id);
    if (!user) return null;
    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    users.set(id, updated);
    return updated;
  },

  async delete(id) {
    return users.delete(id);
  },

  sanitize(user) {
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  },

  count() {
    return users.size;
  },
};

module.exports = UserStore;

/* ─────────────────────────────────────────────────────
   MongoDB / Mongoose Schema (for production use):

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, lowercase: true, sparse: true, unique: true },
  phone: { type: String, sparse: true, unique: true },
  password: { type: String, minlength: 6 },
  googleId: { type: String, sparse: true, unique: true },
  avatar: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferences: {
    currency: { type: String, default: 'USD' },
    notifications: { email: Boolean, sms: Boolean, push: Boolean },
    theme: { type: String, default: 'dark' },
  },
  savedSearches: [{ type: mongoose.Schema.Types.Mixed }],
  bookingHistory: [{ type: mongoose.Schema.Types.Mixed }],
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
───────────────────────────────────────────────────── */
