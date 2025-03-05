import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';

// This wrapper component handles the defaultProps warning by using ES6 default parameters
function DatePickerWrapper({
  selected,
  onChange,
  selectsStart = false,
  selectsEnd = false,
  startDate = null,
  endDate = null,
  minDate = null,
  placeholderText = "Выберите дату",
  className = "input-field",
  dateFormat = "dd.MM.yyyy",
  isClearable = false,
  showPopperArrow = false,
  disabled = false,
  locale = ru,
  ...props
}) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      selectsStart={selectsStart}
      selectsEnd={selectsEnd}
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
      placeholderText={placeholderText}
      className={className}
      dateFormat={dateFormat}
      isClearable={isClearable}
      showPopperArrow={showPopperArrow}
      disabled={disabled}
      locale={locale}
      {...props}
    />
  );
}

export default DatePickerWrapper;