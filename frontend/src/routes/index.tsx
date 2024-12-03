import { createBrowserRouter, Navigate } from "react-router-dom";

import { RoleProtectedRoute } from "@features/role-access";

import { UserTypesEnum } from "@api/services/users";

import { App } from "@components/App";

import { SignInPage } from "@pages/SignInPage";
import { MyPage } from "@pages/MyPage";

import { UsersPage } from "@pages/UsersPage";
import { AddUserPage } from "@pages/AddUserPage";
import { EditUserPage } from "@pages/EditUserPage";
import { UserDetailsPage } from "@pages/UserDetailsPage";

import { ClassesPage } from "@pages/ClassesPage";
import { AddClassPage } from "@pages/AddClassPage";
import { ClassDetailsPage } from "@pages/ClassDetailsPage";
import { EditClassPage } from "@pages/EditClassPage";

import { LessonDetailsPage } from "@pages/LessonDetailsPage";
import { EditLessonPage } from "@pages/EditLessonPage";

import { SchoolsPage } from "@pages/SchoolsPage";
import { AddSchoolPage } from "@pages/AddSchoolPage";
import { SchoolDetailsPage } from "@pages/SchoolDetailsPage";
import { EditSchoolPage } from "@pages/EditSchoolPage";
import { SchoolCalendarPage } from "@pages/SchoolCalendarPage";

import { StudentTimetablePage } from "@pages/StudentTimetable";
import { StudentHomeworkPage } from "@pages/StudentHomework";
import { StudentMaterialsPage } from "@pages/StudentMaterials";
import { StudentProjectsPage } from "@pages/StudentProjects";

import { AddDisciplinePage } from "@pages/AddDiscipline";

import { OverallLayout } from "@components/layouts/OverallLayout";

import { ErrorPage } from "@pages/ErrorPage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				element: <OverallLayout />,
				errorElement: <ErrorPage />,
				children: [
					{
						index: true,
						element: <Navigate to={"/my"} />,
					},
					{
						path: "users",
						children: [
							{
								index: true,
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[
											UserTypesEnum.TEACHER,
											UserTypesEnum.PARENT,
											UserTypesEnum.TUTOR,
										]}
										permissions={[]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<UsersPage />
									</RoleProtectedRoute>
								),
							},
							{
								path: ":id",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[
											UserTypesEnum.TEACHER,
											UserTypesEnum.PARENT,
											UserTypesEnum.TUTOR,
										]}
										permissions={[]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<UserDetailsPage />
									</RoleProtectedRoute>
								),
							},
							{
								path: "add",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[UserTypesEnum.TEACHER]}
										permissions={["can_create_users"]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<AddUserPage />
									</RoleProtectedRoute>
								),
							},
							{ path: "edit", element: <Navigate to="/users" /> },
							{
								path: "edit/:id",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[UserTypesEnum.TEACHER]}
										permissions={["can_create_users"]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<EditUserPage />
									</RoleProtectedRoute>
								),
							},
						],
					},
					{
						path: "classes",
						children: [
							{
								index: true,
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[
											UserTypesEnum.TEACHER,
											UserTypesEnum.PARENT,
											UserTypesEnum.TUTOR,
										]}
										permissions={[]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<ClassesPage />
									</RoleProtectedRoute>
								),
							},
							{
								path: ":classId",
								children: [
									{
										index: true,
										element: (
											<RoleProtectedRoute
												replace={true}
												roles={[
													UserTypesEnum.TEACHER,
													UserTypesEnum.PARENT,
													UserTypesEnum.TUTOR,
												]}
												permissions={[]}
												redirectToPath="/not-found"
												isDisableRedirection={true}
											>
												<ClassDetailsPage />
											</RoleProtectedRoute>
										),
									},
									{
										path: "lessons",
										children: [
											{ index: true, element: <Navigate to="/classes" /> },
											{
												path: ":lessonId",
												element: (
													<RoleProtectedRoute
														replace={true}
														roles={[
															UserTypesEnum.TEACHER,
															UserTypesEnum.PARENT,
															UserTypesEnum.STUDENT,
															UserTypesEnum.TUTOR,
														]}
														permissions={[]}
														redirectToPath="/not-found"
														isDisableRedirection={true}
													>
														<LessonDetailsPage />
													</RoleProtectedRoute>
												),
											},
											{ path: "edit", element: <Navigate to="/classes" /> },
											{
												path: "edit/:lessonId",
												element: (
													<RoleProtectedRoute
														replace={true}
														roles={[UserTypesEnum.TEACHER]}
														permissions={[]}
														redirectToPath="/not-found"
														isDisableRedirection={true}
													>
														<EditLessonPage />
													</RoleProtectedRoute>
												),
											},
										],
									},
								],
							},
							{
								path: "add",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[UserTypesEnum.TEACHER]}
										permissions={["can_create_classes"]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<AddClassPage />
									</RoleProtectedRoute>
								),
							},
							{ path: "edit", element: <Navigate to="/classes" /> },
							{
								path: "edit/:id",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[UserTypesEnum.TEACHER]}
										permissions={["can_create_classes"]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<EditClassPage />
									</RoleProtectedRoute>
								),
							},
						],
					},
					{
						path: "schools",
						children: [
							{
								index: true,
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[
											UserTypesEnum.TEACHER,
											UserTypesEnum.PARENT,
											UserTypesEnum.TUTOR,
										]}
										permissions={[]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<SchoolsPage />
									</RoleProtectedRoute>
								),
							},
							{
								path: ":id",
								children: [
									{
										index: true,
										element: (
											<RoleProtectedRoute
												replace={true}
												roles={[
													UserTypesEnum.TEACHER,
													UserTypesEnum.PARENT,
													UserTypesEnum.TUTOR,
												]}
												permissions={[]}
												redirectToPath="/not-found"
												isDisableRedirection={true}
											>
												<SchoolDetailsPage />
											</RoleProtectedRoute>
										),
									},
									{
										path: "calendar",
										element: (
											<RoleProtectedRoute
												replace={true}
												roles={[
													UserTypesEnum.TEACHER,
													UserTypesEnum.PARENT,
													UserTypesEnum.STUDENT,
													UserTypesEnum.TUTOR,
												]}
												permissions={[]}
												redirectToPath="/not-found"
												isDisableRedirection={true}
											>
												<SchoolCalendarPage />
											</RoleProtectedRoute>
										),
									},
								],
							},
							{
								path: "add",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[UserTypesEnum.TEACHER]}
										permissions={["can_create_school"]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<AddSchoolPage />
									</RoleProtectedRoute>
								),
							},
							{ path: "edit", element: <Navigate to="/schools" /> },
							{
								path: "edit/:id",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[UserTypesEnum.TEACHER]}
										permissions={["can_create_school"]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<EditSchoolPage />
									</RoleProtectedRoute>
								),
							},
						],
					},
					{
						path: "disciplines",
						children: [
							{ index: true, element: <Navigate to="/disciplines/add" /> },
							{
								path: "add",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[UserTypesEnum.TEACHER]}
										permissions={["can_create_discipline"]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<AddDisciplinePage />
									</RoleProtectedRoute>
								),
							},
						],
					},
					{
						path: "student",
						children: [
							{ index: true, element: <Navigate to="/student/timetable" /> },
							{
								path: "timetable",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[UserTypesEnum.STUDENT]}
										permissions={[]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<StudentTimetablePage />
									</RoleProtectedRoute>
								),
							},
							{
								path: "homework",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[UserTypesEnum.STUDENT]}
										permissions={[]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<StudentHomeworkPage />
									</RoleProtectedRoute>
								),
							},
							{
								path: "materials",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[UserTypesEnum.STUDENT]}
										permissions={[]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<StudentMaterialsPage />
									</RoleProtectedRoute>
								),
							},
							{
								path: "projects",
								element: (
									<RoleProtectedRoute
										replace={true}
										roles={[UserTypesEnum.STUDENT]}
										permissions={[]}
										redirectToPath="/not-found"
										isDisableRedirection={true}
									>
										<StudentProjectsPage />
									</RoleProtectedRoute>
								),
							},
						],
					},
					{
						path: "my",
						children: [{ index: true, element: <MyPage /> }],
					},
				],
			},
			{
				path: "signin",
				children: [{ index: true, element: <SignInPage /> }],
			},
		],
	},
]);
