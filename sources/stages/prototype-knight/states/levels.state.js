import {State} from '@theatrejs/theatrejs';
import * as LEVELS from '../levels/prototype/prototype.levels.js';

/**
 * @type {Array<import('../levels/prototype/prototype.levels.js').TypeLevel>}
 */
const levels = [

    LEVELS.ZERO,
    LEVELS.FIRST,
    LEVELS.THIRD,
    LEVELS.FOURTH,
    LEVELS.FIFTH,
    LEVELS.SIXTH,
    LEVELS.SEVENTH,
];

/**
 * The state manager of the levels.
 * @type {State<typeof levels>}
 * @constant
 */
const stateLevels = new State(levels);

/**
 * Gets the first level.
 * @returns {import('../levels/prototype/prototype.levels.js').TypeLevel}
 */
function getFirstLevel() {

    const levels = stateLevels.getState();

    return levels[0];
}

/**
 * Gets the next level.
 * @returns {import('../levels/prototype/prototype.levels.js').TypeLevel | undefined}
 */
function getNextLevel() {

    const levels = stateLevels.getState();
    const current = stateLevelCurrent.getState();

    return levels[levels.indexOf(current) + 1];
}

/**
 * The state manager of the levels.
 * @type {State<import('../levels/prototype/prototype.levels.js').TypeLevel>}
 * @constant
 */
const stateLevelCurrent = new State(getFirstLevel());

export {

    stateLevelCurrent,
    stateLevels,

    getFirstLevel,
    getNextLevel
};
