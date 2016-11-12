'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    let r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}

Rectangle.prototype.getArea = function () {
    return this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    let r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  let builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {

    errMoreThanOneTime: 'Element, id and pseudo-element should not occur more then one time inside the selector',

    errWrongOrder: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',

    selector: '',

    orderCheck: function(regex) {
        if (this.selector.match(regex) === null) return;

        this.selector = '';
        throw new Error(this.errWrongOrder);
    },

    timesCheck: function(elem) {
        if (this.selector.indexOf(elem) === -1) return;

        this.selector = '';
        throw new Error(this.errMoreThanOneTime);
    },

    element: function(value) {

        if (this.selector !== '') {
            throw new Error(this.errMoreThanOneTime);
        }
        this.orderCheck(/[#.\[\]:]+/);

        //Creating new object(every element method starts separate selector)
        let obj = Object.create(this);
        obj.selector = value;
        return obj;
    },

    id: function(value) {

        this.timesCheck('#');
        this.orderCheck(/[.\[\]:]+/);

        //Creating new object if selector is empty(not every id method starts separate selector)
        if (this.selector === '') {
            let obj = Object.create(this);
            obj.selector = '#' + value; 
            return obj;
        }

        this.selector += '#' + value; 
        return this;
    },

    class: function(value) {

        this.orderCheck(/[\[\]:]+/);    

        this.selector += '.' + value; 
        return this;
    },

    attr: function(value) {

        this.orderCheck(/:+/);   

        this.selector += '[' + value + ']'; 
        return this;
    },

    pseudoClass: function(value) {

        this.orderCheck(/(::)+/);   

        this.selector += ':' + value; 
        return this;
    },

    pseudoElement: function(value) {

        this.timesCheck('::');

        this.selector += '::' + value; 
        return this;
    },

    combine: function(selector1, combinator, selector2) {
        this.selector = selector1.stringify() + ' ' + combinator + ' ' + selector2.stringify();
        return this;
    },

    stringify: function() {
        let cssSelector = this.selector;
        this.selector = '';
        return cssSelector;
    }
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
