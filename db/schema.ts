import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const propertyViews=sqliteTable('property_views',{filename:text('filename').primaryKey(),views:integer('views').notNull().default(0),lastViewedAt:text('last_viewed_at').notNull()});
export const viewEvents=sqliteTable('property_view_events',{id:text('id').primaryKey(),expires:integer('expires').notNull()});
