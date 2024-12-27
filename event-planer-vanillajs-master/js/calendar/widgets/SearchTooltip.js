(function (calendar) {
    'use strict';

    /** export */
    calendar.widget.SearchTooltip = SearchTooltip;

    /** use */
    var Tooltip = calendar.widget.Tooltip;

    /**
     * Represents search tooltip.
     *
     * @constructor
     * @param {HTMLElement} el A reference to a tooltip template.
     */
    function SearchTooltip(el) {
        var self    = this;
        self.el     = el;
        self.isShow = false;

        self.events = {
            'selectEvent': {
                target: self.el.querySelector('.event'),
                type: 'click',
                fn: self._selectEvent
            },
        };
    }

    /** inherit Tooltip */
    SearchTooltip.prototype = Object.create(Tooltip.prototype);

    /**
     * 
     */
    SearchTooltip.prototype._selectEvent = function (handler, e, self) {
        handler(handler, e, self);
    }

    /**
     * 
     */
    SearchTooltip.prototype.fillSearch = function (eventList) {
        var self = this;

        var eventSearchWrap = self.el.querySelector('.search-list');
        eventSearchWrap.innerHTML = '';

        for (var i = 0; i < eventList.length; i++) {
            //event name
            var eventEl = createElement('li', {className: 'event'});
            eventEl.setAttribute('data-date', eventList[i][2]);

            /*eventEl.onclick = function (event) {
                new Date(this.getAttribute('data-date'));
            };*/

            var eventNameEl = createElement('p', {
                className: 'event-name',
                innerHTML: eventList[i][0]
            });
            eventEl.appendChild(eventNameEl);

            //event date
            var eventDateEl = createElement('span', {
                className: 'event-date',
                innerHTML: eventList[i][1]
            });
            eventEl.appendChild(eventDateEl);

            eventSearchWrap.appendChild(eventEl);
        }

    };

})(
    window.calendar        = window.calendar || {},
    window.calendar.widget = window.calendar.widget || {}
);