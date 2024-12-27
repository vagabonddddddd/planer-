'use strict';

/**
 * @file Utility functions
 */

function getById(elementId) {
    return document.getElementById(elementId);
}

/**
 * Toggle a HTML element class attribute value
 *
 * @param {HTMLElement} element The reference to the HTML element
 * @param {string} removeClass A class attribute value, that to be toggle
 */
function toggleClass(element, addClass) {
    var className = element.className;
    var newClassName = '';

    if ( className.indexOf(addClass) >= 0) {
        //delete class
        var classList = className.split(' ');

        for (var i = 0; i < classList.length; i++) {
            if ( classList[i] == addClass) {
                classList.splice(i, 1);
                newClassName = classList.join(' ');
                break;
            }
        };
    } else {
        //add class
        newClassName = className + ' ' + addClass;
    }

    element.className = newClassName;
}

/**
 * Remove a HTML element class attribute value
 *
 * @param {HTMLElement} element The reference to the HTML element
 * @param {string} removeClass A class attribute value, that to be removed
 */
function removeClass(element, removeClass) {
    var className = element.className;
    var newClassName = className;

    if ( className.indexOf(removeClass) >= 0) {
        //delete class
        var classList = className.split(' ');

        for (var i = 0; i < classList.length; i++) {
            if ( classList[i] == removeClass) {
                classList.splice(i, 1);
                newClassName = classList.join(' ');
                break;
            }
        };
    }

    element.className = newClassName;
}

/**
 * Add new class attribute value to the HTML element
 *
 * @param {HTMLElement} element The reference to the HTML element
 * @param {string} addClass A class attribute value
 */
function addClass(element, addClass) {
    var className = element.className;
    var newClassName = '';

    if ( className.indexOf(addClass) == -1) {
        newClassName = className + ' ' + addClass;
        element.className = newClassName;
    }
}

/**
 * Create new HTML element and fill optional propery
 *
 * @param {string} tagName A element tag name
 * @param {Array} [property] A optional propery of element object
 * @returns {HTMLElement} Reference to the new element object
 */
function createElement(tagName, property) {
    var el = document.createElement(tagName);

    if (property) {
        for (var key in property) {
            el[key] = property[key];
        }
    }

    return el;
}

/**
 * Get nearest parent of element
 *
 * @param {Element} element A reference to the child element
 * @param {string} tagname A tag name of an parent element
 * @returns {HTMLElement|Undefined} Reference to an element, if it has parent, otherwise Undefined
 */
function getParent(element, tagName){
    if (!element.parentNode) {
        return;
    }

    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
        return element.parentNode;
    }

    return window.getParent(element.parentNode, tagName);
}

/**
 * Replace html special symbols with escape character
 *
 * @param {string} str
 * @returns {string}
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}