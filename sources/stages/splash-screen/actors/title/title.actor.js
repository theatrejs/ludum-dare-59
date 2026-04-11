import {Actor, FACTORIES} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './title.actions.js';
import * as STATES from './title.states.js';

import * as ANIMATIONS from './spritesheets/title/title.animations.js';
import asepriteTitle from './spritesheets/title/title.aseprite';

/**
 * @typedef {import('./title.actions.js').TypeAction} TypeAction An action.
 * @private
 */

/**
 * @typedef {import('./title.states.js').TypeState} TypeState A state.
 * @private
 */

/**
 * @extends {Actor<TypeAction, TypeState>}
 */
class ActorTitle extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteTitle)
]) {

    /**
     * @typedef {import('./spritesheets/title/title.animations.js').TypeAnimation} TypeAnimationTitle An animation.
     * @private
     */

    /**
     * Stores the spritesheet.
     * @type {PLUGIN_ASEPRITE.Spritesheet<TypeAnimationTitle>}
     * @private
     */
    $spritesheet;

    /**
     * Triggers the 'idle' action.
     * @private
     */
    $actionIdle() {

        this.$spritesheet.animate(ANIMATIONS.IDLE);
    }

    /**
     * Triggers the 'start' action.
     * @private
     */
    $actionStart() {

        this.triggerState(STATES.STARTED);
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.listenAction(ACTIONS.IDLE, this.$actionIdle.bind(this));
        this.listenAction(ACTIONS.START, this.$actionStart.bind(this));

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeAnimationTitle>} **/(asepriteTitle));
        this.$spritesheet.animate(ANIMATIONS.IDLE);
    }

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        this.$spritesheet.tick($timetick);

        if (this.sprite !== this.$spritesheet.sprite) {

            this.setSprite(this.$spritesheet.sprite);
        }
    }
}

export default ActorTitle;
