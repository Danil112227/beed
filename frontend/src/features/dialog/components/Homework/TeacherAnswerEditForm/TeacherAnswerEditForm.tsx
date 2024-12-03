import { useEffect } from "react";

import cn from "classnames";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectPicker } from "rsuite";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { editorConfiguration } from "@lib/ckeditor";

import { queryClient } from "@query/index";

import { uploadDocuments } from "@api/services/documents";
import {
	updateHomeworkTeacherAnswer,
	UpdateHomeworkTeacherAnswer,
	UpdateHomeworkTeacherAnswerSuccessResponse,
	UpdateHomeworkTeacherAnswerValidationError,
} from "@api/services/homework";

import { getSelectFormattedHomeworkStatus } from "@features/select";

import { DocumentItem } from "../../Material/DocumentItem";

import {
	createHomeworkTeacherAnswerFormSchema,
	CreateHomeworkTeacherAnswerFields,
} from "@features/user-details";

import { getListKey } from "@utils/list-key";

import { TeacherAnswerEditFormProps } from "./types";

import Upload from "@assets/vectors/upload.svg?react";

import "./TeacherAnswerEditForm.styles.scss";

function TeacherAnswerEditForm({
	isVisible,
	teacherAnswer,
	onClose,
}: TeacherAnswerEditFormProps) {
	const { description, documents: answerDocuments, answer, id } = teacherAnswer;
	const { status, id: studentAnswerId } = answer;

	const { mutate: updateHomeworkTeacherAnswerMutation } = useMutation<
		UpdateHomeworkTeacherAnswerSuccessResponse,
		UpdateHomeworkTeacherAnswerValidationError,
		UpdateHomeworkTeacherAnswer
	>({
		mutationFn: updateHomeworkTeacherAnswer,
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
	} = useForm<CreateHomeworkTeacherAnswerFields>({
		resolver: zodResolver(createHomeworkTeacherAnswerFormSchema),
		values: {
			answer: studentAnswerId,
			description,
			documents: answerDocuments,
			status,
		},
	});

	useEffect(() => {
		if (isVisible) {
			reset();
		}
	}, [isVisible, reset]);

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

	const submitFormHandler = (data: CreateHomeworkTeacherAnswerFields) => {
		updateHomeworkTeacherAnswerMutation(
			{ answerId: id.toString(), answer: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey =
								key as keyof UpdateHomeworkTeacherAnswerValidationError["data"];
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
					onClose();
				},
			},
		);
	};

	const selectFormattedHomeworkStatusOptions =
		getSelectFormattedHomeworkStatus();

	return (
		<form onSubmit={handleSubmit(submitFormHandler)} className="main-form">
			<div className="main-form__fields">
				<div className="main-form__col">
					<label
						htmlFor="first_name"
						className="main-form__label"
					>
						Status
					</label>
					<Controller
						name="status"
						control={control}
						render={({ field }) => (
							<SelectPicker
								className="select"
								{...field}
								cleanable={false}
								searchable={false}
								data={selectFormattedHomeworkStatusOptions}
							/>
						)}
					/>
				</div>

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
							<button onClick={onClose} className="popup__btn btn secondary">
								Cancel
							</button>
						</div>
						<div className="popup__footer-col">
							<button type="submit" className="popup__btn btn primary">
								Save review
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
}

export { TeacherAnswerEditForm };
