# noora-datepicker — تقویم نورا Noora DatePicker

**Live docs (Persian):** [noora-datepicker.vercel.app](https://noora-datepicker.vercel.app/) (Vercel — after import) · [GitHub Pages](https://unesnoora.github.io/noora-datepicker/) (needs Pages → GitHub Actions)

![React 18+](https://img.shields.io/badge/React-18%2B-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6?logo=typescript&logoColor=white)
![Ant Design 5](https://img.shields.io/badge/Ant_Design-5-1677ff?logo=antdesign&logoColor=white)
![RTL](https://img.shields.io/badge/RTL-native-1d7d5e)
![Jalali](https://img.shields.io/badge/Jalali-accurate-ff7a1a)

Persian (Jalali) + Gregorian date & time picker for **React + TypeScript + Ant Design**.
Accurate Jalali engine (leap years, month lengths), RTL-native, mobile bottom
sheet with day/month/year wheels, desktop modal/popover, dark + official themes.

> داکیومنت فارسی آنلاین روی GitHub Pages (لینک بالا). برای توسعه محلی: `npm run dev`.

## Publish & demo hosting

### Vercel (recommended — free)

1. [vercel.com](https://vercel.com) → **Add New… → Project**
2. Import **`unesnoora/noora-datepicker`** from GitHub
3. Leave defaults (`vercel.json` sets build + `demo-dist`) → **Deploy**
4. Production URL is usually **`https://noora-datepicker.vercel.app`** — put it in `homepage` in `package.json` if different.

CLI (after `npx vercel login` in your terminal):

```bash
npx vercel --prod
```

### GitHub Pages (404 fix)

If `https://unesnoora.github.io/noora-datepicker/` is **404**:

1. Repo **Settings → Pages → Build and deployment**
2. **Source:** **GitHub Actions** (not “Deploy from a branch”)
3. **Actions → Deploy docs → Run workflow** (or push again)
4. Wait 1–2 minutes after a green run

### npm

```bash
npm login
npm publish
```

## Features

- **9 selection modes** — date, datetime, range, week, datetimerange, multiple, month, year, time
- **2 calendars + locales** — Jalali/Farsi and Gregorian/English with a header فا/EN switch
- **3 themes** — default, dark, official storefront theme (`appearance="official"`)
- Multi-month view (1–3 months), presets, holidays, min/max, disabled dates
- Persian/Latin digits, sortable multiple, custom separators and locale names
- Keyboard navigation, ARIA labels, SSR-safe, controlled + uncontrolled usage

## Installation

```bash
npm install noora-datepicker antd
```

The package ships compiled JavaScript, TypeScript types, and CSS. `react` ≥ 18, `react-dom` ≥ 18, and `antd` ≥ 5 stay in the host app (peer dependencies) and are not bundled. Load Ant Design styles in the host app, then import the picker styles once:

```ts
import "noora-datepicker/styles.css";
```

## Quick start

```tsx
import { PersianDatePicker } from "noora-datepicker";

const [value, setValue] = useState(null);

<PersianDatePicker
  locale="fa"
  calendar="jalali"
  mode="date"
  displayFormat="jYYYY/jMM/jDD" // shown: ۱۴۰۵/۰۷/۲۳
  valueFormat="YYYY-MM-DD" // emitted: 2026-10-11 (Gregorian ISO)
  numberSystem="persian"
  placeholder="انتخاب تاریخ"
  allowClear
  showToday
  value={value}
  onChange={setValue}
/>;
```

For Jalali output set `valueFormat="jYYYY/jMM/jDD"`. For the storefront look:

```tsx
<PersianDatePicker appearance="official" autoConfirm />
```

## Modes

| mode            | description                        |
| --------------- | ---------------------------------- |
| `date`          | single date (default)              |
| `datetime`      | date + time tabs                   |
| `range`         | start / end with hover preview     |
| `week`          | whole-week range with one click    |
| `datetimerange` | range with time                    |
| `multiple`      | several dates (`maxSelections`)    |
| `month`         | month + year grid                  |
| `year`          | year list                          |
| `time`          | hour / minute / second columns     |

Named exports: `PersianDatePicker`, `PersianDateTimePicker`,
`PersianRangePicker`, `PersianTimePicker`, `PersianMultiplePicker`,
`PersianCalendar` (inline, no input).

## Key props

| prop                        | type                                              | default            |
| --------------------------- | ------------------------------------------------- | ------------------ |
| `mode`                      | see Modes                                         | `"date"`           |
| `locale` / `calendar`       | `"fa" \| "en"` / `"jalali" \| "gregorian"`        | `"fa"` / `"jalali"` |
| `numberSystem`              | `"persian" \| "latin"`                            | follows locale     |
| `appearance`                | `"light" \| "dark" \| "official" \| "auto"`       | `"light"`          |
| `value` / `defaultValue`    | ISO string, Jalali string, `Date`, array…         | —                  |
| `displayFormat`             | e.g. `jYYYY/jMM/jDD`, `YYYY/MM/DD`, `HH:mm`       | per mode           |
| `valueFormat`               | e.g. `YYYY-MM-DD`, `jYYYY/jMM/jDD`                | per mode (ISO)     |
| `minDate` / `maxDate`       | `DateLike`                                        | —                  |
| `disabledDate`              | `(date) => boolean`                               | —                  |
| `holidays`                  | `{ date, title }[]`                               | —                  |
| `showPresets` / `presets`   | built-in or custom shortcuts                      | `false`            |
| `numberOfMonths`            | `1 \| 2 \| 3` (desktop)                           | `1`                |
| `sortDates`                 | sort multiple chronologically                     | `false`            |
| `rangeSeparator` / `multipleSeparator` | input text separators                  | locale default     |
| `monthNames` / `weekdayNames` | override locale packs                           | —                  |
| `showOtherDays` / `highlightToday` | grid details                               | `true`             |
| `hideMonth` / `hideYear` / `hideWeekdays` | hide header parts                      | `false`            |
| `disableMonthPicker` / `disableYearPicker` | static labels                        | `false`            |
| `desktopMode` / `mobileMode` | `"modal" \| "popover"` / sheet…                  | `"modal"` / `"sheet"` |
| `forceVariant`              | force `"desktop" \| "mobile"` UI                  | viewport           |
| `autoConfirm`               | apply on select without confirm                   | `false`            |
| `allowClear` / `showToday`   | footer buttons                                    | `true`             |
| `showCalendarToggle`        | header فا/EN switch                               | `true`             |
| `onFocusedDateChange` / `onCalendarChange` | notifications                         | —                  |

Events: `onChange`, `onConfirm`, `onCancel`, `onOpen`, `onClose`,
`onOpenChange`, `onPanelChange`, `onMonthChange`, `onYearChange`.

## Ant Design Form

```tsx
<Form.Item name="birthDate" label="تاریخ تولد" rules={[{ required: true }]}>
  <PersianDatePicker />
</Form.Item>
```

## Utilities

```ts
import {
  toJalali, toGregorian,           // conversions
  isValidJalaliDate, isLeapJalaliYear, jalaliMonthLength,
  addDays, addMonths, addYears,    // date math
  compareDate, isSameDay, isBetween,
  buildMonthGrid, dateKey,
  formatJalali, formatValue,
} from "noora-datepicker";
```

## Demo & tests

```bash
npm install
npm run dev      # docs at http://localhost:5175 — راهنما، پیکربندی، نمونه‌ها
npm run build    # library in dist/ (JS, types, styles.css)
```

The demo includes engine self-tests (conversion, leap years, month lengths)
with pass/fail results on the page.

---

## Author

Unes Jafari (یونس جعفری)

## فارسی

انتخابگر تاریخ شمسی و میلادی برای React + TypeScript + Ant Design — ۹ حالت
انتخاب (تاریخ، تاریخ‌زمان، بازه، هفته، چندتایی، ماه، سال، زمان)، دو پوسته
پیش‌فرض و رسمی، شیت موبایل، حالت تاریک و خروجی ISO یا جلالی. با `npm run dev`
دموی زنده را ببینید.
