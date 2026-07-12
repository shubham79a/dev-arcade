import { db } from "@/config/db";
import { CompletedExerciseTable, CourseChaptersTable, CourseTable, EnrolledCourseTable, ExerciseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseid');
    const user = await currentUser();

    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail && courseId === 'enrolled') {
        return NextResponse.json({ error: "User not authenticated" });
    }

    if (courseId && courseId !== 'enrolled') {
        const courseIdNum = Number(courseId);

        const result = await db.select().from(CourseTable).where(eq(CourseTable.id, courseIdNum));

        const chapterResult = await db.select().from(CourseChaptersTable)
            .where(eq(CourseChaptersTable.courseId, courseIdNum))
            .orderBy(asc(CourseChaptersTable.orderIndex));

        // Fetch all exercises for this course
        const exercises = await db.select({
            id: ExerciseTable.id,
            chapterId: ExerciseTable.chapterId,
            name: ExerciseTable.name,
            slug: ExerciseTable.slug,
            xp: ExerciseTable.xp,
            difficulty: ExerciseTable.difficulty,
            orderIndex: ExerciseTable.orderIndex,
        }).from(ExerciseTable)
        .where(eq(ExerciseTable.courseId, courseIdNum))
        .orderBy(asc(ExerciseTable.orderIndex));

        // Attach exercises to their chapters
        const chaptersWithExercises = chapterResult.map(ch => ({
            ...ch,
            exercises: exercises.filter(ex => ex.chapterId === ch.id),
        }));

        const enrolledCourse = await db.select().from(EnrolledCourseTable).where(and(eq(EnrolledCourseTable.courseId, courseIdNum), (eq(EnrolledCourseTable.userId, user?.primaryEmailAddress?.emailAddress ?? '')))
        )

        const isEnrolledCourse = enrolledCourse.length > 0 ? true : false;

        const completedExercises = await db.select().from(CompletedExerciseTable).where(and(eq(CompletedExerciseTable.courseId, courseIdNum), eq(CompletedExerciseTable.userId, user?.primaryEmailAddress?.emailAddress ?? '')))
            .orderBy(desc(CompletedExerciseTable.courseId), desc(CompletedExerciseTable.exerciseId));

        return NextResponse.json(
            {
                ...result[0],
                chapters: chaptersWithExercises,
                userEnrolled: isEnrolledCourse,
                courseEnrolledInfo: enrolledCourse[0],
                completedExercises: completedExercises
            }
        );
    }
    else if (courseId == 'enrolled') {
        // Get User Enrolled Courses Only

        // 1️⃣ Fetch all enrolled courses for the user
        const enrolledCourses = await db
            .select()
            .from(EnrolledCourseTable)
            .where(eq(EnrolledCourseTable.userId, userEmail!));

        if (enrolledCourses.length === 0) {
            return NextResponse.json([]);
        }

        // Extract courseIds
        const courseIds = enrolledCourses.map(c => c.courseId);

        // 2️⃣ Fetch all course details in one go
        const courses = await db
            .select()
            .from(CourseTable)
            .where(inArray(CourseTable.id, courseIds));

        // 3️⃣ Fetch chapters for all courses
        const chapters = await db
            .select()
            .from(CourseChaptersTable)
            .where(inArray(CourseChaptersTable.courseId, courseIds))
            .orderBy(asc(CourseChaptersTable.orderIndex));

        // 4️⃣ Fetch all exercises for enrolled courses
        const allExercises = await db
            .select({
                id: ExerciseTable.id,
                courseId: ExerciseTable.courseId,
                chapterId: ExerciseTable.chapterId,
                name: ExerciseTable.name,
                slug: ExerciseTable.slug,
                xp: ExerciseTable.xp,
                difficulty: ExerciseTable.difficulty,
                orderIndex: ExerciseTable.orderIndex,
            })
            .from(ExerciseTable)
            .where(inArray(ExerciseTable.courseId, courseIds))
            .orderBy(asc(ExerciseTable.orderIndex));

        // 5️⃣ Fetch completed exercises for all courses
        const completed = await db
            .select()
            .from(CompletedExerciseTable)
            .where(and(inArray(CompletedExerciseTable.courseId, courseIds), eq(CompletedExerciseTable.userId, userEmail!)))
            .orderBy(
                desc(CompletedExerciseTable.courseId),
                desc(CompletedExerciseTable.exerciseId)
            );

        const finalResult = courses.map(course => {
            const courseEnrollInfo = enrolledCourses.find(e => e.courseId === course.id);

            return {
                ...course,
                chapters: chapters.filter(ch => ch.courseId === course.id),
                completedExercises: completed.filter(cx => cx.courseId === course.id),
                courseEnrolledInfo: courseEnrollInfo,
                userEnrolled: true
            };
        });

        // ⭐ Format output
        const formattedResult = finalResult.map(item => {
            // Count total exercises from ExerciseTable
            const totalExercises = allExercises.filter(ex => ex.courseId === item.id).length;

            const completedExercises = item.completedExercises.length;

            return {
                courseId: item.id,
                title: item.title,
                bannerImage: item?.bannerImage,
                totalExercises,
                completedExercises,
                xpEarned: item.courseEnrolledInfo?.xpEarned || 0,
                level: item.level
            };
        });

        return NextResponse.json(formattedResult);
    }
    else {
        // fetch all courses at once
        const result = (await db.select().from(CourseTable));
        return NextResponse.json({ result });
    }
}
