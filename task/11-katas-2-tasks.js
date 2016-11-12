'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    
    let map = new Map();
    map.set(" _ " +
            "| |" +
            "|_|", 0);
    map.set("   " +
            "  |" +
            "  |", 1);
    map.set(" _ " +
            " _|" +
            "|_ ", 2);
    map.set(" _ " +
            " _|" +
            " _|", 3);
    map.set("   " +
            "|_|" +
            "  |", 4);
    map.set(" _ " +
            "|_ " +
            " _|", 5);
    map.set(" _ " +
            "|_ " +
            "|_|", 6);
    map.set(" _ " +
            "  |" +
            "  |", 7);
    map.set(" _ " +
            "|_|" +
            "|_|", 8);
    map.set(" _ " +
            "|_|" +
            " _|", 9);

    let accountLines = bankAccount.split('\n'),
        length = accountLines[0].length,
        result = "";

    for (let i = 0; i < length; i += 3) {
        result += map.get(getKey(i, accountLines));
    }

    return result;
    
    function getKey(i, lines) {
        const   stringsNum = 3,
                charPerDigit = 3;   
                 
        let     key = "";
        
        for (let k = 0; k < stringsNum; k++) {
            key += lines[k].substr(i, charPerDigit);
        }
        return key;
    }
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {

    let result = "",
        words = text.split(' ');
    
    for (let i = 0; i < words.length; i++) {

        if (result.concat(' ', words[i]).length <= columns) {
            result += (result.length !== 0 ? ' ' : '') + words[i];
        } else {
            yield result;
            result = words[i];
        }

    }

    yield result;
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    const cards = "234567891JQKA"; //Ace has highest rank
    
    let sameArr = SameCards(hand),
        isSameSuit = IsSameSuit(hand);

    hand.sort((a, b) => {
        return cards.indexOf(a[0]) - cards.indexOf(b[0]);
    })

    /* Straight hand rank blocks presence of all other ranks */
    if (IsStraight(hand)) {
        if (isSameSuit) {
            return PokerRank.StraightFlush;
        }
        return PokerRank.Straight;          
    }
    /* Checking all poker hand ranks in decreasing order*/
    if (sameArr.length === 1 && sameArr[0] === 4)   
        return PokerRank.FourOfKind;
    if (sameArr.length === 2 && sameArr[0] === 2 && sameArr[1] === 3)   
        return PokerRank.FullHouse;
    if (isSameSuit)
        return PokerRank.Flush;
    if (sameArr.length === 1 && sameArr[0] === 3)
        return PokerRank.ThreeOfKind;
    if (sameArr.length === 2 && sameArr[0] === 2 && sameArr[1] === 2)
        return PokerRank.TwoPairs;
    if (sameArr.length === 1 && sameArr[0] === 2)
        return PokerRank.OnePair;
    
    return PokerRank.HighCard;

    function IsStraight(hand) {
        const cards = "234567891JQKA";
        const aceLowest = "A234567891JQK"; //Ace has lowest rank
        let isStraight = false;

        isStraight = hand.reduce((prev, cur) => {
            if (!prev || cards.indexOf(prev[0]) + 1 !== cards.indexOf(cur[0])) {
                return false;
            }
            return cur;
        }) !== false;

        if (isStraight) {
            return true;
        } 

        let isAceThere = hand.filter(cur => {
            if (cur[0] === 'A') {
                return true;
            }
            return false;
        }).length > 0;

        if (!isAceThere) {
            return false;
        }

        hand.sort((a, b) => {
            return aceLowest.indexOf(a[0]) - aceLowest.indexOf(b[0]);
        });

        return hand.reduce((prev, cur) => {
            if (!prev || aceLowest.indexOf(prev[0]) + 1 !== aceLowest.indexOf(cur[0])) {
                return false;
            }
            return cur;
        }) !== false;
    }

    function IsSameSuit(hand) {
        return hand.reduce((prev, cur) => {
            let suit = cur[cur.length - 1];
            if (prev.indexOf(suit) === -1) {
                return prev + suit;
            }
            return prev;
        }, '').length === 1;
    }

    function SameCards(hand) {
        const cardCount = 5;

        let checkedRanks = [],
            repeats = [];
        
        hand.map((cur, index) => {
            let sameCount = 1;

            if (checkedRanks.indexOf(cur[0]) !== -1) {
                return;
            }

            checkedRanks.push(cur[0]);

            for (let i = index + 1; i < cardCount; i++) {
                if (hand[i][0] !== cur[0]) continue; 
                sameCount++;
            }

            if (sameCount === 2) {
                repeats.unshift(sameCount);
            } else if (sameCount > 2) {
                repeats.push(sameCount);
            }
        
        });
        return repeats;
    }
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {

    let arr = figure.split('\n'),
        pluses = [],
        rectangles = [];

    arr.map((cur, line)=> {
        let i = cur.indexOf('+');

        while(i !== -1) {
            pluses.push([line, i]);
            i = cur.indexOf('+', i + 1);
        }
    });

    for (let current = 0; current < pluses.length - 1; current++) {

        let next = current + 1;

        /* While next plus is on the same row */
        while (pluses[next][0] === pluses[current][0]) {

            let y = pluses[current][0],
                x = pluses[current][1],
                x2 = pluses[next][1],
                width = arr[y].slice(x + 1, x2).length,
                height = 1;

            /* Check for no spaces in top line of rectangle */
            // if (arr[y].slice(x + 1, x2).indexOf(' ') !== -1) {
            //     break;
            // }

            while (arr[y + height][x]  === '|' && arr[y + height][x2] === '|') {
                height++;
            }

            if (arr[y + height][x]  === '+' && arr[y + height][x2] === '+') {
                yield formRectangle({h: height - 1, w: width});   
                break;      
            }

            next++;
            if (next >= pluses.length) {
                break;
            }
        }
    }

    function formRectangle(rect) {
        let topAndBottom = String.prototype.concat('+', '-'.repeat(rect.w), '+\n');
        let filler = String.prototype.concat('|', ' '.repeat(rect.w), '|\n');
        return String.prototype.concat(topAndBottom, filler.repeat(rect.h), topAndBottom);
    }
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
