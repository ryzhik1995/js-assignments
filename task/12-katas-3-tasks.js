 'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" possiblePathes inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   let puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {

    const   puzzleWidth = puzzle[0].length,
            puzzleHeight = puzzle.length;

    for (let i = 0; i < puzzleWidth; i++) {
        for (let j = 0; j < puzzleHeight; j++) {
            if (    puzzle[j][i] === searchStr[0] 
                &&  tryNext(i, j, [], searchStr.slice(1))) {
                return true;
            }
        }
    }

    return false;

    function tryNext (i, j, visited, search) {

        const steps = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        
        visited.push(i.toString() + j.toString());

        for (let num = 0; num < steps.length; num++) {

            let newI = i + steps[num][0],
                newJ = j + steps[num][1],
                str = String.prototype.concat(newI, newJ);

            if (    newI >= puzzleWidth || newI < 0 
                ||  newJ >= puzzleHeight || newJ < 0 
                ||  visited.indexOf(str) !== -1) {
                continue;
            }

            if (    puzzle[newJ][newI] === search[0] 
                && (search.length === 1 || tryNext(newI, newJ, visited, search.slice(1)))) {
                return true;       
            }
        }
        return false; 
    }
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {

    const length = chars.length;
    let stack = [];

    stack.push({string: "", visited: Array(length).fill(false)});

    while (stack.length) {

        let item = stack.pop();

        if (item.string.length === length) {
            yield item.string;
            continue;
        }

        for (let i = 0; i < length; i++) {
            if (!item.visited[i]) {
                let newVisited = Array.from(item.visited);
                newVisited[i] = true;
                stack.push({string: item.string + chars[i], visited: newVisited});
            }
        }

    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    
    let items   = 0,
        outcome = 0,
        max     = Math.max.apply(null, quotes);

    return quotes.reduce((profit, cur, index) => {

        if (cur !== max) {
            outcome += cur;
            items++;
        } else {
            max = Math.max.apply(null, quotes.slice(index + 1));
            if (items !== 0) {
                profit += cur * items - outcome;
                outcome = 0;
                items = 0;
            }        
        }
        return profit;

    }, 0);
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     let urlShortener = new UrlShortener();
 *     let shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     let original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    /* The idea of this solution is that there 84
     * allowed symbols and each of them can be represented
     * with 7 bits. Besides, one Unicode character has 16 bits
     * length, so we can store only two allowed characters in one
     * Unicode character. 
     *
     * Also, every url begins with 'https://', so we can
     * just cut it from url during encode, and add it to
     * result during decode.
     */
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url) {
        const bitsNumber = Math.ceil(Math.log2(this.urlAllowedChars.length)); //7

        let char1 = 0,
            char2 = 0,
            result = '';
         
        for (let pos = 8; pos < url.length; pos += 2) {
            char1 = this.urlAllowedChars.indexOf(url[pos]);

            if (pos + 1 < url.length) {
                char2 = this.urlAllowedChars.indexOf(url[pos + 1]) << bitsNumber;
            } else {
                /* Giving to our number value, that is not present in allowed list*/
                char2 = -1 << 7;
            }
            result += String.fromCharCode(char1 | char2);
        }
        return result;
    },
    
    decode: function(code) {
        const bitsNumber = Math.ceil(Math.log2(this.urlAllowedChars.length)); //7
        const mask = Number.parseInt('1'.repeat(bitsNumber), 2);

        let result = 'https://';
        
        for (let i = 0; i < code.length; i++) {
    
            let symbol = code[i].charCodeAt(),
                char1 = this.urlAllowedChars[symbol & mask],
                char2 = this.urlAllowedChars[symbol >> bitsNumber & mask];

            result += char1 + (char2 !== undefined ? char2 : '');
        }
        return result;
    } 
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
