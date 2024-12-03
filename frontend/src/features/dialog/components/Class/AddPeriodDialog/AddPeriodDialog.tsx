import { useEffect } from "react";

import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import cn from "classnames";

import { queryClient } from "@query/index";

import { useGradesQuery } from "@api/services/grade";
import {
	createPeriod,
	CreatePeriod,
	CreatePeriodSuccessResponse,
	CreatePeriodValidationError,
} from "@api/services/timetable";

import { addPeriodFormSchema } from "./schemas";

import { AddPeriodDialogProps, AddPeriodFields } from "./types";

import Cross from "@assets/vectors/cross.svg?react";

import "./AddPeriodDialog.styles.scss";

function AddPeriodDialog({
	gradeId,
	isVisible,
	onClose,
}: AddPeriodDialogProps) {
	const { mutate: addPeriodMutation } = useMutation<
		CreatePeriodSuccessResponse,
		CreatePeriodValidationError,
		CreatePeriod
	>({
		mutationFn: createPeriod,
	});

	const {
		formState: { errors },
		handleSubmit,
		setError,
		reset,
		setValue,
		control,
	} = useForm<AddPeriodFields>({
		resolver: zodResolver(addPeriodFormSchema),
	});

	const gradeDetailsResult = useGradesQuery({
		isEnabled: !!gradeId && isVisible,
		queryType: "grade-details",
		queryKey: ["grade-details", { gradeId }],
		payload: { id: gradeId! },
	});

	useEffect(() => {
		if (isVisible) {
			reset();
		}
	}, [isVisible, reset]);

	useEffect(() => {
		if (gradeDetailsResult && isVisible) {
			setValue("grade", gradeDetailsResult.id);
		}
	}, [setValue, gradeDetailsResult, isVisible]);

	const submitFormHandler = (data: AddPeriodFields) => {
		if (!gradeDetailsResult?.id) {
			return;
		}
		addPeriodMutation(
			{ period: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey = key as keyof CreatePeriodValidationError["data"];
							setError(errorKey as keyof AddPeriodFields, {
								message: errors[errorKey][0],
							});
						}
					}
				},
				onSuccess() {
					queryClient.invalidateQueries({ queryKey: ["periods"] });
					onClose();
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
				<div className="popup">
					<div className="popup__head">
						<span className="popup__title main-title">Add period</span>
						<button onClick={hide} className="popup__close">
							<Cross />
						</button>
					</div>

					<div className="popup__body">
						<form
							className="main-form"
							onSubmit={handleSubmit(submitFormHandler)}
						>
							<div
								className={cn("main-form__col", {
									"main-form__invalid": errors.periodDates,
								})}
							>
								<label
									htmlFor="user_timezone"
									className="main-form__label main-form__required"
								>
									Duration of the period
								</label>

								<Controller
									name="periodDates"
									control={control}
									render={({ field }) => (
										<Calendar
											className="calendar input"
											dateFormat="dd.mm.yy"
											selectionMode="range"
											readOnlyInput
											hideOnRangeSelection
											{...field}
											onChange={(event) => {
												field.onChange(event);
											}}
										/>
									)}
								/>
								{errors.periodDates && (
									<p className="main-form__invalid-text">
										{errors.periodDates?.message}
									</p>
								)}
							</div>

							<div className="main-form__buttons">
								<button onClick={hide} className="main-form__btn btn secondary">
									Cancel
								</button>
								<button type="submit" className="main-form__btn btn primary">
									Add period
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		/>
	);
}

export { AddPeriodDialog };
