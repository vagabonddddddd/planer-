(function (calendar) {
    'use strict';

    /** export */
    calendar.widget.Tooltip = Tooltip;

    /**
     * Represents a base class for tooltip
     *
     * @constructor
     * @param {HTMLElement} el A reference to a tooltip template
     */
    function Tooltip(el) {
        var self = this;
        self.el = el;
        self.isShow = false;

        //close tooltip X
        self.el.querySelector('.close-tooltip').onclick = function () {
            self.close();
        };
    }

    Tooltip.prototype.bind   = function (eventName, handler) {
        var self = this;
        var event = self.events[eventName];

        if (!event) return;

        event.target.addEventListener(event.type, function (e) {
            event.fn(handler, e, self);
        });
    };

    Tooltip.prototype.show = function (target) {
        var self = this;

        var rect = target.getBoundingClientRect();
        toggleClass(self.el, 'hidden');
        self.el.style.position = 'absolute';
        self.el.style.top  = (rect.top + 40) + 'px';
        self.el.style.left = (rect.left - (self.el.getBoundingClientRect().width / 2) + (rect.width / 2)) + 'px';
        self.isShow = true;
    };

    Tooltip.prototype.close = function () {
        var self = this;

        if (self.isShow) {
            addClass(self.el, 'hidden');
            self.isShow = false;
        }
    };

    /**
     * Create event listener and bind out callback to trigger this event
     */
    Tooltip.prototype.bind   = function (eventName, handler) {
        var self = this;
        var event = self.events[eventName];

        if (!event) return;

        event.target.addEventListener(event.type, function (e) {
            event.fn(handler, e, self);
        });
    };

})(
    window.calendar        = window.calendar || {},
    window.calendar.widget = window.calendar.widget || {}
);