import { startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek, startOfDay, endOfDay, format, isValid, eachWeekOfInterval } from 'date-fns';

const formatDateRange = (start, end) => `${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}`;

export const applyAggregation = (companies, period, startDate, endDate) => {
    const result = {};
    console.log("companies", companies)
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (!isValid(parsedStartDate) || !isValid(parsedEndDate)) {
        throw new Error('Invalid start or end date');
    }

    const weeks = eachWeekOfInterval({
        start: parsedStartDate,
        end: parsedEndDate
    }, { weekStartsOn: 0 });



    companies.forEach(company => {
        const date = new Date(company.createdAt);

        switch (period) {
            case 'daily':
                const dayStart = startOfDay(date);
                const dayEnd = endOfDay(date);
                const day = format(dayStart, 'yyyy-MM-dd');
                const dayName = format(dayStart, 'EEEE'); // Get day name (e.g., "Monday")
                const monthName = format(dayStart, 'MMMM yyyy'); // Get month name and year (e.g., "July 2024")

                if (!result[monthName]) {
                    result[monthName] = {};
                }

                if (!result[monthName][dayName]) {
                    result[monthName][dayName] = {};
                }

                if (!result[monthName][dayName][day]) {
                    result[monthName][dayName][day] = { companies: [], totalViewCount: 0 };
                }

                result[monthName][dayName][day].companies.push(company);
                result[monthName][dayName][day].totalViewCount += company.viewCount || 0;
                break;

            case 'weekly':
                const weekStart = startOfWeek(date, { weekStartsOn: 0 });
                const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
                const weekRange = formatDateRange(weekStart, weekEnd);
                const weekDayName = format(date, 'EEEE'); // Get day name (e.g., "Monday")

                if (!result[weekRange]) {
                    result[weekRange] = {
                        Monday: { companies: [], totalViewCount: 0 },
                        Tuesday: { companies: [], totalViewCount: 0 },
                        Wednesday: { companies: [], totalViewCount: 0 },
                        Thursday: { companies: [], totalViewCount: 0 },
                        Friday: { companies: [], totalViewCount: 0 },
                        Saturday: { companies: [], totalViewCount: 0 },
                        Sunday: { companies: [], totalViewCount: 0 }
                    };
                }

                result[weekRange][weekDayName].companies.push(company);
                result[weekRange][weekDayName].totalViewCount += company.viewCount || 0;

                break;

            case 'monthly':
                const monthStart = startOfMonth(date);
                const monthEnd = endOfMonth(date);
                const month = format(date, 'MMMM yyyy'); // e.g., "July 2024"
                if (!result[month]) result[month] = { companies: [], totalViewCount: 0 };
                result[month].companies.push(company);
                result[month].totalViewCount += company.viewCount || 0;
                break;

            case 'yearly':
                const yearStart = startOfYear(date);
                const yearEnd = endOfYear(date);
                const year = format(date, 'yyyy'); // e.g., "2024"
                if (!result[year]) result[year] = { companies: [], totalViewCount: 0 };
                result[year].companies.push(company);
                result[year].totalViewCount += company.viewCount || 0;
                break;

            default:
                result['all'] = result['all'] || { companies: [], totalViewCount: 0 };
                result['all'].companies.push(company);
                result['all'].totalViewCount += company.viewCount || 0;
                break;
        }
    });

    const sortedResult = Object.keys(result).sort((a, b) => new Date(a) - new Date(b)).reduce((acc, key) => {
        acc[key] = result[key];
        return acc;
    }, {});

    return sortedResult;
};