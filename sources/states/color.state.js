import {State, Vector3} from '@theatrejs/theatrejs';

/**
 * The state manager of the color.
 * @type {State<Vector3>}
 * @constant
 */
const stateColor = new State(new Vector3(25 / 255, 12 / 255, 18 / 255));

/**
 * Gets the color.
 * @returns {Vector3}
 */
function getColor() {

    return stateColor.getState();
}

export {

    stateColor,

    getColor
};
