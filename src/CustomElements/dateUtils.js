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
	addDays,
} from 'date-fns';
import { ru } from 'date-fns/locale';

setDefaultOptions({ locale: ru });

export function getPrevMonth(current) {
	const previousMonth = subMonths(current, 1);
	return previousMonth;
}

export function getNextMonth(current) {
	const nextMonth = addMonths(current, 1);
	return nextMonth;
}

export function getFormatedDate(date) {
	return format(date, 'E MM/dd');
}

export function getCalendar(month) {
	const allDatesOfMonth = getAllDatesOfMonth(month);

	const startWeek = startOfWeek(allDatesOfMonth[0]);
	const endWeek = endOfWeek(allDatesOfMonth[allDatesOfMonth.length - 1]);

	// Get all the dates of the week
	const allDaysOfCalendar = eachDayOfInterval({ start: startWeek, end: endWeek });

	// Format the dates for display
	const formattedDates = allDaysOfCalendar.map((date) => format(date, 'yyyy-MM-dd'));
	return allDaysOfCalendar;
}

export function isThisMonth(date, month) {
	return format(new Date(date), 'LLLL').toLowerCase() === format(new Date(month), 'LLLL').toLowerCase();
}

export function isPast(date) {
	const givenDate = addDays(date, 1);
	const currentDate = new Date();

	return givenDate < currentDate
}

export function inRange(start, end, date) {
	if (!start || !end) return false
	return date >= start && date <= end
}

function getAllDatesOfMonth(month) {
	const startDate = startOfMonth(month);
	const endDate = endOfMonth(month);

	const allDatesOfMonth = eachDayOfInterval({ start: startDate, end: endDate });

	return allDatesOfMonth;
}
