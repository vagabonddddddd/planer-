(function (calendar) {
    'use strict';

    /** export */
    calendar.widget.Calendar = Calendar;

    /**
     * Represents a calendar.
     * @constructor
     */
    function Calendar(model) {
        var self = this;

        self.model = model;

        //time of app run
        self.now = new Date();
        //selected and displayed date 
        self.currentDate = new Date();

        self.daysOfWeekUS = [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота'
        ];

        self.months = [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ];
    }

    /**
     * Return a week day name.
     *
     * @param {number} dayNumber A week day number, where Sunday is 0.
     * @returns {String|Undefined} A week name in russian.
     */
    Calendar.prototype.getWeekDay = function (dayNumber) {
        return this.daysOfWeekUS[dayNumber];
    };

    /**
     * Return a month name.
     *
     * @param {number} month A month number, where Januar is 0.
     * @returns {string} A month name in russian.
     */
    Calendar.prototype.getMonthName = function (month) { 
        return this.months[month];
    }

    /**
     * Check is a current month.
     *
     * @returns {boolean} It true if displayed a current month.
     */
    Calendar.prototype.isCurrentMonthShowed = function () {
        return this.currentDate.getFullYear() == this.now.getFullYear()
            && this.currentDate.getMonth()    == this.now.getMonth();
    };

    /**
     * Созадает массив заполненый днями текущего месяца + последней неделей
     * предидущего месяца, если начало переданного месяца не начинается
     * с понедельника
     *
     * @param {Date}
     * @returns {Array} Массив дней представленных объектом Date
     */
    Calendar.prototype.createFullWeekMonth = function (date) {
        var fullMonth = [];

        var year  = date.getFullYear();
        var month = date.getMonth();

        var firstDate = new Date(year, month, 1);

        var firstDay = (firstDate.getDay() != 0) ? firstDate.getDay() : 7; //sunday is 7 no 0

        //first day no monday?
        if (firstDay > 1) {
            //add last week of prev month
            fullMonth = fullMonth.concat(this._prevMonthLastWeekDays(date));
        }
        //last week of prev month + current month
        fullMonth =  fullMonth.concat(this._currentMonthDays(date));

        /*fullMonth + NEXT WEEK*/ //TODO

        return fullMonth;
    };

    /**
     * Create an array of currenth months days
     *
     * @param {Date}
     * @returns {Array} An array of Date objects of currenth months
     */
    Calendar.prototype._currentMonthDays = function (date) {
        var self = this;
        var days = [];

        var year  = date.getFullYear();
        var month = date.getMonth();

        var firstDate = new Date(year, month, 1);
        var totalDays  = new Date(year, month + 1, 0).getDate();

        do {
            days.push(new Date(firstDate));
            firstDate = new Date(firstDate.setDate(firstDate.getDate() + 1));
        } while(--totalDays);

        return days;
    };

    /**
     * Create an array of currenth months days
     *
     * @param {Date}
     * @returns {Array} An array of Date of last week previous month, if first day of a month is not a Monday
     */
    Calendar.prototype._prevMonthLastWeekDays = function (date) {
        var self = this;
        var days = [];

        var year  = date.getFullYear();
        var month = date.getMonth();

        var firstDate = new Date(year, month, 1);

        var firstDay = (firstDate.getDay() != 0) ? firstDate.getDay() : 7; //вс будет 7-е

        var totalDays = firstDay - 1; //кол-во последних дней недели предидущего месяца

        var prevMonthLastDay = new Date(new Date(date).setDate(0));

        do {
            var day   = prevMonthLastDay.getDay();
            var date  = prevMonthLastDay.getDate();
            days.unshift(new Date(prevMonthLastDay)); //на один день назад
            prevMonthLastDay = new Date(prevMonthLastDay.setDate(prevMonthLastDay.getDate() - 1));
        } while (--totalDays);

        return days;
    };

    /**
     * Generate a HTML table calendar
     *
     * @param {Date} The date for which generate calendar
     * @returns {HTMLElement} A calendar in DOM presentation
     */
    Calendar.prototype.createCalendarHtml = function (date) {
        var self = this;

        var   cellContent
            , cssClass
            , dataDate
            , lastEl
            , table
            , tr
            , td;

        var days     = self.createFullWeekMonth(date);

        self.currentDate = date;

        table = createElement('table' , {className: 'table'});

        for (var i = 0; i < days.length; i++) {

            var fMonth = days[i];

            //first table row start
            if (i === 0) {
                tr = createElement('tr');
            }

            //new cell
            td = createElement('td');

            /* create cell content */
            var cellContentWrap = createElement('div');

            //day of month
            cellContent = fMonth.getDate();
            if (i < 7) {
                cellContent = self.getWeekDay(fMonth.getDay()) + ', ' + fMonth.getDate();
            }

            //insert day of month to cell
            lastEl = createElement('p', {
                innerHTML: cellContent,
                className: 'day'
            });
            cellContentWrap.appendChild(lastEl);

            //day event
            var localStorageKey = 'event.' + [
                fMonth.getFullYear(),
                ('0' + fMonth.getMonth()).slice(-2), //add leading zero, Jan -> 01
                ('0' + fMonth.getDate()).slice(-2)
            ].join('-');

            var eventData = JSON.parse(localStorage.getItem(localStorageKey));

            //записываем в ячейку событие если есть
            if (eventData) {
                var eventContent = createElement('div', {className: 'event-content'})

                lastEl = createElement('p', {
                    innerHTML: htmlEntities(eventData.eventName),
                    className: 'event-name'
                });
                eventContent.appendChild(lastEl);

                if (eventData.members) {
                    lastEl = createElement('p', {
                        innerHTML: htmlEntities(eventData.members),
                        className: 'event-members'
                    });
                    eventContent.appendChild(lastEl);
                }

                //fill cell
                cellContentWrap.appendChild(eventContent);

                //show description on hover standart suggest
                td.title = htmlEntities(eventData.description);
            }

            //вставляем содержимое в ячейку
            td.appendChild(cellContentWrap);

            //атрибут ячейки содержащий дату
            dataDate = [
                fMonth.getFullYear(),
                ('0' + fMonth.getMonth()).slice(-2), //add leading zero, Jan -> 01
                ('0' + fMonth.getDate()).slice(-2)
            ].join('-');

            td.setAttribute('data-date', dataDate);

            /** стиль ячейки */
            cssClass = 'calendar-day';

            //ячейка текущего дня
            if (self.isCurrentMonthShowed()  && self.now.getDate() == fMonth.getDate()) {
                cssClass += ' today';
            }

            //if day has event
            if (eventData) {
                cssClass += ' has-event';
            }

            td.className = cssClass;

            /* вcставляем ячейку в строку */
            tr.appendChild(td);

            /* вставляем строку в таблицу */
            if (i && !((i + 1)%7) || days.length == (i + 1)) {
                table.appendChild(tr);
                tr = createElement('tr');
            }
        }
        return table;
    };

})(
    window.calendar        = window.calendar || {},
    window.calendar.widget = window.calendar.widget || {}
);