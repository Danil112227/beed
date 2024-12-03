import { useEffect } from "react";

import cn from "classnames";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog } from "primereact/dialog";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { editorConfiguration } from "@lib/ckeditor";

import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";

import { queryClient } from "@query/index";

import {
	createHomework,
	CreateHomework,
	CreateHomeworkSuccessResponse,
	CreateHomeworkValidationError,
} from "@api/services/homework";
import { useLessonQuery } from "@api/services/timetable";
import { uploadDocuments } from "@api/services/documents";

import {
	CreateHomeworkFields,
	createHomeworkFormSchema,
} from "@features/user-details";
import { getSelectFormattedHomeworkType } from "@features/select";
import { DocumentItem } from "../../Material/DocumentItem";

import { getListKey } from "@utils/list-key";

import { AddHomeworkDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Upload from "@assets/vectors/upload.svg?react";

import "./AddHomeworkDialog.styles.scss";

function AddHomeworkDialog({ isVisible, onClose }: AddHomeworkDialogProps) {
	const { lessonId } = useParams();

	const lessonDetailsResult = useLessonQuery({
		isEnabled: !!lessonId && isVisible,
		queryType: "lesson-details",
		queryKey: ["lesson-details", { lessonId }],
		payload: { id: lessonId! },
	});

	const { mutate: createHomeworkMutation } = useMutation<
		CreateHomeworkSuccessResponse,
		CreateHomeworkValidationError,
		CreateHomework
	>({
		mutationFn: createHomework,
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
	});

	useEffect(() => {
		if (isVisible) {
			reset();
		}
	}, [reset, isVisible]);

	useEffect(() => {
		if (lessonDetailsResult && isVisible) {
			setValue("lesson", lessonDetailsResult.id);
		}
	}, [setValue, lessonDetailsResult, isVisible]);

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

	const submitFormHandler = (data: CreateHomeworkFields) => {
		createHomeworkMutation(
			{ homework: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey =
								key as keyof CreateHomeworkValidationError["data"];
							setError(errorKey, { message: errors[errorKey][0] });
						}
					}
				},
				onSuccess() {
					onClose();
					queryClient.invalidateQueries({
						queryKey: ["homework-details"],
					});
					queryClient.invalidateQueries({
						queryKey: ["all-homeworks"],
					});
				},
			},
		);
	};

	const selectFormattedHomeworkTypeOptions = getSelectFormattedHomeworkType();

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
						<span className="popup__title main-title">Add homework</span>
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
											"main-form__invalid": errors.type,
										})}
									>
										<label
											htmlFor="type"
											className="main-form__label main-form__required"
										>
											Type
										</label>

										<Controller
											name="type"
											control={control}
											render={({ field }) => (
												<Dropdown
													className="select"
													optionValue="value"
													optionLabel="label"
													options={selectFormattedHomeworkTypeOptions}
													{...field}
												/>
											)}
										/>

										{errors.type && (
											<p className="main-form__invalid-text">
												{errors.type?.message}
											</p>
										)}
									</div>
									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.deadline,
										})}
									>
										<label
											htmlFor="deadline"
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
													ref={field.ref}
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
										<label htmlFor="birthday" className="main-form__label main-form__required">
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
											<button type="submit" className="popup__btn btn primary">
												Add homework
											</button>
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

export { AddHomeworkDialog };
