import { useEffect } from "react";

import cn from "classnames";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { editorConfiguration } from "@lib/ckeditor";

import { queryClient } from "@query/index";

import { uploadDocuments } from "@api/services/documents";
import {
	createHomeworkStudentAnswer,
	CreateHomeworkStudentAnswer,
	CreateHomeworkStudentAnswerSuccessResponse,
	CreateHomeworkStudentAnswerValidationError,
} from "@api/services/homework";
import { UserTypesEnum } from "@features/role-access";

import { DocumentItem } from "../../Material/DocumentItem";

import {
	createHomeworkStudentAnswerFormSchema,
	CreateHomeworkStudentAnswerFields,
} from "@features/user-details";
import { useAuth } from "@features/auth";

import { getListKey } from "@utils/list-key";

import { StudentAnswerCreateFormProps } from "./types";

import Upload from "@assets/vectors/upload.svg?react";

import "./StudentAnswerCreateForm.styles.scss";

function StudentAnswerCreateForm({
	isVisible,
	homeworkId,
}: StudentAnswerCreateFormProps) {
	const { id } = useParams();

	const { user } = useAuth({});

	const { mutate: createHomeworkStudentAnswerMutation } = useMutation<
		CreateHomeworkStudentAnswerSuccessResponse,
		CreateHomeworkStudentAnswerValidationError,
		CreateHomeworkStudentAnswer
	>({
		mutationFn: createHomeworkStudentAnswer,
	});

	const { mutate: uploadDocumentsMutation } = useMutation({
		mutationFn: uploadDocuments,
	});

	const {
		formState: { errors },
		control,
		watch,
		handleSubmit,
		setValue,
		setError,
		getValues,
		reset,
	} = useForm<CreateHomeworkStudentAnswerFields>({
		resolver: zodResolver(createHomeworkStudentAnswerFormSchema),
	});

	useEffect(() => {
		if (isVisible) {
			reset();
		}
	}, [isVisible, reset]);

	useEffect(() => {
		if (homeworkId && isVisible) {
			setValue("homework", homeworkId);
		}
	}, [homeworkId, isVisible, setValue]);

	const documents = watch("documents");

	const uploadDocumentsHandler = (document: File) => {
		uploadDocumentsMutation(
			{
				file: document,
			},
			{
				onSuccess(result) {
					const documents = getValues("documents");

					if (documents) {
						setValue("documents", [...documents, result]);
						return;
					}

					setValue("documents", [result]);
				},
			},
		);
	};

	const removeDocumentsHandler = (documentsToRemove: number[]) => {
		const newFiles = documents?.filter(
			(document) => !documentsToRemove.includes(document.id),
		);
		setValue("documents", newFiles);
	};

	const submitFormHandler = (data: CreateHomeworkStudentAnswerFields) => {
		if (!user || !id) {
			return;
		}

		const isUserTutor = user.type === UserTypesEnum.TUTOR;

		const userId = isUserTutor ? id : user.id.toString();

		createHomeworkStudentAnswerMutation(
			{ answer: data, userId },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey =
								key as keyof CreateHomeworkStudentAnswerValidationError["data"];
							setError(errorKey, { message: errors[errorKey][0] });
						}
					}
				},
				onSuccess() {
					queryClient.invalidateQueries({
						queryKey: ["homework-details"],
					});
					queryClient.invalidateQueries({
						queryKey: ["all-homeworks"],
					});
					queryClient.invalidateQueries({
						queryKey: ["all-projects"],
					});
				},
			},
		);
	};

	return (
		<>
			<span className="popup__view-title">Homework result</span>
			<form onSubmit={handleSubmit(submitFormHandler)} className="main-form">
				<div className="main-form__fields">
					<div className="main-form__col">
						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<CKEditor
									editor={ClassicEditor}
									config={editorConfiguration}
									{...field}
									data={field.value}
									onChange={(_, editor) => {
										field.onChange(editor.getData());
									}}
								/>
							)}
						/>
					</div>

					<div
						className={cn("main-form__col", {
							"main-form__invalid": errors.documents,
						})}
					>
						<span className="main-form__subtitle">Files</span>

						<div className="main-form__file-wrap">
							<input type="file" id="file" className="main-form__hidden" />
							<label htmlFor="document" className="main-form__file-label">
								<input
									id="document"
									style={{ display: "none" }}
									onChange={(event) => {
										if (event.target.files) {
											uploadDocumentsHandler(event.target.files[0]);
										}
									}}
									type="file"
								/>
								<span className="main-form__file-text">
									Attach file, max size 25 mb
								</span>
								<div className="main-form__file-btn">
									Upload file
									<Upload />
								</div>
							</label>
							{errors.documents && (
								<p className="main-form__invalid-text">
									{errors.documents?.message}
								</p>
							)}
						</div>

						{!!documents?.length && (
							<div className="main-form__file-row">
								{documents.map((document) => (
									<DocumentItem
										key={getListKey("document", document.id)}
										document={document}
										onRemoveDocument={removeDocumentsHandler}
									/>
								))}
							</div>
						)}
					</div>

					<div className="popup__footer popup__footer--short">
						<div className="popup__footer-row">
							<div className="popup__footer-col">
								<button type="submit" className="popup__btn btn primary">
									Create answer
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</>
	);
}

export { StudentAnswerCreateForm };
