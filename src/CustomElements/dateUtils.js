import {
	setDefaultOptions,
	parse,
	subMonths,
	format,
	addMonths,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	startOfWeek,
	endOfWeek,
} from 'date-fns';
import { ru } from 'date-fns/locale';

setDefaultOptions({ locale: ru });

export function getPrevMonth(current) {
	const currentDate = parse(current, 'MMMM', new Date());
	const previousMonth = subMonths(currentDate, 1);
	return format(previousMonth, 'LLLL');
}

export function getNextMonth(current) {
	const currentDate = parse(current, 'MMMM', new Date());
	const nextMonth = addMonths(currentDate, 1);
	return format(nextMonth, 'LLLL');
}

export function getFormatedDate(date) {
	return format(getDate(date), 'E MM/dd');
}

export function getCalendar(month) {
	const allDatesOfMonth = getAllDatesOfMonth(month);

	const startWeek = startOfWeek(allDatesOfMonth[0]);
	const endWeek = endOfWeek(allDatesOfMonth[allDatesOfMonth.length - 1]);

	// Get all the dates of the week
	const allDaysOfCalendar = eachDayOfInterval({ start: startWeek, end: endWeek });

	// Format the dates for display
	const formattedDates = allDaysOfCalendar.map((date) => format(date, 'yyyy-MM-dd'));
	return formattedDates;
}

export function isThisMonth(date, month) {
	return format(new Date(date), 'LLLL').toLowerCase() === month.toLowerCase();
}

export function isPast(date) {
	const givenDate = new Date(date);
	const currentDate = new Date();

	return givenDate < currentDate
}

export function inRange(start, end, date) {
	return getDate(date) >= getDate(start) && getDate(date) <= getDate(end)
}

function getAllDatesOfMonth(month) {
	const monthIndex = parse(month, 'MMMM', new Date()).getMonth();
	const currentYear = new Date().getFullYear();
	const monthDate = new Date(currentYear, monthIndex, 1);

	const startDate = startOfMonth(monthDate);
	const endDate = endOfMonth(monthDate);

	const allDatesOfMonth = eachDayOfInterval({ start: startDate, end: endDate });

	return allDatesOfMonth;
}

function getDate(formatedDate) {
	return new Date(formatedDate)
}
