/**
 * @file Calendar model class
 */

(function (calendar) {
    'use strict';

    /** export */
    calendar.Model = Model;

    /**
     * Model
     *
     * @constructor
     * @param {string} keyPrefix A prefix for local storage keys
     */
    function Model(keyPrefix) {
        this._keyPrefix = keyPrefix;

        this.rule = {
            'eventName': {

            },
            'members': {

            },
            'description': {

            }
        };
    }

    /**
     * 
     *
     * @param {string} key
     */
    Model.prototype.getFullKey = function (key) {
        return [this._keyPrefix, key].join('.');
    };

    /**
     * Save an item from the Model based on its key
     *
     * @param {string} key The key of the item to save
     */
    Model.prototype.save = function (key, data) {
        if (data instanceof Object) {
            data = JSON.stringify(data);
        }

        localStorage.setItem(this.getFullKey(key), data);
    };

    /**
     * 
     *
     * @param {string} key The key of the item to remove
     */
    Model.prototype.get = function (key) {
        var data = localStorage.getItem(this.getFullKey(key));
        return JSON.parse(data);
    };


    /**
     * Description
     *
     * @param {string} key The key of the item to remove
     */
    Model.prototype.search = function (query) {
        var i, key, item, itemDate, itemDateDayMonth;
        var eventList = [];

        var currentDate = new Date();

        for (var i = 0; i < localStorage.length; i++) {
            key = localStorage.key(i);
            item = JSON.parse(localStorage.getItem(key));

            itemDate = (new Date(item.date));

            itemDateDayMonth = itemDate.toLocaleString("ru", {day: 'numeric', month: 'long'});

            //old events ignore
            if ((+itemDate - +currentDate) < 0) {
                continue;
            }

            //get a event if it matches to the search query
            if (item.eventName.toLowerCase().indexOf(query) != -1) {
                eventList.push([htmlEntities(item.eventName), itemDateDayMonth, itemDate ]); //TODO
            }
        }

        return eventList;
    };

    /**
     * Delete an item from the Model based on its key
     *
     * @param {string} key The key of the item you want to remove
     */
    Model.prototype.remove = function (key) {
        localStorage.removeItem(this.getFullKey(key));
        return true;
    };

    /**
     * Delete an item from the Model based on its key
     *
     * @param {string} key The key of the item you want to remove
     */
    Model.prototype.validation = function () {

    };

})(
    window.calendar = window.calendar || {}
);