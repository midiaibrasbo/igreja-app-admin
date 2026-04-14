import { pgTable, text, serial, timestamp, boolean, decimal, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabela de Usuários
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'),
  name: varchar('name', { length: 255 }).notNull(),
  googleId: varchar('google_id', { length: 255 }).unique(),
  avatar: text('avatar'),
  role: varchar('role', { length: 50 }).default('member'), // admin, treasurer, member
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabela de Membros
export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  birthDate: timestamp('birth_date'),
  baptismDate: timestamp('baptism_date'),
  address: text('address'),
  status: varchar('status', { length: 50 }).default('active'), // active, inactive, visitor
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabela de Eventos
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  eventDate: timestamp('event_date').notNull(),
  location: varchar('location', { length: 255 }),
  eventType: varchar('event_type', { length: 50 }), // culto, reuniao, batismo, casamento, etc
  capacity: serial('capacity'),
  createdBy: serial('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabela de Presença em Eventos
export const eventAttendance = pgTable('event_attendance', {
  id: serial('id').primaryKey(),
  eventId: serial('event_id').references(() => events.id),
  memberId: serial('member_id').references(() => members.id),
  attended: boolean('attended').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabela de Doações
export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  memberId: serial('member_id').references(() => members.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  donationType: varchar('donation_type', { length: 50 }), // dinheiro, alimento, outros
  description: text('description'),
  donationDate: timestamp('donation_date').defaultNow(),
  recordedBy: serial('recorded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  members: many(members),
  eventsCreated: many(events),
  donationsRecorded: many(donations),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  eventAttendance: many(eventAttendance),
  donations: many(donations),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
  attendance: many(eventAttendance),
}));

export const eventAttendanceRelations = relations(eventAttendance, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendance.eventId],
    references: [events.id],
  }),
  member: one(members, {
    fields: [eventAttendance.memberId],
    references: [members.id],
  }),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  member: one(members, {
    fields: [donations.memberId],
    references: [members.id],
  }),
  recordedByUser: one(users, {
    fields: [donations.recordedBy],
    references: [users.id],
  }),
}));
