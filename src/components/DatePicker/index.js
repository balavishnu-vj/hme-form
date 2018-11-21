/*
  TODO: Make calender like component and have reactive date validations
*/

import React from 'react';
import DropDown from '../DropDown';
import * as dateHelper  from './helper';

class DatePicker extends React.PureComponent {
    getSelectedDate = (date = this.props.value) => {
        return {
            selectedYear: dateHelper.getYear(date),
            selectedMonth: dateHelper.getMonth(date),
            selectedDate: dateHelper.getDate(date),
        };
    }

    getDateOptions = () => {
        const { selectedMonth, selectedYear } = this.getSelectedDate();
        const lastDayOfMonth = dateHelper.getMonthDays(selectedMonth, selectedYear);
        const dateOptions = [];
        for (let index = 1; index <= lastDayOfMonth; index++) {
            dateOptions.push({
                id: index,
                value: index,
            });            
        }
        return dateOptions;
    }

    getMonthOptions = () => {
        const monthOptions = [];
        for (let index = 0; index < 12; index++) {
            monthOptions.push({
                id: index,
                value: dateHelper.CALENDAR_MONTHS[index].shortName,
            });            
        }
        return monthOptions;
    }

    getYearOptions = () => {
        const yearOptions = [];
        for (let index = dateHelper.MIN_YEAR; index < dateHelper.MAX_YEAR; index++) {
            yearOptions.push({
                id: index,
                value: index,
            });            
        }
        return yearOptions;
    }

    getNewSelectedDate = (selectedIndex, fieldId) => {
        const { selectedDate, selectedMonth, selectedYear } = this.getSelectedDate();
        const newDate = {
            selectedDate,
            selectedMonth,
            selectedYear,
        };
        if (fieldId === 'selectedDate') {
            newDate[fieldId] = selectedIndex + 1;
        } else if (fieldId === 'selectedMonth') {
            const lastDayOfSelectedMonth = dateHelper.getMonthDays(selectedIndex, selectedYear);
            const isSelectedDateValid = selectedDate <= lastDayOfSelectedMonth;
            if (!isSelectedDateValid) {
                newDate.selectedDate = 1;
            }
            newDate[fieldId] = selectedIndex;
        } else {
            const selectedYear = selectedIndex + dateHelper.MIN_YEAR
            const isLeapYear = dateHelper.isLeapYear(selectedYear);
            const isMonthAndYearValid = isLeapYear && selectedMonth === 1 && selectedDate === 29;
            if (isMonthAndYearValid) {
                newDate.selectedDate = 1;
            }
            newDate[fieldId] = selectedYear;
        }
        const selectedDay = `${dateHelper.zeroPad(newDate.selectedMonth + 1)}/${dateHelper.zeroPad(newDate.selectedDate)}/${newDate.selectedYear}`;
        return new Date(selectedDay);
    }

    onDropDownChange = (selectedIndex, fieldId) => {
        const newSelectedDate = this.getNewSelectedDate(selectedIndex, fieldId);
        this.props.onDateChange(newSelectedDate);
    }

    render(){
        const dateOptions = this.getDateOptions();
        const monthOptions = this.getMonthOptions();
        const yearOptions = this.getYearOptions();
        const { selectedDate, selectedMonth, selectedYear } = this.getSelectedDate();
        return <div className="dropdown-wrap">
            <label>{this.props.label}</label>
            <DropDown
                id={'selectedDate'}
                onChange={this.onDropDownChange}
                options={dateOptions}
                selectedIndex={selectedDate - 1}
            />
            <DropDown
                id={'selectedMonth'}
                onChange={this.onDropDownChange}
                options={monthOptions}
                selectedIndex={selectedMonth}
            />
            <DropDown
                id={'selectedYear'}
                onChange={this.onDropDownChange}
                options={yearOptions}
                selectedIndex={selectedYear - dateHelper.MIN_YEAR}
            />
            <span style={{ color: 'red' }} >{this.props.error}</span>
        </div>;
    }
}

export default DatePicker;