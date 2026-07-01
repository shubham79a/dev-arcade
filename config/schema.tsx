import { integer, json, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    points: integer().default(0),
    subscription: varchar()
});

export const CourseTable = pgTable("courses", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().notNull().unique(),
    title: varchar().notNull(),
    desc: varchar().notNull(),
    bannerImage: varchar().notNull(),
    level: varchar().default('Beginner'),
    tags: varchar(),
    editorType: varchar().default('static')
})

export const CourseChaptersTable = pgTable("courseChapters", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    chapterId: integer(),
    courseId: integer().notNull(),
    name: varchar(),
    desc: varchar(),
    exercises: json(),
})

export const EnrolledCourseTable = pgTable('enrollCourse', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().notNull(),
    userId: varchar().notNull(),
    enrolledDate: timestamp().defaultNow(),
    xpEarned: integer().default(0)
})

export const CompletedExerciseTable = pgTable('completeExercise', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().notNull(),
    chapterId: integer().notNull(),
    exerciseId: integer().notNull(),
    userId: varchar().notNull(),
    completedDate: timestamp().defaultNow(),
})

export const ExerciseTable = pgTable('exercise', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().notNull(),
    chapterId: integer().notNull(),
    exerciseId: varchar(),
    exercisesContent: json(),
    exerciseName: varchar()
})
