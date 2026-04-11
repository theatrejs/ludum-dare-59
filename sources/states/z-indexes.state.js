import {State} from '@theatrejs/theatrejs';

const zIndexes = Object.freeze({

    'background': -1000,
    'origin': 0,
    'interface': 1000
});

/**
 * The state manager of the z-index map.
 * @type {State<typeof zIndexes>}
 * @constant
 */
const stateZIndexes = new State(zIndexes);

/**
 * Gets the z-index of the 'background' actors.
 * @returns {number}
 */
function getZIndexBackground() {

    return stateZIndexes.getState().background;
}

/**
 * Gets the z-index of the 'interface' actors.
 * @returns {number}
 */
function getZIndexInterface() {

    return stateZIndexes.getState().interface;
}

/**
 * Gets the z-index of the 'origin' actors.
 * @returns {number}
 */
function getZIndexOrigin() {

    return stateZIndexes.getState().origin;
}

export {

    stateZIndexes,

    getZIndexBackground,
    getZIndexInterface,
    getZIndexOrigin
};
