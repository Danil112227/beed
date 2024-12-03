import { useEffect } from "react";

import cn from "classnames";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useParams, useSearchParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { editorConfiguration } from "@lib/ckeditor";

import { queryClient } from "@query/index";

import {
	updateMaterial,
	UpdateMaterialSuccessResponse,
	UpdateMaterialValidationError,
	UpdateMaterial,
	UpdateLessonMaterialSuccessResponse,
	useMaterialsQuery,
} from "@api/services/materials";
import { uploadDocuments } from "@api/services/documents";

import {
	createMaterialFormSchema,
	CreateMaterialFields,
} from "@features/user-details";

import { DocumentItem } from "../DocumentItem";

import { getListKey } from "@utils/list-key";

import { EditMaterialDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Upload from "@assets/vectors/upload.svg?react";

import "./EditMaterialDialog.styles.scss";

function EditMaterialDialog({
	isVisible,
	isLesson,
	onClose,
}: EditMaterialDialogProps) {
	const { id, lessonId } = useParams();

	const [searchParams] = useSearchParams();

	const materialId = searchParams.get("material");

	const key = isLesson ? "lesson-material-details" : "material-details";

	const materialDetailsResult = useMaterialsQuery({
		isEnabled: !!materialId && isVisible,
		queryType: key,
		queryKey: [key, { materialId }],
		payload: { id: materialId! },
	});

	const { mutate: updateMaterialMutation } = useMutation<
		UpdateMaterialSuccessResponse | UpdateLessonMaterialSuccessResponse,
		UpdateMaterialValidationError,
		UpdateMaterial
	>({
		mutationFn: updateMaterial,
	});

	const { mutate: uploadDocumentsMutation } = useMutation({
		mutationFn: uploadDocuments,
	});

	const {
		formState: { errors },
		watch,
		handleSubmit,
		register,
		setValue,
		setError,
		getValues,
		reset,
		control,
	} = useForm<CreateMaterialFields>({
		resolver: zodResolver(createMaterialFormSchema),
		values: materialDetailsResult && {
			topic: materialDetailsResult.topic,
			description: materialDetailsResult.description,
			documents: materialDetailsResult.documents,
		},
	});

	useEffect(() => {
		if (isVisible) {
			reset();
		}
	}, [isVisible, reset]);

	useEffect(() => {
		if (id && isVisible) {
			setValue("user", +id);
		}
	}, [id, isVisible, setValue]);

	useEffect(() => {
		if (lessonId && isVisible) {
			setValue("lesson", +lessonId);
		}
	}, [lessonId, isVisible, setValue]);

	const documents = watch("documents");

	if (!materialDetailsResult || !materialId) {
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

	const submitFormHandler = (data: CreateMaterialFields) => {
		updateMaterialMutation(
			{ materialId, material: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey =
								key as keyof UpdateMaterialValidationError["data"];
							setError(errorKey, { message: errors[errorKey][0] });
						}
					}
				},
				onSuccess() {
					onClose();

					queryClient.invalidateQueries({
						queryKey: ["material-details", { materialId }],
					});
					queryClient.invalidateQueries({
						queryKey: ["materials"],
					});
					queryClient.invalidateQueries({ queryKey: ["lesson-materials"] });
					queryClient.invalidateQueries({
						queryKey: ["lesson-materials", { materialId }],
					});
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

	return (
		<Dialog
			blockScroll
			modal
			visible={isVisible}
			draggable={false}
			resizable={false}
			onHide={onClose}
			content={({ hide }) => (
				<div className="popup">
					<div className="popup__head">
						<span className="popup__title main-title">Edit material</span>
						<button onClick={hide} className="popup__close">
							<Cross />
						</button>
					</div>

					<div className="popup__body">
						<form
							className="main-form"
							onSubmit={handleSubmit(submitFormHandler)}
						>
							<div className="main-form__scroll">
								<div className="main-form__fields">
									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.topic,
										})}
									>
										<label htmlFor="login" className="main-form__label">
											Title
										</label>
										<input
											type="text"
											{...register("topic")}
											className="main-form__input input"
											placeholder="Fill the name of material"
										/>
										{errors.topic && (
											<p className="main-form__invalid-text">
												{errors.topic?.message}
											</p>
										)}
									</div>
									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.description,
										})}
									>
										<label
											htmlFor="login"
											className="main-form__label main-form__required"
										>
											Description
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
										<span className="main-form__subtitle">Materials</span>

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
												<button type="button" className="main-form__file-btn">
													Upload file
													<Upload />
												</button>
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
							</div>
							<div className="main-form__buttons">
								<button onClick={hide} className="main-form__btn btn secondary">
									Cancel
								</button>
								<button type="submit" className="main-form__btn btn primary">
									Save changes
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		/>
	);
}

export { EditMaterialDialog };
