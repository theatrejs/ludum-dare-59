import {Actor, FACTORIES, Sound} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './ui-button.actions.js';
import * as STATES from './ui-button.states.js';

import * as ANIMATIONS from './spritesheets/ui-button/ui-button.animations.js';
import asepriteUiButton from './spritesheets/ui-button/ui-button.aseprite';
import fontTheatre from './fonts/theatrejs/theatrejs.font.aseprite';
import soundActivate from './sounds/activate/activate.rpp';
import soundSelect from './sounds/select/select.rpp';

/**
 * Prepares a 'ui-button' actor with text.
 * @param {string} [$text] The text.
 * @returns {typeof Actor<TypeAction, TypeState>}
 */
function FactoryActorUiButton($text = '') {

    /**
     * @typedef {import('./ui-button.actions.js').TypeAction} TypeAction An action.
     * @private
     */

    /**
     * @typedef {import('./ui-button.states.js').TypeState} TypeState A state.
     * @private
     */

    /**
     * @extends {Actor<TypeAction, TypeState>}
     */
    class ActorUiButton extends FACTORIES.ActorWithPreloadables ([

        PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteUiButton),
        PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(fontTheatre),
        FACTORIES.PreloadableSound(soundActivate),
        FACTORIES.PreloadableSound(soundSelect)
    ]) {

        /**
         * @typedef {import('./spritesheets/ui-button/ui-button.animations.js').TypeAnimation} TypeAnimationUiButton An animation.
         * @private
         */

        /**
         * Stores the spritesheet.
         * @type {PLUGIN_ASEPRITE.Spritesheet<TypeAnimationUiButton>}
         * @private
         */
        $spritesheet;

        /**
         * Stores the text actor.
         * @type {Actor}
         * @private
         */
        $text;

        /**
         * Triggers the 'activate' action.
         * @private
         */
        $actionActivate() {

            this.$spritesheet.animate(ANIMATIONS.ACTIVATE, false);

            this.addSound(new Sound({

                $audio: soundActivate,
                $volume: 0.5
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
         * Triggers the 'select' action.
         * @private
         */
        $actionSelect() {

            this.$spritesheet.animate(ANIMATIONS.SELECT, false);

            this.addSound(new Sound({

                $audio: soundSelect,
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

            this.listenAction(ACTIONS.ACTIVATE, this.$actionActivate.bind(this));
            this.listenAction(ACTIONS.IDLE, this.$actionIdle.bind(this));
            this.listenAction(ACTIONS.SELECT, this.$actionSelect.bind(this));
            this.listenAction(ACTIONS.START, this.$actionStart.bind(this));

            this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeAnimationUiButton>} **/(asepriteUiButton));

            this.$text = this.stage.createActor(PLUGIN_ASEPRITE.FACTORIES.ActorWithText({

                $font: fontTheatre,
                $text: $text,
                $spacingCharacters: 1
            }));

            this.$text.mimic(this);

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

    return ActorUiButton;
}

export default FactoryActorUiButton;
