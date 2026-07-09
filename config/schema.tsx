import { boolean, integer, json, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    points: integer().default(0),
    subscription: varchar()
});

export const CourseTable = pgTable("courses", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar().notNull(),
    desc: varchar().notNull(),
    bannerImage: varchar().notNull(),
    level: varchar().default('Beginner'),
    tags: varchar(),
    editorType: varchar().default('static')
})

export const CourseChaptersTable = pgTable("courseChapters", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().notNull().references(() => CourseTable.id),
    orderIndex: integer().notNull().default(0),
    name: varchar().notNull(),
    desc: varchar(),
})

export const ExerciseTable = pgTable('exercise', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().notNull().references(() => CourseTable.id),
    chapterId: integer().notNull().references(() => CourseChaptersTable.id),
    slug: varchar().notNull().unique(),
    name: varchar().notNull(),
    xp: integer().notNull().default(10),
    difficulty: varchar().notNull().default('easy'),
    hintXpPenalty: integer().default(0),
    orderIndex: integer().notNull().default(0),
    content: text(),
    task: text(),
    hint: text(),
    starterCode: json(),
    validationRegex: varchar(),
    expectedOutput: text(),
})

export const EnrolledCourseTable = pgTable('enrollCourse', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().notNull().references(() => CourseTable.id),
    userId: varchar().notNull(),
    enrolledDate: timestamp().defaultNow(),
    xpEarned: integer().default(0)
})

export const CompletedExerciseTable = pgTable('completeExercise', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().notNull().references(() => CourseTable.id),
    chapterId: integer().notNull().references(() => CourseChaptersTable.id),
    exerciseId: integer().notNull().references(() => ExerciseTable.id),
    userId: varchar().notNull(),
    completedDate: timestamp().defaultNow(),
    usedHint: boolean().default(false),
    xpAwarded: integer().default(0),
})
