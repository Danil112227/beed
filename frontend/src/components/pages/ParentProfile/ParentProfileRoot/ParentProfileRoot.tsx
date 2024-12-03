import Plus from "@assets/vectors/blue-plus.svg?react";
import Cross from "@assets/vectors/cross.svg?react";

import "./ParentProfileRoot.styles.scss";

function ParentProfileRoot() {
	return (
		<>
			<section className="section profile-section gradient-section">
				<div className="container">
					<div className="profile"></div>
				</div>
			</section>

			<section className="info-section">
				<div className="container">
					<div className="info-head">
						<span className="section-title">Children</span>
					</div>
					<div className="children-row">
						<div className="children-col">
							<div className="children">
								<span className="children__name">
									Grigoriev Konstantin Ivanovich
								</span>
								<div className="children__tags tag-row">
									<div className="tag-col">
										<div className="tag type-school">School #113</div>
									</div>
									<div className="tag-col">
										<div className="tag type-class">10 A</div>
									</div>
								</div>
							</div>
						</div>
						<div className="children-col">
							<div className="children">
								<span className="children__name">
									Grigorieva Alisa Ivanovna
								</span>
								<div className="children__tags tag-row">
									<div className="tag-col">
										<div className="tag type-school">School #113</div>
									</div>
									<div className="tag-col">
										<div className="tag type-class">10 A</div>
									</div>
								</div>
							</div>
						</div>
						<div className="children-col">
							<div className="children">
								<span className="children__name">
									Grigoriev Sergey Ivanovich
								</span>
								<div className="children__tags tag-row">
									<div className="tag-col">
										<div className="tag type-school">School #113</div>
									</div>
									<div className="tag-col">
										<div className="tag type-class">10 A</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="info-section">
				<div className="container">
					<div className="info-head">
						<span className="section-title">Leadership</span>
					</div>
					<div className="leadership-row">
						<div className="leadership-col">
							<div className="children">
								<div className="children__tags tag-row">
									<div className="tag-col">
										<div className="tag type-school">School #113</div>
									</div>
									<div className="tag-col">
										<div className="tag type-teacher">Teacher</div>
									</div>
									<div className="tag-col">
										<div className="tag type-class">10 A</div>
									</div>
								</div>
							</div>
						</div>
						<div className="leadership-col">
							<div className="children">
								<div className="children__tags tag-row">
									<div className="tag-col">
										<div className="tag type-school">School #113</div>
									</div>
									<div className="tag-col">
										<div className="tag type-class">10 A</div>
									</div>
								</div>
							</div>
						</div>
						<div className="leadership-col">
							<div className="children">
								<div className="children__tags tag-row">
									<div className="tag-col">
										<div className="tag type-school">School #113</div>
									</div>
									<div className="tag-col">
										<div className="tag type-class">10 A</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="info-section">
				<div className="container">
					<div className="info-head">
						<span className="section-title">Disciplines</span>
						<button className="profile-tabs__add">
							<span className="profile-tabs__add-text">Add disciplines</span>
							<div className="profile-tabs__add-icon">
								<Plus />
							</div>
						</button>
					</div>

					<div className="discipline-row">
						<div className="discipline-col">
							<div className="discipline">
								<div className="discipline__head">
									<span className="discipline__name">Maths</span>
									<button className="discipline__close">
										<Cross />
									</button>
								</div>
								<span className="discipline__owner">Alex Filatov</span>
							</div>
						</div>
						<div className="discipline-col">
							<div className="discipline">
								<div className="discipline__head">
									<span className="discipline__name">Physics</span>
									<button className="discipline__close">
										<Cross />
									</button>
								</div>
								<span className="discipline__owner">Alex Filatov</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export { ParentProfileRoot };
