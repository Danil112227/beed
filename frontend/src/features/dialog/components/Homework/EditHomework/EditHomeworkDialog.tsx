import { useEffect } from "react";

import cn from "classnames";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { editorConfiguration } from "@lib/ckeditor";

import { queryClient } from "@query/index";

import {
	useHomeworksQuery,
	updateHomework,
	UpdateHomework,
	UpdateHomeworkSuccessResponse,
	UpdateHomeworkValidationError,
} from "@api/services/homework";
import { uploadDocuments } from "@api/services/documents";

import {
	CreateHomeworkFields,
	createHomeworkFormSchema,
} from "@features/user-details";
import { DocumentItem } from "../../Material/DocumentItem";

import { getListKey } from "@utils/list-key";

import { EditHomeworkDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Upload from "@assets/vectors/upload.svg?react";

import "./EditHomeworkDialog.styles.scss";

function EditHomeworkDialog({ isVisible, onClose }: EditHomeworkDialogProps) {
	const [searchParams] = useSearchParams();

	const homeworkId = searchParams.get("homework");

	const homeworkDetailsResult = useHomeworksQuery({
		isEnabled: !!homeworkId && isVisible,
		queryType: "homework-details",
		queryKey: ["homework-details", { homeworkId }],
		payload: { id: homeworkId! },
	});

	const { mutate: updateHomeworkMutation } = useMutation<
		UpdateHomeworkSuccessResponse,
		UpdateHomeworkValidationError,
		UpdateHomework
	>({
		mutationFn: updateHomework,
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
	} = useForm<CreateHomeworkFields>({
		resolver: zodResolver(createHomeworkFormSchema),
		values: homeworkDetailsResult && {
			type: homeworkDetailsResult.type,
			deadline: homeworkDetailsResult.deadline,
			description: homeworkDetailsResult.description,
			documents: homeworkDetailsResult.documents,
			lesson: 0,
		},
	});

	useEffect(() => {
		if (isVisible) {
			reset();
		}
	}, [isVisible, reset]);

	useEffect(() => {
		const lessonId = homeworkDetailsResult?.lesson.id;

		if (lessonId && isVisible) {
			setValue("lesson", lessonId);
		}
	}, [homeworkDetailsResult?.lesson.id, isVisible, setValue]);

	const documents = watch("documents");

	if (!homeworkDetailsResult || !homeworkId) {
		return null;
	}

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

	const submitFormHandler = (data: CreateHomeworkFields) => {
		updateHomeworkMutation(
			{ homeworkId, homework: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey =
								key as keyof UpdateHomeworkValidationError["data"];
							setError(errorKey, { message: errors[errorKey][0] });
						}
					}
				},
				onSuccess() {
					onClose();

					queryClient.invalidateQueries({
						queryKey: ["homework-details", { homeworkId }],
					});
					queryClient.invalidateQueries({
						queryKey: ["all-homeworks"],
					});
				},
			},
		);
	};

	return (
		<Dialog
			blockScroll
			modal
			visible={isVisible}
			draggable={false}
			resizable={false}
			onHide={onClose}
			content={({ hide }) => (
				<div className="popup popup--mid">
					<div className="popup__head">
						<span className="popup__title main-title">Edit homework</span>
						<button onClick={hide} className="popup__close">
							<Cross />
						</button>
					</div>

					<div className="popup__scroll">
						<div className="popup__body">
							<form
								onSubmit={handleSubmit(submitFormHandler)}
								className="main-form"
							>
								<div className="main-form__fields">
									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.deadline,
										})}
									>
										<label
											htmlFor="birthday"
											className="main-form__label main-form__required"
										>
											Deadline
										</label>

										<Controller
											name="deadline"
											control={control}
											render={({ field }) => (
												<Calendar
													className="calendar input"
													dateFormat="dd.mm.yy"
													{...field}
												/>
											)}
										/>

										{errors.deadline && (
											<p className="main-form__invalid-text">
												{errors.deadline?.message}
											</p>
										)}
									</div>

									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.description,
										})}
									>
										<label
											htmlFor="birthday"
											className="main-form__label main-form__required"
										>
											Homework description
										</label>

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
										{errors.description && (
											<p className="main-form__invalid-text">
												{errors.description?.message}
											</p>
										)}
									</div>

									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.documents,
										})}
									>
										<span className="main-form__subtitle">Files</span>

										<div className="main-form__file-wrap">
											<input
												type="file"
												id="file"
												className="main-form__hidden"
											/>
											<label
												htmlFor="document"
												className="main-form__file-label"
											>
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
												<button
													onClick={hide}
													className="popup__btn btn secondary"
												>
													Cancel
												</button>
											</div>
											<div className="popup__footer-col">
												<button
													type="submit"
													className="popup__btn btn primary"
												>
													Save changes
												</button>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		/>
	);
}

export { EditHomeworkDialog };
