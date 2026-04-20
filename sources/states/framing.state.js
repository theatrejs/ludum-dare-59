import {State, Vector2} from '@theatrejs/theatrejs';

/**
 * The state manager of the framing (rendering resolution).
 * @type {State<Vector2>}
 * @constant
 */
const stateFraming = new State(new Vector2(320 * 1.5, 240 * 1.5));

/**
 * Gets the framing (rendering resolution).
 * @returns {Vector2}
 */
function getFraming() {

    return stateFraming.getState();
}

export {

    stateFraming,

    getFraming
};
