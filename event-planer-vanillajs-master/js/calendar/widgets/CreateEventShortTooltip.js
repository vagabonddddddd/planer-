(function (calendar) {
    'use strict';

    /** export */
    calendar.widget.CreateEventShortTooltip = CreateEventShortTooltip;

    /** use */
    var Tooltip = calendar.widget.Tooltip;

    /**
     * CreateEventShortTooltip
     *
     * @constructor
     * @param {HTMLElement} el A reference to a tooltip template
     */
    function CreateEventShortTooltip(el) {
        Tooltip.apply(this, arguments);

        var self = this;
        self.el = el;

        el.onsubmit = function (event) {
            event.preventDefault();
        };

        el.shortEvent.onkeyup = function (event) {
            var userInput = el.shortEvent.value;

            if (!userInput) return;

            //var result = self._createEvent(function(){}, event, self);
            var result = self.createEvent();
            if (!result.date) {
                getById('shortEventParseDate').innerHTML  = '—';
                getById('shortEventParseEvent').innerHTML = '—';
            } else {
                getById('shortEventParseDate').innerHTML  = [result.date.getDate(), result.date.getMonth(), result.date.getFullYear()].join('/');
                getById('shortEventParseEvent').innerHTML = result.eventName;
            }
        }

        self.events = {
            'createEvent': {
                target: self.el.querySelector('.btn-add'),
                type: 'click',
                fn: self._saveEvent
            }
        };

    }
    /** inherit Tooltip */
    CreateEventShortTooltip.prototype = Object.create(Tooltip.prototype);

    /**
     * Clear the tooltip form 
     */
    CreateEventShortTooltip.prototype.clearForm = function () {
        this.el.shortEvent.value = '';
    };

    /*CreateEventShortTooltip.prototype.show = function (target) {
        var self = this;

        var rect = target.getBoundingClientRect();

        toggleClass(self.el, 'hidden');

        self.el.style.position = 'absolute';
        self.el.style.top  = (rect.top + 40) + 'px';
        self.el.style.left = (rect.right - 100) + 'px';

        self.isShow = true;
    }*/

    /**
     * Hide and clear the tooltip 
     */
    CreateEventShortTooltip.prototype.close = function () {
        var self = this;

        if (self.isShow) {
            addClass(self.el, 'hidden');
            self.clearForm();
        }
    };

    /**
     * Create an event from a dirty input
     */
    CreateEventShortTooltip.prototype._saveEvent = function (handler, e, self) {
        handler(self.createEvent());
    }
    /**
     * Create an event from a dirty input
     */
    //CreateEventShortTooltip.prototype.createEvent = function (handler, e, self) {
    CreateEventShortTooltip.prototype.createEvent = function () {
        var self = this;
        if (!self.el.shortEvent.value) return;

        var now = new Date();
        var monthCheck = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

        var regexp = /(\d{1,2})\s(?:(.*?)\s)?(\d{4})?\s*(.*)?/; 
        var str = self.el.shortEvent.value;
            str = str.replace(',', ' ');
            str = str.replace('.', ' ');
            str = str.replace(/\s\s+/g, ' ');
        var m;

        m = regexp.exec(str);

        if (m && m.length) {
            //remove empty elements from the array
            var len = m.length;
            var i;
            for(i = 0; i < len; i++ ) {
                m[i] && m.push(m[i]);
            }

            m.splice(0 , ++len);
        } else {
            return 81;
        }

        //first value is a date
        var date = m[0];

        //check if month
        var month = null;

        if (m.length >= 3) {
            //if month is word
            var monthAsWord = m[1].toLowerCase();
            len = monthCheck.length;
            for (i = 0; i < len; i++) {
                console.log((m[1].toLowerCase()), monthCheck[i]);
                if (monthAsWord.indexOf(monthCheck[i]) > -1) {
                    month = i;
                    break;
                }
            }
            //if month is number
            var monthAsNumber = parseInt(m[1], 10);
            if (monthAsNumber >= 1 && monthAsNumber <= 12) {
                month = monthAsNumber;
            }

            month += 1;
        }

        //console.log(month, m.length);

        if (!month && m.length === 2) {
            //day + event
            //console.log('day + event');
            var eventDate = new Date(now.getFullYear(), now.getMonth(), date);
            var eventName = m[1];
        }

        if (month && m.length === 3) {
            //day + month + event 
            //console.log('day + month + event');
            var eventDate = new Date(now.getFullYear(), month - 1, date);
            var eventName = m[2];
        }

        if (month && m.length === 4) {
            //day + month + year + event 
            //console.log('day + month + year + event');
            var year = m[2];
            var eventDate = (new Date(year, month - 1, date));
            var eventName = m[3];
        }

        var eventData = {
            date: eventDate,
            eventName: htmlEntities(eventName)
        };

        return eventData;

        // handler(eventData);
        // self.clearForm();

    };

})(
    calendar        = window.calendar || {},
    calendar.widget = window.calendar.widget || {}
);