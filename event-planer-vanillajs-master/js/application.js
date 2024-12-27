/**
 * @file Application entry script
 */

(function (window) {
    'use strict';

    /**
     * Bootstrap and starting up the application.
     */
    window.addEventListener('load', function () {
        var model      = new window.calendar.Model('event');
        var view       = new window.calendar.View();
        var controller = new window.calendar.Controller(model, view);
        controller.actionDefault();
    });
})(window);