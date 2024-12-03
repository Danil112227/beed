import { useMemo, useState, useEffect } from "react";

import Swiper from "swiper";
import { getDate, getMonth, format } from "date-fns";
import { useParams } from "react-router-dom";

import { useHomeworksQuery, Homework } from "@api/services/homework";

import {
	useDialog,
	ViewHomeworkDialog,
	EditHomeworkDialog,
	DeleteHomeworkDialog,
} from "@features/dialog";

import { HomeworkColumn } from "../HomeworkColumn";

import { getListKey } from "@utils/list-key";
import { Nullable } from "@utils/types";

import { HomeworkTabProps } from "./types";

import Prev from "@assets/vectors/arrow-prev.svg?react";
import Next from "@assets/vectors/arrow-next.svg?react";
// import Comm from "@assets/vectors/comm.svg?react";

import "./HomeworkTab.styles.scss";

function HomeworkTab({ externalUserId }: HomeworkTabProps) {
	const { id } = useParams();

	const [activeSlideIndex, setActiveSlideIndex] =
		useState<Nullable<number>>(null);

	const {
		isVisible: isViewHomeworkDialogVisible,
		onOpenDialog: onOpenViewHomeworkDialog,
		onCloseDialog: onCloseViewHomeworkDialog,
	} = useDialog();

	const {
		isVisible: isEditHomeworkDialogVisible,
		onOpenDialog: onOpenEditHomeworkDialog,
		onCloseDialog: onCloseEditHomeworkDialog,
	} = useDialog();

	const {
		isVisible: isDeleteHomeworkDialogVisible,
		onOpenDialog: onOpenDeleteHomeworkDialog,
		onCloseDialog: onCloseDeleteHomeworkDialog,
	} = useDialog();

	const homeworksResult = useHomeworksQuery({
		isEnabled: !!id || !!externalUserId,
		queryType: "homework",
		queryKey: [
			"all-homeworks",
			{ filter: "homework", user: id || externalUserId },
		],
		searchParams: {
			limit: 10000,
			filter: "homework",
			user: id || externalUserId,
		},
	});

	useEffect(() => {
		const swiperContainer = document.querySelector("swiper-container");

		const slideChangeHandler = (swiper: Event) => {
			const [swiperInstance] = (swiper as CustomEvent<[swiper: Swiper]>).detail;

			const activeIndex = swiperInstance.activeIndex;

			setActiveSlideIndex(activeIndex);
		};

		if (swiperContainer && homeworksResult) {
			swiperContainer.addEventListener("swiperslidechange", slideChangeHandler);
		}

		return () => {
			if (swiperContainer && homeworksResult) {
				swiperContainer.removeEventListener("slidechange", slideChangeHandler);
			}
		};
	}, [homeworksResult]);

	const groupedHomeworksByDates: Record<string, Homework[]> = useMemo(() => {
		if (!homeworksResult?.results) {
			return {};
		}

		return homeworksResult.results.reduce((prev, homework) => {
			const deadlineDate = format(homework.deadline, "yyyy-MM-dd");

			if (deadlineDate in prev) {
				prev[deadlineDate].push(homework);
				return prev;
			}

			prev[deadlineDate] = [homework];

			return prev;
		}, {} as Record<string, Homework[]>);
	}, [homeworksResult?.results]);

	const sortedHomeworkEntries = useMemo(
		() =>
			Object.entries(groupedHomeworksByDates).sort((a, b) => {
				const date1 = new Date(a[0]);
				const date2 = new Date(b[0]);

				return date1.getTime() - date2.getTime();
			}),
		[groupedHomeworksByDates],
	);

	const currentDate = new Date(format(new Date(), "yyyy-MM-dd"));
	const foundColunmIndex = sortedHomeworkEntries.findIndex(([columnDate]) => {
		const formattedColumnDate = new Date(columnDate);

		return formattedColumnDate >= currentDate;
	});

	const homeworkDatesSlice = useMemo(() => {
		const startIndex = activeSlideIndex ?? foundColunmIndex;
		return sortedHomeworkEntries.slice(startIndex, startIndex + 3);
	}, [sortedHomeworkEntries, activeSlideIndex, foundColunmIndex]);

	const formattedDatesRange = useMemo(() => {
		if (!homeworkDatesSlice.length) {
			return "";
		}

		if (homeworkDatesSlice.length < 2) {
			const date = new Date(homeworkDatesSlice[0][0]);

			return `${getDate(date)} ${format(date, "MMMM")}`;
		}

		const firstDate = new Date(homeworkDatesSlice[0][0]);
		const firstDateMonth = getMonth(firstDate);
		const lastDate = new Date(
			homeworkDatesSlice[homeworkDatesSlice.length - 1][0],
		);
		const lastDateMonth = getMonth(lastDate);

		if (firstDateMonth === lastDateMonth) {
			return `${getDate(firstDate)} - ${getDate(lastDate)} ${format(
				firstDate,
				"MMMM",
			)}`;
		}

		return `${getDate(firstDate)} ${format(firstDate, "MMMM")} - ${getDate(
			lastDate,
		)} ${format(lastDate, "MMMM")}`;
	}, [homeworkDatesSlice]);

	if (!homeworksResult) {
		return <></>;
	}

	const openEditHomeworkHandler = () => {
		onCloseViewHomeworkDialog();
		onOpenEditHomeworkDialog();
	};

	const closeEditHomeworkHandler = () => {
		onOpenViewHomeworkDialog();
		onCloseEditHomeworkDialog();
	};

	const openDeleteHomeworkHandler = () => {
		onCloseViewHomeworkDialog();
		onOpenDeleteHomeworkDialog();
	};

	const closeDeleteHomeworkHandler = () => {
		onOpenViewHomeworkDialog();
		onCloseDeleteHomeworkDialog();
	};

	const fullCloseDeleteHomeworkHandler = () => {
		onCloseDeleteHomeworkDialog();
		onCloseViewHomeworkDialog(["homework"]);
	};

	const closeViewHomeworkHandler = () => {
		onCloseViewHomeworkDialog(["homework"]);
	};

	return (
		<>
			<div className="profile-tabs__content active">
				<div className="project-wrap">
					{!!sortedHomeworkEntries.length && (
						<div className="info-head">
							<span className="section-title">{formattedDatesRange}</span>
							<div className="nav-arrows">
								<button className="nav-arrow nav-arrow-prev">
									<Prev />
								</button>
								<button className="nav-arrow nav-arrow-next">
									<Next />
								</button>
							</div>
						</div>
					)}

					{!sortedHomeworkEntries.length && <span>No homeworks added</span>}
					{!!sortedHomeworkEntries.length && (
						<swiper-container
							className="swiper-container"
							slides-per-view={3}
							space-between={24}
							navigation-prev-el=".nav-arrow-prev"
							navigation-next-el=".nav-arrow-next"
							initial-slide={foundColunmIndex}
						>
							{sortedHomeworkEntries.map(([columnDate, homeworks], index) => (
								<swiper-slide
									className="swiper-slide"
									key={getListKey("homework-column", index)}
								>
									<HomeworkColumn
										columnDate={columnDate}
										homeworks={homeworks}
										onOpenViewHomeworkDialog={onOpenViewHomeworkDialog}
									/>
								</swiper-slide>
							))}
						</swiper-container>
					)}
				</div>
			</div>

			<DeleteHomeworkDialog
				isVisible={isDeleteHomeworkDialogVisible}
				onClose={closeDeleteHomeworkHandler}
				onFullClose={fullCloseDeleteHomeworkHandler}
			/>

			<EditHomeworkDialog
				isVisible={isEditHomeworkDialogVisible}
				onClose={closeEditHomeworkHandler}
			/>

			<ViewHomeworkDialog
				isControlActive={false}
				isAttachUser={true}
				isOverallInterface={false}
				isVisible={isViewHomeworkDialogVisible}
				onEdit={openEditHomeworkHandler}
				onDelete={openDeleteHomeworkHandler}
				onClose={closeViewHomeworkHandler}
			/>
		</>
	);
}

export { HomeworkTab };
