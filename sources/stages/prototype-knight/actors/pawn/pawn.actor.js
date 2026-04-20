import {Actor, FACTORIES, Sound, UTILS} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './pawn.actions.js';
import * as STATES from './pawn.states.js';

import * as ANIMATIONS from './spritesheets/pawn/pawn.animations.js';
import asepritePawn from './spritesheets/pawn/pawn.aseprite';
import soundAttack from './sounds/attack/attack.rpp';
import soundIdle from './sounds/idle/idle.rpp';
import soundDie from './sounds/die/die.rpp';

/**
 * @typedef {import('./pawn.actions.js').TypeAction} TypeAction An action.
 * @private
 */

/**
 * @typedef {import('./pawn.states.js').TypeState} TypeState A state.
 * @private
 */

/**
 * @extends {Actor<TypeAction, TypeState>}
 */
class ActorPawn extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepritePawn),
    FACTORIES.PreloadableSound(soundIdle),
    FACTORIES.PreloadableSound(soundAttack),
    FACTORIES.PreloadableSound(soundDie)
]) {

    /**
     * @typedef {import('./spritesheets/pawn/pawn.animations.js').TypeAnimation} TypeAnimationPawn An animation.
     * @private
     */

    /**
     * Stores the spritesheet.
     * @type {PLUGIN_ASEPRITE.Spritesheet<TypeAnimationPawn>}
     * @private
     */
    $spritesheet;

    /**
     * Triggers the 'attack' action.
     * @private
     */
    $actionAttack() {

        this.$spritesheet.animate(ANIMATIONS.ATTACK, false);

        this.addSound(new Sound({

            $audio: soundAttack,
            $volume: 0.5
        }));
    }

    /**
     * Triggers the 'die' action.
     * @private
     */
    $actionDie() {

        this.$spritesheet.animate(ANIMATIONS.DIE);

        this.addSound(new Sound({

            $audio: soundDie,
            $volume: 0.5
        }));
    }

    /**
     * Triggers the 'idle' action.
     * @private
     */
    $actionIdle() {

        this.$spritesheet.animate(ANIMATIONS.IDLE);

        // this.addSound(new Sound({

        //     $audio: soundIdle,
        //     $loop: true,
        //     $volume: 0.5
        // }));
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

        this.listenAction(ACTIONS.ATTACK, this.$actionAttack.bind(this));
        this.listenAction(ACTIONS.DIE, this.$actionDie.bind(this));
        this.listenAction(ACTIONS.IDLE, this.$actionIdle.bind(this));
        this.listenAction(ACTIONS.START, this.$actionStart.bind(this));

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeAnimationPawn>} **/(asepritePawn));

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

export default ActorPawn;
