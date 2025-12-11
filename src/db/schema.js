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
    userId: text('id_user').references(() => users.id).notNull(),
    title: text({length: 255}).notNull(),
    description: text({length: 255}),
    public: integer({ mode: 'boolean' }).notNull()
})

export const flashcards = sqliteTable('flashcards', {
    id: text().primaryKey().$defaultFn(() => randomUUID()),
    collectionId: text('id_collection').references(() => collections.id).notNull(),
    front: text({length: 255}).notNull(),
    back: text({length: 255}).notNull(),
    frontUrl: text('front_url', {length: 255}),
    back_url: text('back_url', {length: 255})
})

export const revisions = sqliteTable('revisions', {
    id: text().primaryKey().$defaultFn(() => randomUUID()),
    flashcardId: text('id_flashcard').references(() => flashcards.id).notNull(),
    userId: text('id_user').references(() => users.id).notNull(),
    level: integer().notNull(),
    lastRevision: integer('last_revision', { mode: 'timestamp' }).$default(() => new Date()).notNull(),
    nextRevision: integer('next_revision', { mode: 'timestamp' }).notNull()
})