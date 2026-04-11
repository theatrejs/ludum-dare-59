import {Actor, FACTORIES, Sound} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './placeholder.actions.js';
import * as STATES from './placeholder.states.js';

import * as ANIMATIONS from './spritesheets/placeholder/placeholder.animations.js';
import asepritePlaceholder from './spritesheets/placeholder/placeholder.aseprite';
import soundIdle from './sounds/idle/idle.rpp';

/**
 * @typedef {import('./placeholder.actions.js').TypeAction} TypeAction An action.
 * @private
 */

/**
 * @typedef {import('./placeholder.states.js').TypeState} TypeState A state.
 * @private
 */

/**
 * @extends {Actor<TypeAction, TypeState>}
 */
class ActorPlaceholder extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepritePlaceholder),
    FACTORIES.PreloadableSound(soundIdle)
]) {

    /**
     * @typedef {import('./spritesheets/placeholder/placeholder.animations.js').TypeAnimation} TypeAnimationPlaceholder An animation.
     * @private
     */

    /**
     * Stores the spritesheet.
     * @type {PLUGIN_ASEPRITE.Spritesheet<TypeAnimationPlaceholder>}
     * @private
     */
    $spritesheet;

    /**
     * Triggers the 'idle' action.
     * @private
     */
    $actionIdle() {

        this.$spritesheet.animate(ANIMATIONS.IDLE);

        this.addSound(new Sound({

            $audio: soundIdle,
            $loop: true,
            $volume: 0.5
        }));
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

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeAnimationPlaceholder>} **/(asepritePlaceholder));

        this.$actionIdle();
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

export default ActorPlaceholder;
