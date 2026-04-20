import {Actor, FACTORIES, Sound, Vibration} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './hero.actions.js';
import * as STATES from './hero.states.js';

import * as ANIMATIONS from './spritesheets/hero/hero.animations.js';
import asepriteHero from './spritesheets/hero/hero.aseprite';
import audioBlast from './sounds/blast/blast.rpp';
import audioMove from './sounds/move/move.rpp';

/**
 * @typedef {import('./hero.actions.js').TypeAction} TypeAction An action.
 * @private
 */

/**
 * @typedef {import('./hero.states.js').TypeState} TypeState A state.
 * @private
 */

/**
 * @extends {Actor<TypeAction, TypeState>}
 */
class ActorHero extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteHero),
    FACTORIES.PreloadableSound(audioBlast),
    FACTORIES.PreloadableSound(audioMove),
]) {

    /**
     * @typedef {import('./spritesheets/hero/hero.animations.js').TypeAnimation} TypeAnimationHero An animation.
     * @private
     */

    /**
     * Stores the spritesheet.
     * @type {PLUGIN_ASEPRITE.Spritesheet<TypeAnimationHero>}
     * @private
     */
    $spritesheet;

    /**
     * Triggers the 'die' action.
     * @private
     */
    $actionDie() {

        this.$spritesheet.animate(ANIMATIONS.DIE, false);

        this.addSound(new Sound({

            $audio: audioBlast,
            $volume: 2
        }));
    }

    /**
     * Triggers the 'move' action.
     * @private
     */
    $actionMove() {

        this.addSound(new Sound({

            $audio: audioMove,
            $volume: 1
        }));
    }

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

        this.listenAction(ACTIONS.DIE, this.$actionDie.bind(this));
        this.listenAction(ACTIONS.IDLE, this.$actionIdle.bind(this));
        this.listenAction(ACTIONS.MOVE, this.$actionMove.bind(this));
        this.listenAction(ACTIONS.START, this.$actionStart.bind(this));

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeAnimationHero>} **/(asepriteHero));

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

export default ActorHero;
