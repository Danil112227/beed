import { z } from "zod";

import { paginationSchema } from "@api/schemas";
import { userSchema } from "../users";

const disciplineShortSchema = z.object({
	id: z.number(),
	name: z.string(),
});

const disciplineTeacherSchema = userSchema
	.pick({
		id: true,
		first_name: true,
		last_name: true,
		Patronymic: true,
		username: true,
		type: true,
	})
	.extend({
		disciplines: z.array(disciplineShortSchema),
	});

const disciplineSchema = z.object({
	id: z.number(),
	name: z.string(),
	teacher: disciplineTeacherSchema,
	description: z.string(),
	default_link: z.string(),
});

const schoolSchema = z.object({
	id: z.number(),
	name: z.string(),
});

const gradeSchema = z.object({
	id: z.number(),
	name: z.string(),
	school: schoolSchema,
	year: z.number(),
});

const studentSchema = userSchema
	.pick({
		id: true,
		first_name: true,
		last_name: true,
		Patronymic: true,
		username: true,
		type: true,
	})
	.extend({ grades: z.array(gradeSchema) });

export const masterLessonSchema = z.object({
	id: z.number(),
	title: z.string(),
	lesson_link: z.string(),
	grade: z.number(),
	discipline: disciplineSchema,
	period: z.number(),
	day_of_week: z.string(),
	start_time: z.string(),
	duration: z.number(),
	students: z.array(studentSchema),
});

export const lessonSchema = z.object({
	id: z.number(),
	title: z.string(),
	lesson_link: z.string(),
	grade: gradeSchema,
	discipline: disciplineSchema,
	lesson_template: masterLessonSchema.nullable(),
	start_time: z.string().datetime(),
	end_time: z.string().datetime(),
	students: z.array(studentSchema),
	description: z.string(),
	temp_teacher: disciplineTeacherSchema.nullable(),
	can_delete: z.boolean(),
	can_edit: z.boolean(),
	can_edit_student_list: z.boolean(),
});

export const lessonListSuccessResponseSchema = z
	.object({
		results: z.array(
			lessonSchema.omit({
				can_delete: true,
				can_edit: true,
				can_edit_student_list: true,
			}),
		),
	})
	.extend(paginationSchema.shape);

export const updateLessonStudentListSuccessResponseSchema = lessonSchema
	.pick({
		id: true,
		title: true,
		lesson_link: true,
		start_time: true,
		end_time: true,
		description: true,
	})
	.extend({
		grade: z.number(),
		discipline: z.number(),
		students: z.array(z.number()),
	});

export const updateLessonSuccessResponseSchema = lessonSchema
	.pick({
		id: true,
		title: true,
		lesson_link: true,
		start_time: true,
		end_time: true,
		description: true,
	})
	.extend({
		grade: z.number(),
		discipline: z.number(),
		students: z.array(z.number()),
	});

export const periodSchema = z.object({
	id: z.number(),
	grade: gradeSchema,
	end_date: z.string().date(),
	start_date: z.string().date(),
});

export const lessonDetailsSuccessResponseSchema = lessonSchema;

export const deleteLessonSuccessResponseSchema = z.string();

export const periodListSuccessResponseSchema = z
	.object({
		results: z.array(periodSchema),
	})
	.extend(paginationSchema.shape);

export const createPeriodSuccessResponseSchema = periodSchema
	.pick({
		id: true,
		end_date: true,
		start_date: true,
	})
	.extend({ grade: z.number() });

export const createMasterLessonSuccessResponseSchema = masterLessonSchema
	.pick({
		id: true,
		title: true,
		lesson_link: true,
		grade: true,
		period: true,
		day_of_week: true,
		start_time: true,
		duration: true,
	})
	.extend({ discipline: z.number(), students: z.array(z.number()) });

export const masterLessonListSuccessResponseSchema = z
	.object({
		results: z.array(masterLessonSchema),
	})
	.extend(paginationSchema.shape);

export const masterLessonDetailsSuccessResponseSchema = masterLessonSchema;

export const updateMasterLessonSuccessResponseSchema = masterLessonSchema
	.pick({
		id: true,
		title: true,
		lesson_link: true,
		grade: true,
		period: true,
		day_of_week: true,
		start_time: true,
		duration: true,
	})
	.extend({ discipline: z.number(), students: z.array(z.number()) });

export const deleteMasterLessonSuccessResponseSchema = z.string();
