<svelte:options
	customElement={{
		tag: 'search-widget',
		shadow: 'none',
		props: {
			name: { reflect: true, type: 'Array', attribute: 'cities' },
		},
	}}
/>

<script>
	import { fade } from 'svelte/transition';
	import { clickOutside } from './clickOutside.js';
	import {
		getCalendar,
		getPrevMonth,
		getNextMonth,
		isThisMonth,
		isPast,
		inRange,
		getFormatedDate,
	} from './dateUtils.js';
	import toastr from 'toastr';

	import check from '../../public/svg/check.svg';
	import pin from '../../public/svg/pin.svg';
	import calendar from '../../public/svg/calendar.svg';
	import arrowBtn from '../../public/svg/arrow-btn.svg';

	export let cities = ['Guarulhos', 'Ribeirão Preto', 'São José do Rio Preto,'];
	$: filteredStartCities = cities;
	$: filteredEndCities = cities;
	let startLocation = '';
	let focusedStartLocation = false;
	let endLocation = '';
	let focusedEndLocation = false;
	let focusedDates = false;
	let endInput;
	let startInput;

	let startMonth = new Date();
	let endMonth = getNextMonth(startMonth);
	let startDate = '';
	let endDate = '';
	let checked = false;

	const weakDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
	$: startMonthDays = getCalendar(startMonth);
	$: endMonthDays = getCalendar(endMonth);

	$: if (checked) endDate = '';

	const onInput = (e) => {
		if (e.target.value) {
			if (focusedStartLocation) {
				filteredStartCities = cities.filter((c) =>
					c.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
				);
			}
			if (focusedEndLocation) {
				filteredEndCities = cities.filter((c) =>
					c.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
				);
			}
		} else {
			if (focusedStartLocation) {
				filteredStartCities = cities;
			}
			if (focusedEndLocation) {
				filteredEndCities = cities;
			}
		}
	};

	const handlePickDate = (i, day) => {
		if (i === 0) {
			if (startDate === day) {
				startDate = '';
			} else {
				startDate = day;
			}
		} else {
			if (endDate === day) {
				endDate = '';
			} else {
				endDate = day;
				checked = false;
			}
		}
	};

	const handleSearch = (e) => {
		if (!startLocation || !endLocation) {
			return toastr.error('Нужно выбрать локацию!');
		} else if (!startDate) {
			return toastr.error('Нужно выбрать дату!');
		} else if (!checked && !endDate) {
			return toastr.error('Нужно выбрать конечную дату!');
		}
		toastr.success('Ща будем искать!', { timeOut: 3000 });
		setTimeout(() => toastr.warning('Шутка это просто обманка'), 4000);
		if (focusedDates) focusedDates = false;
		const data = { startLocation, endLocation, startDate, endDate };

		e.target.dispatchEvent(
			new CustomEvent('search', { detail: data, bubbles: true, cancelable: false, composed: true })
		);
	};
</script>

<div class="search-widget">
	<div class="locations-wrapper wrapper">
		<div class="location start_location">
			<div class="select-title">Откуда</div>
			<div
				class="location-input"
				on:click={() => {
					startInput.focus();
					focusedStartLocation = true;
					if (focusedDates) focusedDates = false;
				}}
			>
				<div class="location-icon">
					<img src={pin} alt="" />
				</div>
				<input
					on:input={onInput}
					on:paste={onInput}
					type="text"
					bind:this={startInput}
					bind:value={startLocation}
					placeholder="Выберите локацию"
					name=""
					id=""
				/>
			</div>

			{#if focusedStartLocation}
				<div transition:fade class="dropdown-wrapper">
					<div
						class="dropdown"
						use:clickOutside
						on:click_outside={() => {
							startInput.blur();
							focusedStartLocation = false;
						}}
					>
						<div class="arrow" />
						<div class="content">
							<ul>
								{#each filteredStartCities as city}
									<li
										class:selected={city === startLocation}
										on:click={() => {
											startLocation = city;
											focusedStartLocation = false;
										}}
									>
										{city}
									</li>
								{:else}
									<p>Пока нет такой локации.</p>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			{/if}
		</div>
		<div class="location end_location">
			<div class="select-title">Куда</div>
			<div
				class="location-input"
				on:click={() => {
					endInput.focus();
					focusedEndLocation = true;
					if (focusedDates) focusedDates = false;
				}}
			>
				<div class="location-icon">
					<img src={pin} alt="" />
				</div>
				<input
					on:input={onInput}
					on:paste={onInput}
					type="text"
					bind:this={endInput}
					bind:value={endLocation}
					placeholder="Выберите локацию"
					name=""
					id=""
				/>
			</div>

			{#if focusedEndLocation}
				<div transition:fade class="dropdown-wrapper">
					<div
						class="dropdown
                    "
						use:clickOutside
						on:click_outside={() => {
							endInput.blur();
							focusedEndLocation = false;
						}}
					>
						<div class="arrow" />
						<div class="content">
							<ul>
								{#each filteredEndCities as city}
									<li
										class:selected={city === endLocation}
										on:click={() => {
											endLocation = city;
											focusedEndLocation = false;
										}}
									>
										{city}
									</li>
								{:else}
									<p>Пока нет такой локации.</p>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="dates-wrapper wrapper">
		<!-- <div class="dates-wrapper wrapper"> -->
		<div class="select-title">Даты</div>
		<div class="dates" on:click={() => (focusedDates = !focusedDates)}>
			<div class="date">
				<div class="date-icon">
					<img src={calendar} alt="" />
				</div>
				<div class="date-text">{startDate ? getFormatedDate(startDate) : 'Выбрать дату'}</div>
			</div>
			<div class="dash" />
			<div class="date">
				<div class="date-icon">
					<img src={calendar} alt="" />
				</div>
				<div class="date-text">
					{#if checked}
						Свободная дата
					{:else}
						{endDate ? getFormatedDate(endDate) : 'Выбрать дату'}
					{/if}
				</div>
			</div>
		</div>
		{#if focusedDates}
			<!-- {#if true} -->
			<div transition:fade class="dropdown-wrapper">
				<div class="dropdown">
					<div class="arrow" />
					<div class="content">
						<div class="calendars">
							{#each [startMonth, endMonth] as month, i}
								<div class="calendar">
									<div class="month">
										<div
											class="arrow-btn left"
											on:click={() =>
												i === 0
													? (startMonth = getPrevMonth(month))
													: (endMonth = getPrevMonth(month))}
										>
											<img src={arrowBtn} alt="" />
										</div>
										<span>{month.toLocaleString('default', { month: 'long' })}</span>
										<div
											class="arrow-btn"
											on:click={() =>
												i === 0
													? (startMonth = getNextMonth(month))
													: (endMonth = getNextMonth(month))}
										>
											<img src={arrowBtn} alt="" />
										</div>
									</div>
									<div class="weak">
										{#each weakDays as weakDay}
											<div class="weak-day">
												{weakDay}
											</div>
										{/each}
									</div>
									<div class="days">
										{#each i === 0 ? startMonthDays : endMonthDays as day}
											<div
												class:alone={(i === 0 && startDate && !endDate) ||
													(i !== 0 && !startDate && endDate)}
												class:first={i === 0 && startDate && endDate && day === startDate}
												class:last={i !== 0 && startDate && endDate && day === endDate}
												class:active={startDate === day ||
													endDate === day ||
													inRange(startDate, endDate, day)}
												class:disabled={!isThisMonth(day, i === 0 ? startMonth : endMonth) ||
													isPast(day)}
												class="day"
												on:click={() => handlePickDate(i, day)}
											>
												{day.getDate()}
											</div>
										{/each}
									</div>
								</div>
							{/each}
						</div>

						<div class="calendars-footer">
							<div class="checkbox">
								<input type="checkbox" id="myCheckbox" bind:checked />
								<label for="myCheckbox" class="checkbox-label">
									<img src={check} alt="" />
									Без конечной даты
								</label>
							</div>
							<button
								class="btn"
								on:click={() => {
									if (!startDate) {
										return toastr.error('Нужно выбрать дату!');
									} else if (!checked && !endDate) {
										return toastr.error('Нужно выбрать конечную дату!');
									} else {
										focusedDates = false;
									}
								}}
							>
								Готово
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<button class="btn" on:click={handleSearch}>Найти</button>
</div>

<style lang="scss">
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		transition: all ease-in 0.3s;
	}
	.search-widget {
		display: flex;
		gap: 15px;
		padding: 36px 23px 19px 23px;
		border-radius: 10px;
		background: #f2f2f2;
		color: #333333;
		font-family: 'Roboto', sans-serif;
		box-shadow: 0px 0px 10px #cccccc;
		flex-wrap: wrap;
	}

	.wrapper {
		position: relative;
		padding-top: 2px;
	}

	.select-title {
		position: absolute;
		top: -25px;
		font-size: 14px;
		font-weight: 700;
	}

	.dropdown {
		&-wrapper {
			position: absolute;
			top: calc(100% + 15px);
			padding-top: 9px;
			// border: 1px solid red;
		}
		position: relative;
		width: 415px;

		.content {
			position: absolute;
			background: #f2f2f2;

			border: 1px solid #e0e0e0;
			border-radius: 5px;
			z-index: 2;
			width: 100%;

			&::before {
				content: ' ';
				top: -1px;
				left: 12px;
				position: absolute;
				width: 20px;
				height: 2px;
				background: #f2f2f2;
				// background: red;
			}
		}
		.arrow {
			z-index: 1;
			position: absolute;
			top: -6px;
			left: 10px;
			width: 25px;
			height: 25px;
			transform: rotate(45deg);
			background: #f2f2f2;
			border: 1px solid #e0e0e0;
			border-radius: 5px;
		}
	}

	.locations-wrapper {
		display: flex;
		gap: 12px;

		.location {
			width: 202px;

			.location-input {
				display: flex;
				align-items: center;
				gap: 8px;
				background: #e0e0e0;
				height: 43px;
				border-radius: 5px;
				padding: 0 18px;

				.location-icon {
					width: 11px;
					height: 13px;
				}

				input {
					background: transparent;
					width: 140px;
					border: none;

					&:focus {
						outline: none;
					}
				}
			}

			.dropdown {
				ul {
					padding: 10px;
					list-style: none;

					li {
						padding: 10px;
						border-radius: 5px;
						cursor: pointer;

						&:hover {
							background: lighten($color: #e0e0e0, $amount: 3);
						}

						&.selected {
							background: #e0e0e0;
						}
					}
				}
			}
		}
	}

	.dates-wrapper {
		.dates {
			display: flex;
			width: 378px;
			height: 43px;
			background: #e0e0e0;
			border-radius: 5px;
			align-items: center;
			justify-content: space-between;
			padding: 0 44px;
			cursor: pointer;

			.date {
				display: flex;
				align-items: center;
				gap: 8px;

				&-text {
					font-size: 14px;
					font-weight: 500;
					text-transform: capitalize;
				}
			}
			.dash {
				width: 20px;
				height: 1px;
				background: #bdbdbd;
			}
		}

		.dropdown {
			.content {
				padding: 34px 55px;
				width: auto;

				.calendars {
					display: flex;
					gap: 87px;
					padding-bottom: 32px;
					border-bottom: 1px solid #bdbdbd;

					.calendar {
						width: 301px;
						height: 260px;

						.month {
							display: flex;
							align-items: center;
							justify-content: space-between;
							span {
								font-size: 18px;
								font-weight: bold;
								text-transform: capitalize;
							}
							.arrow-btn {
								cursor: pointer;
								&.left {
									transform: scale(-1);
								}
							}
						}

						.weak {
							display: flex;
							justify-content: space-between;
							margin-top: 40px;
							margin-bottom: 5px;
							padding: 0 5px;
							font-size: 15px;
							font-weight: 600;
						}

						.days {
							display: flex;
							flex-wrap: wrap;
							.day {
								display: inline-flex;
								margin-top: 7px;
								width: calc(100% / 7);
								height: 27px;
								align-items: center;
								justify-content: center;
								font-size: 15px;
								font-weight: 500;
								cursor: pointer;

								&.active {
									color: #f2f2f2;
									background: #333;

									&.alone {
										border-radius: 3px;
									}

									&.first {
										border-top-left-radius: 3px;
										border-bottom-left-radius: 3px;
									}

									&.last {
										border-top-right-radius: 3px;
										border-bottom-right-radius: 3px;
									}
								}
								&.disabled {
									color: #e0e0e0;
									pointer-events: none;
								}
							}
						}
					}
				}

				.calendars-footer {
					padding-top: 29px;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.checkbox {
						display: flex;
						gap: 10px;
						input[type='checkbox'] {
							display: none;
						}
						.checkbox-label {
							font-size: 13px;
							position: relative;
							padding-left: 24px;
							cursor: pointer;
							-webkit-user-select: none;
							-moz-user-select: none;
							-ms-user-select: none;
							user-select: none;
						}

						.checkbox-label::before {
							content: '';
							position: absolute;
							top: 1px;
							left: 0;
							width: 14px;
							height: 14px;
							border: 1px solid #333333;
							border-radius: 2px;
							background-color: transparent;
							box-sizing: border-box;
						}

						.checkbox-label img {
							position: absolute;
							top: 5.3px;
							left: 3px;
							display: none;
						}

						input[type='checkbox']:checked + .checkbox-label img {
							display: block;
						}
					}

					.btn {
						width: 132px;
					}
				}
			}

			@media (max-width: 1500px) {
				transform: translate(-50%);

				.arrow {
					left: 90%;
				}
				.content {
					&::before {
						left: 376px;
					}
				}
			}
		}
	}

	.btn {
		width: 153px;
		height: 47px;
		color: #f2f2f2;
		background: #333333;
		border: none;
		border-radius: 5px;
		font-size: 16px;
		font-weight: 700;
		line-height: 18.75px;
		cursor: pointer;
		transition: all ease 0.3s;

		&:hover {
			background: lighten($color: #333333, $amount: 8);
		}
	}
</style>
