import {EventBus, State} from '@theatrejs/theatrejs';

/**
 * The state manager of event bus.
 * @type {State<EventBus>}
 * @constant
 */
const stateEventBus = new State(new EventBus());

/**
 * Gets the event bus.
 * @returns {EventBus}
 */
function getEventBus() {

    return stateEventBus.getState();
}

/**
 * Resets the event bus.
 */
function resetEventBus() {

    stateEventBus.setState(new EventBus());
}

export {

    stateEventBus,

    getEventBus,
    resetEventBus
};
