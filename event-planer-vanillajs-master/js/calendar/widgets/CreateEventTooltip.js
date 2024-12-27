(function (calendar) {
    'use strict';

    /** export */
    calendar.widget.CreateEventTooltip = CreateEventTooltip;

    /** use */
    var Tooltip = calendar.widget.Tooltip;

    /**
     * Calendar's tooltip for creating an events
     *
     * @constructor
     * @param {HTMLElement} A reference to a tooltip template
     */
    function CreateEventTooltip(el) {
        Tooltip.apply(this, arguments);

        var self = this;

        self.date = null;
        self.eventData = null;
        self.el = el;

        self.events = {
            'createEvent': {
                target: el.querySelector('.btn-add'),
                type: 'click',
                fn: self._createEvent
            },
            'deleteEvent': {
                target: el.querySelector('.btn-delete'),
                type: 'click',
                fn: self._deleteEvent
            }
        };

        /** Prevent a form send */
        el.onsubmit = function (event) {
            event.preventDefault();
        };
    }

        /** inherit Tooltip */
    CreateEventTooltip.prototype = Object.create(Tooltip.prototype);

    CreateEventTooltip.prototype._createEvent = function (handler, e, self) {

        self.eventData = {
            date: self.date,
            eventName: self.el.eventName.value,
            members: self.el.members.value,
            description: self.el.descr.value
        };

        var result = handler(self.eventData);

        if (result) {
            self.close();
        }
    }

    CreateEventTooltip.prototype._deleteEvent = function (handler, e, self) {

        var result = handler();

        if (result) {
            self.close();
        }
    }

    CreateEventTooltip.prototype.show = function (target) {
        var self = this;
        removeClass(self.el, 'hidden');

        self.date = target.getAttribute('data-date');

        var rectTarget  = target.getBoundingClientRect();
        var rectTooltip = self.el.getBoundingClientRect();

        var clientWidth  = document.documentElement.clientWidth;
        var clientHeight = document.documentElement.clientHeight;

        var posLeft   = rectTarget.right  + rectTooltip.width;
        var posTop    = rectTarget.top    + rectTooltip.height;

        var isFitOnWidth  = false;
        var isFitOnHeight = false;

        if (posLeft < clientWidth) {
            isFitOnWidth = true;
        } else {
            isFitOnWidth = false;
        }

        if (posTop < clientHeight) {
            isFitOnHeight = true;
        } else {
            isFitOnHeight = false;
        }

        removeClass(self.el, 'triangle-left');
        removeClass(self.el, 'triangle-top');
        removeClass(self.el, 'triangle-bottom');
        removeClass(self.el, 'triangle-right');

        self.el.style.position = 'absolute';

        if (isFitOnWidth && isFitOnHeight) {
            self.el.style.top  = (rectTarget.top) + 'px';
            self.el.style.left = (rectTarget.left + (rectTarget.width)) + 'px';

            addClass(self.el, 'triangle-left');
        }
        else if (!isFitOnWidth && isFitOnHeight) {
            self.el.style.top  = (rectTarget.top) + 'px';
            self.el.style.left = (rectTarget.left - rectTooltip.width) + 'px';

            addClass(self.el, 'triangle-right');
        }
        else if (isFitOnWidth && !isFitOnHeight) {
            self.el.style.top  = (rectTarget.top  - rectTooltip.height) + 'px';
            self.el.style.left = (rectTarget.left + (rectTarget.width / 2) - (rectTooltip.width / 2)) + 'px';

            addClass(self.el, 'triangle-bottom');
        }
        else if (!isFitOnWidth && !isFitOnHeight) {
            self.el.style.top  = (rectTarget.top  + (rectTarget.height / 2) - (rectTooltip.width / 2)) + 'px';
            self.el.style.left = (rectTarget.left + (rectTarget.width / 2)  - (rectTooltip.height / 2)) + 'px';

        }

        self.isShow = true;
    };

    CreateEventTooltip.prototype.close = function () {
        var self = this;

        if (self.isShow) {
            addClass(self.el, 'hidden');
            self.clearForm();
        }
    };

    /**
     *  Clear text, textarea fields value
     */
    CreateEventTooltip.prototype.clearForm = function () {
        var self = this;

        for (var i = 0; i < self.el.elements.length; i++) {
            self.el.elements[i].value = '';
        }
    };

    /**
     *  Fill form inputs by value
     */
    CreateEventTooltip.prototype.fillForm = function (formData) {
        if (!formData) return;

        this.el.eventName.value    = formData.eventName;
        this.el.members.value      = formData.members;
        this.el.descr.value        = formData.description;
    };

})(
    window.calendar        = window.calendar || {},
    window.calendar.widget = window.calendar.widget || {}
);