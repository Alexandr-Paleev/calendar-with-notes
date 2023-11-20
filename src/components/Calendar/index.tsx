import React from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { checkDateIsEqual, checkIsToday } from '../../helpers';
import { useCalendar } from '../../hooks/useCalendar';

import './Calendar.css';

interface CalendarProps {
  locale?: string;
  selectedDate: Date;
  selectDate: (date: Date) => void;
  firstWeekDayNumber?: number;
  toggleModal: () => void;
  formDataArray: any[];
  setEditMode: (arg0: boolean) => void;
  setIdNote: (arg0: number) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  locale = 'default',
  selectedDate: date,
  selectDate,
  firstWeekDayNumber = 2,
  toggleModal,
  formDataArray,
  setEditMode,
  setIdNote
}) => {
  const { functions, state } = useCalendar({
    locale,
    selectedDate: date,
    firstWeekDayNumber,
    toggleModal
  });

  const editNote = (id: number) => {
    setIdNote(id);
    setEditMode(true);
    toggleModal();
  };

  return (
    <div className='calendar'>
      <div className='calendar__header'>
        <button onClick={toggleModal}>+</button>
        <div className='calendar__header__action'>
          <div
            aria-hidden
            className='calendar__header__arrow__left'
            onClick={() => functions.onClickArrow('left')}
          />
          {state.mode === 'days' && (
            <div aria-hidden onClick={() => functions.setMode('monthes')}>
              {state.monthesNames[state.selectedMonth.monthIndex].month} {state.selectedYear}
            </div>
          )}
          {state.mode === 'monthes' && <div aria-hidden>{state.selectedYear}</div>}
          {state.mode === 'years' && (
            <div>
              {state.selectedYearsInterval[0]} -{' '}
              {state.selectedYearsInterval[state.selectedYearsInterval.length - 1]}
            </div>
          )}
          <div
            aria-hidden
            className='calendar__header__arrow__right'
            onClick={() => functions.onClickArrow('right')}
          />
          <div>
            {state.mode === 'days' && (
              <div
                aria-hidden
                className='calendar__header__shoose'
                onClick={() => functions.setMode('monthes')}
              >
                select month
              </div>
            )}
            {state.mode === 'monthes' && (
              <div
                aria-hidden
                className='calendar__header__shoose'
                onClick={() => functions.setMode('years')}
              >
                select year
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='calendar__body'>
        {state.mode === 'days' && (
          <div className='calendar__days'>
            {state.calendarDays.map((day) => {
              const isToday = checkIsToday(day.date);
              const isSelectedDay = checkDateIsEqual(day.date, state.selectedDay.date);
              const isAdditionalDay = day.monthIndex !== state.selectedMonth.monthIndex;

              return (
                <div
                  key={`${day.dayNumber}-${day.monthIndex}`}
                  aria-hidden
                  onClick={() => {
                    functions.setSelectedDay(day);
                    selectDate(day.date);
                  }}
                  className={[
                    'calendar__day',
                    isToday ? 'calendar__today__item' : '',
                    isSelectedDay ? 'calendar__selected__item' : '',
                    isAdditionalDay ? 'calendar__additional__day' : ''
                  ].join(' ')}
                >
                  <div className='calendar__day--info'>
                    <span>{day.dayNumber}</span>
                    <span>{day.dayShort}</span>
                  </div>
                  {formDataArray.map((id, idx, formDataArray) => {
                    if (moment(id).format('DD.MM.YYYY') === moment(day.date).format('DD.MM.YYYY')) {
                      return (
                        <div
                          key={uuidv4()}
                          aria-hidden='true'
                          className='calendar__day--note'
                          onClick={() => editNote(formDataArray[idx].id)}
                        >
                          {formDataArray[idx].title}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            })}
          </div>
        )}

        {state.mode === 'monthes' && (
          <div className='calendar__pick__items__container'>
            {state.monthesNames.map((monthesName) => {
              const isCurrentMonth =
                new Date().getMonth() === monthesName.monthIndex &&
                state.selectedYear === new Date().getFullYear();
              const isSelectedMonth = monthesName.monthIndex === state.selectedMonth.monthIndex;

              return (
                <div
                  key={monthesName.month}
                  aria-hidden
                  onClick={() => {
                    functions.setSelectedMonthByIndex(monthesName.monthIndex);
                    functions.setMode('days');
                  }}
                  className={[
                    'calendar__pick__item',
                    isSelectedMonth ? 'calendar__selected__item' : '',
                    isCurrentMonth ? 'calendar__today__item' : ''
                  ].join(' ')}
                >
                  {monthesName.monthShort}
                </div>
              );
            })}
          </div>
        )}

        {state.mode === 'years' && (
          <div className='calendar__pick__items__container'>
            <div className='calendar__unchoosable__year'>{state.selectedYearsInterval[0] - 1}</div>
            {state.selectedYearsInterval.map((year) => {
              const isCurrentYear = new Date().getFullYear() === year;
              const isSelectedYear = year === state.selectedYear;

              return (
                <div
                  key={year}
                  aria-hidden
                  onClick={() => {
                    functions.setSelectedYear(year);
                    functions.setMode('monthes');
                  }}
                  className={[
                    'calendar__pick__item',
                    isCurrentYear ? 'calendar__today__item' : '',
                    isSelectedYear ? 'calendar__selected__item' : ''
                  ].join(' ')}
                >
                  {year}
                </div>
              );
            })}
            <div className='calendar__unchoosable__year'>
              {state.selectedYearsInterval[state.selectedYearsInterval.length - 1] + 1}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
