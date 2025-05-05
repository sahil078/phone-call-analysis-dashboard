
import { format, parseISO, isDate } from 'date-fns';

export const fetchDailyData = async (date) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const [summaryResponse, detailsResponse] = await Promise.all([
    fetch(`${process.env.REACT_APP_CALL_SUMMARY_API}?date=${formattedDate}`),
    fetch(`${process.env.REACT_APP_CALL_API}?date=${formattedDate}`)
  ]);

  if (!summaryResponse.ok || !detailsResponse.ok) {
    throw new Error("Failed to fetch daily data");
  }

  const [summaryData, detailsData] = await Promise.all([
    summaryResponse.json(),
    detailsResponse.json()
  ]);

  return { summaryData, detailsData };
};

export const fetchWeeklyData = async () => {
  const response = await fetch(`${process.env.REACT_APP_WEEKLY_CALL_SUMMARY_API}`);
  if (!response.ok) {
    throw new Error("Failed to fetch weekly data");
  }
  const weeklyData = await response.json();
  const processedData = Array.isArray(weeklyData) ? weeklyData : [weeklyData];

  const transformedData = processedData.map(item => ({
    date: item.date,
    total_calls: item.total_calls,
    neutral_calls: item.sentiment_breakdown?.Neutral || 0,
    positive_calls: item.sentiment_breakdown?.Positive || 0,
    negative_calls: item.sentiment_breakdown?.Negative || 0,
  }));

  transformedData.sort((a, b) => new Date(a.date) - new Date(b.date));

  return transformedData;
};