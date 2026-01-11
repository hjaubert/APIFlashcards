import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from 'crypto';
import { boolean } from "zod";

export const users = sqliteTable('users', {
    id: text().primaryKey().$defaultFn(() => randomUUID()),
    email: text().notNull().unique(),
    firstname: text({length: 30}).notNull(),
    lastname: text({length: 50}).notNull(),
    password: text({length: 255}).notNull(),
    isAdmin: integer({ mode: 'boolean' }).$defaultFn(() => false),
    createdAt: integer('created_at', { mode: 'timestamp'}).$defaultFn(() => new Date())
})

export const collections = sqliteTable('collections', {
    id: text().primaryKey().$defaultFn(() => randomUUID()),
    userId: text('id_user').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    title: text({length: 255}).notNull(),
    description: text({length: 255}),
    isPublic: integer('is_public', { mode: 'boolean' }).notNull()
})

export const flashcards = sqliteTable('flashcards', {
    id: text().primaryKey().$defaultFn(() => randomUUID()),
    collectionId: text('id_collection').references(() => collections.id, {onDelete: 'cascade'}).notNull(),
    front: text({length: 255}).notNull(),
    back: text({length: 255}).notNull(),
    frontUrl: text('front_url', {length: 255}),
    backUrl: text('back_url', {length: 255}),
    createdAt: integer('created_at', { mode: 'timestamp'}).$defaultFn(() => new Date())
})

export const revisions = sqliteTable('revisions', {
    id: text().primaryKey().$defaultFn(() => randomUUID()),
    flashcardId: text('id_flashcard').references(() => flashcards.id, {onDelete: 'cascade'}).notNull(),
    userId: text('id_user').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    level: integer().notNull(),
    lastRevision: integer('last_revision', { mode: 'timestamp' }).$default(() => new Date()),
    nextRevision: integer('next_revision', { mode: 'timestamp' }).notNull()
})