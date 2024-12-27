/**
 * @file Calendar view class
 */

(function (calendar) {
    'use strict';

    /** export */
    calendar.View = View;

    /** use */
    var CreateEventTooltip      = calendar.widget.CreateEventTooltip,
        CreateEventShortTooltip = calendar.widget.CreateEventShortTooltip,
        SearchTooltip           = calendar.widget.SearchTooltip,
        Calendar                = calendar.widget.Calendar,
        Tooltip                 = calendar.widget.Tooltip;

    /**
     * Represents a main view of application.
     * @constructor
     */
    function View() {
        var self = this;

        //UI elements
        self.calendarWrapEl   = getById('event-calendar');

        //buttons
        self.showPrevMonthBtn = getById('show-prev-month');
        self.currentDateEl    = getById('current-date');
        self.showNextMonthBtn = getById('show-next-month');
        self.showTodayBtn     = getById('show-today');

        self.selectedDayEl = null; //current selected cell

        /** init widgets */
        self.advanceAddEventEl   = getById('advance-add-event');
        self.createEventTooltip  = new CreateEventTooltip(self.advanceAddEventEl);

        //createEventShortTooltip
        self.shortAddEventEl         = getById('short-add-event');
        self.eventAddBtn             = getById('task-add');
        self.createEventShortTooltip = new CreateEventShortTooltip(self.shortAddEventEl);

        //searchTooltip
        self.searchTooltipEl = getById('search-tooltip');
        self.taskSearchInput = getById('task-search');
        self.searchTooltip   = new SearchTooltip(self.searchTooltipEl);


        //helpTooltip
        self.helpBtn       = getById('help-btn');
        self.helpTooltipEl = getById('help-tooltip');
        self.helpTooltip   = new Tooltip(self.helpTooltipEl);

        //calendar
        self.calendar = new Calendar();

        /** Interface events */
        self.events = {
            /*'eventName': {
                target: {string}, //элемент
                type: {string},   //тип события
                fn: {function}    //метод View
            },*/

            'prevMonth': {
                target: self.showPrevMonthBtn,
                type: 'click',
                fn: self._bindedHandler
            },

            'nextMonth': {
                target: self.showNextMonthBtn,
                type: 'click',
                fn: self._bindedHandler
            },

            'showToday': {
                target: self.showTodayBtn,
                type: 'click',
                fn: self._bindedHandler
            },

            'clickCalendarDay': {
                target: self.calendarWrapEl,
                type: 'click',
                fn: self._clickCalendarDay
            },

            'clickAddEvent': {
                target: self.eventAddBtn,
                type: 'click',
                fn: self._clickAddEvent
            },

            'helpTooltip': {
                target: self.helpBtn,
                type: 'click',
                fn: self._helpTooltip
            },

            'searchInput': {
                target: self.taskSearchInput,
                type: 'input',
                fn: self._searchInput
            },

            'clickFindedEvent' : {
                target: self.searchTooltip.el.querySelector('.search-list'),
                type: 'click',
                fn:  self._clickFindedEvent
            }
        };
    }

    /**
     * Create event listener and bind out callback to trigger this event
     */
    View.prototype.bind   = function (eventName, handler) {
        var self = this;
        var event = self.events[eventName];

        if (!event) return;

        event.target.addEventListener(event.type, function (e) {
            event.fn(handler, e, self);
        });
    };

    /**
     * {}
     */
    View.prototype.updateCurrentDateEl = function (date) {
        var self = this;

        self.currentDateEl.innerHTML = [
            self.calendar.getMonthName(date.getMonth()),
            date.getFullYear()
        ].join('\n');
    };

    /* render */

    /**
     * {}
     */
    View.prototype.render = function (renderType, date, callback) {
        var self = this;
        callback = callback || function () {};

        renderType(self, date);

        callback();
    };

    /**
     * {}
     */
    View.prototype.renderCalendar = function (self, data) {
        self.calendarWrapEl.innerHTML = '';
        //calendar
        self.calendarWrapEl.appendChild(data.calendar);

        //addition elements
        self.updateCurrentDateEl(data.date);

        if (!data.isCurrMonth) {
            removeClass(self.showTodayBtn, 'active');
        } else {
            addClass(self.showTodayBtn, 'active');
        }
    };

    /** Binded events handlers */

    /**
     * Run callback handler function which was binded
     *
     * @param {callback}
     */
    View.prototype._bindedHandler = function (handler) {
        handler();
    };

    /**
     * {}
     */
    View.prototype._helpTooltip = function (handler, e, self) {
        self.helpTooltip.show(e.target);
    }

    /**
     * {}
     */
    View.prototype._searchInput = function (handler, e, self) {
        var eventList = handler(e.target.value);

        if (eventList.length > 0) {
            self.searchTooltip.fillSearch(eventList);

            if (!self.searchTooltip.isShow) {
                self.searchTooltip.show(e.target);
            }

            /*self.searchTooltip.bind('selectEvent', function (handler, e, self) {
                console.log(e);
            });*/

        } else {
            self.searchTooltip.close();
        }
    }

    /**
     * {}
     */
    View.prototype._clickAddEvent = function (handler, e) {
        handler(e.target);
    }

    /**
     * {}
     */
    View.prototype._clickFindedEvent = function (handler, e) {
        handler(e);
    }

    /**
     * {}
     */
    View.prototype._clickCalendarDay = function (handler, e, self) {

        if (e.target !== e.currentTarget) {

            if (e.target.tagName !== 'TD') {
                var dayEl = getParent(e.target, 'td');
            } else {
                var dayEl = e.target;
            }

            if (!dayEl) return;

            self.createEventTooltip.clearForm();
            self.selectedDayEl = dayEl;

            handler(dayEl);
        }
        e.stopPropagation();
    };

})(
    window.calendar = window.calendar || {}
);