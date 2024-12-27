/**
 * @file Calendar controller class
 */

(function (calendar) {
    'use strict';

    /** export */
    calendar.Controller = Controller;

    /**
     * Controller init the main view/widget events and transfers control to itself, when a events happen.
     * 
     * @constructor
     * @param {Object} model
     * @param {Object} view
     */
    function Controller(model, view) {
        var self = this;

        self.view  = view;
        self.model = model;

        /**
         * Init events of widgets and View and chain them to logic of the controller
         */

        /* View */
        view.bind('prevMonth', function () {
            self.actionPrevMonth();
        });

        view.bind('nextMonth', function () {
            self.actionNextMonth();
        });

        view.bind('showToday', function () {
            self.actionShowToday();
        });

        view.bind('clickCalendarDay', function (dayEl) {
            //TODO: передать обработку в отдельный метод контроллера
            var activeDay = self.view.calendarWrapEl.querySelector('.active');
            if (activeDay != null) {
                removeClass(activeDay, 'active');
            }
            addClass(dayEl, 'active');
            self.view.createEventTooltip.fillForm(self.model.get(dayEl.getAttribute('data-date')));
            self.view.createEventTooltip.show(dayEl);
        });

        view.bind('helpTooltip', function () {});

        view.bind('searchInput', function (query) {
            return self.actionSearchEvent(query);
        });

        view.bind('clickAddEvent', function (btn) {
            self.view.createEventShortTooltip.show(btn);
        });

        view.bind('clickFindedEvent', function (e) {
            self.actionFindedEvent(e);
        });

        /* Widgets */
        view.createEventTooltip.bind('createEvent', function (eventData) {
            return self.actionCreateEvent(eventData);
        });

        view.createEventTooltip.bind('deleteEvent', function () {
            return self.actionDeleteEvent();
        });

        //short widget
        view.createEventShortTooltip.bind('createEvent', function (eventData) {
            //console.log(eventData);
            return self.actionCreateEvent(eventData);
        });
    }

    /**
     * Generate and update calendar in view.
     */
    Controller.prototype.showCalendar = function () {
        var self = this;

        var calendar = self.view.calendar.createCalendarHtml(self.currentDate);

        self.view.render(self.view.renderCalendar, {
            calendar: calendar,
            date: self.currentDate,
            isCurrMonth: self.view.calendar.isCurrentMonthShowed()
        });
    }

    /** Actions */

    /**
     * The default action of the application, show the current month.
     */
    Controller.prototype.actionDefault = function () {
        this.actionShowToday();
    };

    /**
     * Show the current month.
     */
    Controller.prototype.actionShowToday = function () {
        this.currentDate = new Date();
        this.showCalendar();
    };

    /**
     * Show the previous month.
     */
    Controller.prototype.actionPrevMonth = function () {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        this.showCalendar();
    };

    /**
     * Show the next month.
     */
    Controller.prototype.actionNextMonth = function () {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        this.showCalendar();
    };

    /**
     * Add an event use short tooltip
     */
    Controller.prototype.actionAddShortEvent = function () {
        var self = this;
    };

    /**
     * Search events
     *
     * @param {string} query
     * @param {Array} Search result
     */
    Controller.prototype.actionSearchEvent = function (query) {
        var self = this;

        if (!query) {return []};

        query = query.toLowerCase();

        var eventList = self.model.search(query);

        return eventList;
    };

    /**
     * {}
     */
    /*Controller.prototype.actionHelpMessage = function () {
        var self = this;
    };*/

    /**
     * {}
     */
    Controller.prototype.actionFindedEvent = function (e) {
        var self = this;

        if (e.target !== e.currentTarget) {
            if (e.target.tagName !== 'LI') {
                var eventEl = getParent(e.target, 'li');
            } else {
                var eventEl = e.target;
            }

            var date = eventEl.getAttribute('data-date');
            date = new Date(date);
            self.showDate(date);
            self.view.searchTooltip.close();
        }
    };

    /**
     * Create an event.
     *
     * @param {JSON} eventData Information about the new event
     */
    Controller.prototype.actionCreateEvent = function (eventData) {
        var self = this;
        var key = eventData.date;

        //TODO: create a beautiful
        if (!(eventData.date instanceof Date)) {
            var date = eventData.date.split('-');
            eventData.date = new Date(date[0], date[1], date[2]);
        } else {
            key = [key.getFullYear(),
                ('0' + key.getMonth()).slice(-2), //add leading zero, Jan -> 01
                ('0' + key.getDate()).slice(-2)].join('-');
            self.currentDate = eventData.date;
        }

        this.model.save(key, eventData);
        self.showDate(self.currentDate);

        return true;
    };

    /**
     * Delete an event by selected day on the calendar.
     */
    Controller.prototype.actionDeleteEvent = function () {
        this.model.remove(this.view.selectedDayEl.getAttribute('data-date'));
        this.showDate(this.currentDate);

        return true;
    }

    /**
     * Show the passed date
     *
     * @param {Date} The date you want to show
     */
    Controller.prototype.showDate = function (date) {
        this.currentDate = date;
        this.showCalendar();
    };

})(
    window.calendar = window.calendar || {}
);