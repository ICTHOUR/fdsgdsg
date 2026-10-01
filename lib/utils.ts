import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const bnNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const bnMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const bnDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

export function formatBanglaNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '';
  return num.toString().replace(/\d/g, (c) => bnNumbers[parseInt(c, 10)] || c);
}

export function formatBanglaDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  
  const day = formatBanglaNumber(d.getUTCDate());
  const month = bnMonths[d.getUTCMonth()];
  const year = formatBanglaNumber(d.getUTCFullYear());
  return `${day} ${month} ${year}`;
}

export function formatBanglaTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  // Calculate Bangladesh Standard Time (UTC+6)
  let hours = d.getUTCHours() + 6;
  if (hours >= 24) hours -= 24;
  const minutes = d.getUTCMinutes();
  
  const displayHours = hours % 12 || 12;
  const hh = formatBanglaNumber(displayHours.toString().padStart(2, '0'));
  const mm = formatBanglaNumber(minutes.toString().padStart(2, '0'));
  const period = hours >= 12 ? 'বিকাল/রাত' : 'সকাল';

  return `${hh}:${mm}`;
}

export function getTodayBanglaDateString(): string {
  const d = new Date();
  const dayName = bnDays[d.getUTCDay()];
  const day = formatBanglaNumber(d.getUTCDate());
  const month = bnMonths[d.getUTCMonth()];
  const year = formatBanglaNumber(d.getUTCFullYear());
  return `ঢাকা, ${dayName} ${day} ${month} ${year}`;
}

export function getBengaliAndHijriDateString(): string {
  return `২৮ ভাদ্র ১৪৩৩, ২৮ রবিউল আউয়াল ১৪৪৮`;
}

export function getTraditionalBengaliCalendar(dateInput: Date = new Date()): string {
  // Official Bangladesh revised Bengali calendar converter
  const month = dateInput.getMonth(); // 0-indexed (0 = Jan, 8 = Sep)
  const day = dateInput.getDate();
  const year = dateInput.getFullYear();

  // Bengali Year
  let bYear = year - 593;
  if (month < 3 || (month === 3 && day < 14)) {
    bYear = year - 594;
  }

  let bMonthName = 'বৈশাখ';
  let bSeasonName = 'গ্রীষ্ম';
  let bDay = 1;

  if (month === 3 && day >= 14) { bMonthName = 'বৈশাখ'; bSeasonName = 'গ্রীষ্মকাল'; bDay = day - 13; }
  else if (month === 4 && day < 15) { bMonthName = 'বৈশাখ'; bSeasonName = 'গ্রীষ্মকাল'; bDay = day + 17; }
  else if (month === 4 && day >= 15) { bMonthName = 'জ্যৈষ্ঠ'; bSeasonName = 'গ্রীষ্মকাল'; bDay = day - 14; }
  else if (month === 5 && day < 15) { bMonthName = 'জ্যৈষ্ঠ'; bSeasonName = 'গ্রীষ্মকাল'; bDay = day + 17; }
  else if (month === 5 && day >= 15) { bMonthName = 'আষাঢ়'; bSeasonName = 'বর্ষাকাল'; bDay = day - 14; }
  else if (month === 6 && day < 16) { bMonthName = 'আষাঢ়'; bSeasonName = 'বর্ষাকাল'; bDay = day + 16; }
  else if (month === 6 && day >= 16) { bMonthName = 'শ্রাবণ'; bSeasonName = 'বর্ষাকাল'; bDay = day - 15; }
  else if (month === 7 && day < 16) { bMonthName = 'শ্রাবণ'; bSeasonName = 'বর্ষাকাল'; bDay = day + 16; }
  else if (month === 7 && day >= 16) { bMonthName = 'ভাদ্র'; bSeasonName = 'শরৎকাল'; bDay = day - 15; }
  else if (month === 8 && day < 16) { bMonthName = 'ভাদ্র'; bSeasonName = 'শরৎকাল'; bDay = day + 16; }
  else if (month === 8 && day >= 16) { bMonthName = 'আশ্বিন'; bSeasonName = 'শরৎকাল'; bDay = day - 15; }
  else if (month === 9 && day < 16) { bMonthName = 'আশ্বিন'; bSeasonName = 'শরৎকাল'; bDay = day + 15; }
  else if (month === 9 && day >= 16) { bMonthName = 'কার্তিক'; bSeasonName = 'হেমন্তকাল'; bDay = day - 15; }
  else if (month === 10 && day < 15) { bMonthName = 'কার্তিক'; bSeasonName = 'হেমন্তকাল'; bDay = day + 16; }
  else if (month === 10 && day >= 15) { bMonthName = 'অগ্রহায়ণ'; bSeasonName = 'হেমন্তকাল'; bDay = day - 14; }
  else if (month === 11 && day < 15) { bMonthName = 'অগ্রহায়ণ'; bSeasonName = 'হেমন্তকাল'; bDay = day + 16; }
  else if (month === 11 && day >= 15) { bMonthName = 'পৌষ'; bSeasonName = 'শীতকাল'; bDay = day - 14; }
  else if (month === 0 && day < 14) { bMonthName = 'পৌষ'; bSeasonName = 'শীতকাল'; bDay = day + 17; }
  else if (month === 0 && day >= 14) { bMonthName = 'মাঘ'; bSeasonName = 'শীতকাল'; bDay = day - 13; }
  else if (month === 1 && day < 13) { bMonthName = 'মাঘ'; bSeasonName = 'শীতকাল'; bDay = day + 18; }
  else if (month === 1 && day >= 13) { bMonthName = 'ফাল্গুন'; bSeasonName = 'বসন্তকাল'; bDay = day - 12; }
  else if (month === 2 && day < 15) { bMonthName = 'ফাল্গুন'; bSeasonName = 'বসন্তকাল'; bDay = day + 16; }
  else if (month === 2 && day >= 15) { bMonthName = 'চৈত্র'; bSeasonName = 'বসন্তকাল'; bDay = day - 14; }
  else if (month === 3 && day < 14) { bMonthName = 'চৈত্র'; bSeasonName = 'বসন্তকাল'; bDay = day + 17; }

  return `${formatBanglaNumber(bDay)} ${bMonthName} ${formatBanglaNumber(bYear)} বঙ্গাব্দ | ${bSeasonName}`;
}

export function calculateReadTime(content: string = ''): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 130)); // ~130 words per minute in Bangla
  return `${formatBanglaNumber(minutes)} মিনিট পাঠ`;
}
