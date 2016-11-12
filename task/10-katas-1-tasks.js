'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {

    const   azimuthPerPoint   = 11.25,
            pointsPerCardinal = 8,
            cardinalsNum      = 4,
            sides = ['N','E','S','W'];  // use array of cardinal directions only!

    let azimuth = 0,
        compass = [];

    sides.map((cur, index) => {

        let next    = index !== cardinalsNum - 1    ? sides[index + 1]  : sides[0],
            half    = next === 'S' || next === 'N'  ? next + cur        : cur + next,
            first   = [cur, cur, cur, half, half, half, next, next],
            second  = ['', next, half, cur, '', next, half, cur];

        for (let point = 0; point < pointsPerCardinal; point++) { 

            let abbr = first[point] + (point % 2 === 1  ? 'b'   : '') + second[point];
            azimuth = (point + index * pointsPerCardinal) * azimuthPerPoint;

            compass.push({abbreviation: abbr, azimuth: azimuth});
        }
    });
    return compass;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {

    let queue = [str],
        results = [],
        regex = /{([^\{\}]+)}/;

    while (queue.length) {
        let item = queue.shift(),
            matches = item.match(regex);

        if (matches !== null) {
            matches[1].split(',').map(cur => {
                queue.push(item.replace(matches[0], cur));
            });
        } else if (results.indexOf(item) === -1) {
            results.push(item);
            yield item;
        }
    }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    /* The idea of this solution is all about checks
     * and certain position changes at each step which
     * depends on current direction of bypass.
     * 
     * At the very first step direction is considered
     * to be right(->);
     */
    let posX    = 0,
        posY    = 0,
        filler  = 0,
        dir     = 0,
        xChange = 1,
        yChange = -1,
        matrix  =   Array(n)
                    .fill(0)
                    .map(() => Array(n).fill(0));

    while (filler < n * n) {

        matrix[posY][posX] = filler++;

        /*Searching for border reach*/
        if (dir === 0)
        {
            if (posX === n - 1) {
                swapAndChange(false);
                continue;
            }
            if (posY === 0) {
                swapAndChange(true);
                continue;
            }
        } else {
            if (posY === n - 1) {
                swapAndChange(true);
                continue;
            }
            if (posX === 0) {
                swapAndChange(false);
                continue;
            }
        }

        /* No borders were reached*/
        posX += xChange;
        posY += yChange;
      
    }
    return matrix;

    function swapAndChange(posXChange){
        dir = dir === 0 ? 1 : 0;
        xChange *= -1;
        yChange *= -1;
        if (posXChange) {
            posX += 1;
        } else {
            posY += 1;
        }
    }
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    /* The idea of this solution is to flat given dominoes
     * into the string, and count how much times each 
     * possible number appears. Each number should appear
     * even number of times to make the row of dominoes possible.
     *
     * Two numbers from given string (but not from the
     * same dominoe) should be considered as start and end 
     * of the row and they do not participate in numbers counting.
     *
     * We should check all variants with various numbers excluded.
     *
     * The problem is dominoes with same numbers on both side. If such
     * dominoe is used the count of it's number in given string 
     * must be both even and larger than 2, except the case, when it's
     * used for either start or end.
     */
    const dominoeDigitsNum = 7;

    let digits = Array(dominoeDigitsNum).fill(0),
        isSame = Array(dominoeDigitsNum).fill(0),
        isFound = false,
        exclude = [];
        
    var generate = getDominoes();

    dominoes.forEach((cur, i) => {
        digits[cur[0]]++;
        digits[cur[1]]++;

        if (cur[0] === cur[1]) {
            isSame[cur[0]] = i;
        }
    });
   
    while (exclude = generate.next().value) {
        isFound = true;
        let localDigits = Array.from(digits);
        localDigits[exclude[0]]--;
        localDigits[exclude[1]]--;

        for (let x = 0; x < dominoeDigitsNum; x++) {
            if (localDigits[x] % 2 === 0 
                && !(isSame[x] && isSame[x] !== exclude[2] && isSame[x] !== exclude[3])) continue;

            isFound = false;
            break;
        }

        if (isFound) {
            return true;
        }
    }

    return false;

    function* getDominoes() {
        /* Flatten dominoes to string */
        let dominoesStr = dominoes.reduce((prev, cur) => prev.concat(cur.join('')), "");
        for (let i = 0; i < dominoesStr.length; i++) {
            for (let j = i + 1; j < dominoesStr.length; j++) {
                /* Skip if this pair of numbers is situated on the same dominoe */
                if (i % 2 === 0 && j - i === 1) continue;
                /*Return two digits, and number of bones it is situated at*/
                yield [dominoesStr[i], dominoesStr[j], Math.floor(i / 2), Math.floor(j / 2)];
            }
        }
        return undefined;
    }
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    /* The idea of this solution is to try to push every
     * number taken from array into sequence. When this
     * element follows after the last element of sequence,
     * we'll just push him into. If it does not, we'll check
     * length of current sequence. If it bigger than two, we'll
     * add sequence values to result as an sequence, 
     * in other case, we'll add sequence values to result as
     * an separate values. After that, element from array
     * will be pushed to the empty sequence.
     */
    let sequence = [];

    let result = {
        string: "",
        add: function(sequence) {
            if (result.string !== '') {
                result.string += ',';
            }

            if (sequence.length > 2) {
                result.string += sequence.shift() + '-' + sequence.pop();
            } else {
                result.string += sequence.join(',');
            }
            return [];
        }
    };

    nums.map(cur => {

        if (sequence.length && cur - sequence[sequence.length - 1] !== 1) {
            sequence = result.add(sequence);
        }
        
        sequence.push(cur);

    });

    if (sequence.length) {
        sequence = result.add(sequence);
    }
    
    return result.string;
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
