import {State, UTILS} from '@theatrejs/theatrejs';

import * as CARDS from '../constants/cards.contants.js';

/**
 * @typedef {object} TypeBoard A representation of a board.
 * @property {Array<import('../constants/cards.contants.js').TypeCard>} TypeBoard.$deck The deck pile.
 * @property {import('../constants/cards.contants.js').TypeCard} TypeBoard.$left The left card.
 * @property {import('../constants/cards.contants.js').TypeCard} TypeBoard.$middle The middle card.
 * @property {import('../constants/cards.contants.js').TypeCard} TypeBoard.$right The right card.
 * @property {import('../constants/cards.contants.js').TypeCard} TypeBoard.$stack The current card on the stack.
 */

const board = Object.freeze({

    '$deck': [

        CARDS.KNIGHT_DOWN_LEFT_LEFT,
        CARDS.KNIGHT_DOWN_RIGHT_RIGHT,
        CARDS.KNIGHT_UP_UP_LEFT,
        CARDS.KNIGHT_UP_UP_RIGHT
    ],
    '$left': null,
    '$middle': null,
    '$right': null,
    '$stack': null
});

/**
 * The state manager of the board.
 * @type {State<TypeBoard>}
 * @constant
 */
const stateBoard = /** @type {State<TypeBoard>} */(new State(board));

/**
 * Gets the board.
 * @returns {TypeBoard}
 */
function getBoard() {

    return stateBoard.getState();
}

/**
 * Resets the board.
 */
function resetBoard() {

    stateBoard.setState(board);
}

/**
 * Gets the card of the left slot of the board.
 * @returns {import('../constants/cards.contants.js').TypeCard}
 */
function getCardLeft() {

    const board = stateBoard.getState();

    return board.$left;
}

/**
 * Gets the card of the middle slot of the board.
 * @returns {import('../constants/cards.contants.js').TypeCard}
 */
function getCardMiddle() {

    const board = stateBoard.getState();

    return board.$middle;
}

/**
 * Gets the card of the right slot of the board.
 * @returns {import('../constants/cards.contants.js').TypeCard}
 */
function getCardRight() {

    const board = stateBoard.getState();

    return board.$right;
}

/**
 * Draws a card to the left slot of the board.
 */
function drawCardLeft() {

    const board = window.structuredClone(getBoard());

    board.$left = board.$deck.shift();

    stateBoard.setState(board);
}

/**
 * Draws a card to the middle slot of the board.
 */
function drawCardMiddle() {

    const board = window.structuredClone(getBoard());

    board.$middle = board.$deck.shift();

    stateBoard.setState(board);
}

/**
 * Draws a card to the right slot of the board.
 */
function drawCardRight() {

    const board = window.structuredClone(getBoard());

    board.$right = board.$deck.shift();

    stateBoard.setState(board);
}

/**
 * Plays a card from the left slot of the board.
 */
function playCardLeft() {

    const board = window.structuredClone(getBoard());

    board.$stack = board.$left;
    board.$left = null;

    stateBoard.setState(board);
}

/**
 * Plays a card from the middle slot of the board.
 */
function playCardMiddle() {

    const board = window.structuredClone(getBoard());

    board.$stack = board.$middle;
    board.$middle = null;

    stateBoard.setState(board);
}

/**
 * Plays a card from the right slot of the board.
 */
function playCardRight() {

    const board = window.structuredClone(getBoard());

    board.$stack = board.$right;
    board.$right = null;

    stateBoard.setState(board);
}

/**
 * Shuffles the deck.
 */
function shuffleDeck() {

    const board = window.structuredClone(getBoard());

    UTILS.shuffle(board.$deck);

    stateBoard.setState(board);
}

/**
 * Shuffles the current card on the stack.
 */
function shuffleStack() {

    const board = window.structuredClone(getBoard());

    board.$deck.push(board.$stack);
    UTILS.shuffle(board.$deck);

    stateBoard.setState(board);
}

export {

    stateBoard,

    getBoard,
    resetBoard,

    getCardLeft,
    getCardMiddle,
    getCardRight,
    drawCardLeft,
    drawCardMiddle,
    drawCardRight,
    playCardLeft,
    playCardMiddle,
    playCardRight,
    shuffleDeck,
    shuffleStack
};
