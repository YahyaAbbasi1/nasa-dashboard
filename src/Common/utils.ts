import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { DATE_TIME_FORMAT, DEFAULT_UTC_OFFSET } from "Constants/Constants";
dayjs.extend(utc);

export const getFormattedUtcDate = (date: string | Date | null | undefined) => {
  if (!date) {
    return dayjs().format(DATE_TIME_FORMAT);
  }
  return dayjs.utc(date).utcOffset(DEFAULT_UTC_OFFSET).format(DATE_TIME_FORMAT);
};

export function FormatDuration(seconds: number) {
  var mins = Math.floor(seconds / 60);
  var secs = seconds - mins * 60;

  return `${mins}:${secs}`;
}

export function enumToOptions(enumObj: any) {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key))) // Filter out numeric keys
    .map((key) => ({
      key: enumObj[key],
      description: key,
      value: enumObj[key],
    }));
}
