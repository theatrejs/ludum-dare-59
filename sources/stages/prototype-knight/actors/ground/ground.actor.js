import {Actor, FACTORIES} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './ground.actions.js';
import * as STATES from './ground.states.js';

import * as ANIMATIONS from './spritesheets/ground/ground.animations.js';
import asepriteGround from './spritesheets/ground/ground.aseprite';

/**
 * @typedef {import('./ground.actions.js').TypeAction} TypeAction An action.
 * @private
 */

/**
 * @typedef {import('./ground.states.js').TypeState} TypeState A state.
 * @private
 */

/**
 * @extends {Actor<TypeAction, TypeState>}
 */
class ActorGround extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteGround)
]) {

    /**
     * @typedef {import('./spritesheets/ground/ground.animations.js').TypeAnimation} TypeAnimationGround An animation.
     * @private
     */

    /**
     * Stores the spritesheet.
     * @type {PLUGIN_ASEPRITE.Spritesheet<TypeAnimationGround>}
     * @private
     */
    $spritesheet;

    /**
     * Triggers the 'idle black' action.
     * @private
     */
    $actionIdleBlack() {

        this.$spritesheet.animate(ANIMATIONS.IDLE_BLACK);
    }

    /**
     * Triggers the 'idle white' action.
     * @private
     */
    $actionIdleWhite() {

        this.$spritesheet.animate(ANIMATIONS.IDLE_WHITE);
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

        this.listenAction(ACTIONS.IDLE_BLACK, this.$actionIdleBlack.bind(this));
        this.listenAction(ACTIONS.IDLE_WHITE, this.$actionIdleWhite.bind(this));
        this.listenAction(ACTIONS.START, this.$actionStart.bind(this));

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeAnimationGround>} **/(asepriteGround));

        this.$actionIdleBlack();
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

export default ActorGround;
