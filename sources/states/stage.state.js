import {Stage, State} from '@theatrejs/theatrejs';

// import StagePrototype from 'stages/prototype/prototype.stage.js';
// import StagePrototype from 'stages/prototype-boss/prototype.stage.js';
// import StagePrototype from 'stages/prototype-cards/prototype.stage.js';
import StagePrototype from 'stages/prototype-knight/prototype.stage.js';
// import StagePrototype from 'stages/prototype-isometric/prototype.stage.js';
// import StagePrototype from 'stages/prototype-runner/prototype.stage.js';
// import StagePrototype from 'stages/prototype-runner-isometric/prototype.stage.js';

/**
 * The state manager of the stage.
 * @type {State<typeof Stage>}
 * @constant
 */
const stateStage = new State(StagePrototype);

/**
 * Gets the stage.
 * @returns {typeof Stage}
 */
function getStage() {

    return stateStage.getState();
}

export {

    stateStage,

    getStage
};
