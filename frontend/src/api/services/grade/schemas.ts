import { z } from "zod";

import { paginationSchema } from "@api/schemas";
import { userSchema } from "../users";
import { schoolSchema } from "../schools";

//TODO: check short schema
const disciplineShortSchema = z.object({
	id: z.number(),
	name: z.string(),
});

const schoolShortSchema = z.object({
	id: z.number(),
	name: z.string(),
});

const gradeShortSchema = z.object({
	id: z.number(),
	name: z.string(),
	school: schoolShortSchema,
	year: z.number(),
});

export const disciplineExtendSchema = z.object({
	id: z.number(),
	name: z.string(),
	teacher: userSchema
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
			grades: z.array(gradeShortSchema),
		}),
	description: z.string(),
	default_link: z.string(),
});

export const gradeSchema = z.object({
	id: z.number(),
	name: z.string(),
	school: schoolSchema.omit({ can_delete: true, can_edit: true }),
	year: z.number(),
	description: z.string(),
	tutor: z.array(
		userSchema
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
				grades: z.array(gradeShortSchema),
			}),
	),
	users: z.array(
		userSchema
			.pick({
				id: true,
				first_name: true,
				last_name: true,
				Patronymic: true,
				username: true,
				type: true,
				can_delete: true,
				can_edit: true,
			})
			.extend({
				disciplines: z.array(disciplineShortSchema),
				grades: z.array(gradeShortSchema),
			}),
	),
	disciplines: z.array(disciplineExtendSchema),
	can_create_discipline: z.boolean(),
	can_delete: z.boolean(),
	can_delete_discipline: z.boolean(),
	can_edit: z.boolean(),
	can_edit_student_list: z.boolean(),
	can_edit_timetable_template: z.boolean(),
	can_view_user_list: z.boolean()
});

export const gradesListSuccessResponseSchema = z
	.object({
		results: z.array(gradeSchema),
	})
	.extend(paginationSchema.shape);

export const deleteGradeSuccessResponseSchema = z.string();

export const gradeDetailsSuccessResponseSchema = gradeSchema;

export const createGradeSuccessResponseSchema = gradeSchema
	.pick({
		id: true,
		name: true,
		year: true,
		description: true,
	})
	.extend({
		school: z.number(),
		tutor: z.array(z.number()),
		users: z.array(z.number()),
	});

export const updateGradeSuccessResponseSchema = gradeSchema
	.pick({
		id: true,
		name: true,
		year: true,
		description: true,
	})
	.extend({
		school: z.number(),
		tutor: z.array(z.number()),
		users: z.array(z.number()),
	});

export const addGradeStudentsSuccessResponseSchema = gradeSchema
	.pick({
		id: true,
		name: true,
		year: true,
		description: true,
	})
	.extend({
		school: z.number(),
		tutor: z.array(z.number()),
		users: z.array(z.number()),
	});

export const removeGradeStudentsSuccessResponseSchema = gradeSchema
	.pick({
		id: true,
		name: true,
		year: true,
		description: true,
	})
	.extend({
		school: z.number(),
		tutor: z.array(z.number()),
		users: z.array(z.number()),
	});
