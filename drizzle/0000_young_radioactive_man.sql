CREATE TABLE `property_views` (
	`filename` text PRIMARY KEY NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`last_viewed_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `property_view_events` (
	`id` text PRIMARY KEY NOT NULL,
	`expires` integer NOT NULL
);
