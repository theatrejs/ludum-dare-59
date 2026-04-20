import {Actor, FACTORIES} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as CARDS from '../../constants/cards.contants.js';

import * as ANIMATIONS from './spritesheets/card/card.animations.js';
import asepriteCard from './spritesheets/card/card.aseprite';

/**
 * Prepares a 'card' actor.
 * @param {import('../../constants/cards.contants.js').TypeCard} $type The type.
 * @returns {typeof Actor<TypeAction, TypeState>}
 */
function FactoryActorCard($type) {

    /**
     * @typedef {import('./card.actions.js').TypeAction} TypeAction An action.
     * @private
     */

    /**
     * @typedef {import('./card.states.js').TypeState} TypeState A state.
     * @private
     */

    /**
     * @extends {Actor<TypeAction, TypeState>}
     */
    class ActorCard extends FACTORIES.ActorWithPreloadables ([

        PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteCard)
    ]) {

        /**
         * @typedef {import('./spritesheets/card/card.animations.js').TypeAnimation} TypeAnimationUiButton An animation.
         * @private
         */

        /**
         * Stores the spritesheet.
         * @type {PLUGIN_ASEPRITE.Spritesheet<TypeAnimationUiButton>}
         * @private
         */
        $spritesheet;

        /**
         * @type {Actor['onCreate']}
         */
        onCreate() {

            this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeAnimationUiButton>} **/(asepriteCard));

            switch ($type) {

                case CARDS.KNIGHT_DOWN_LEFT_LEFT: {

                    this.$spritesheet.animate(ANIMATIONS.KNIGHT_DOWN_LEFT_LEFT);

                    break;
                }

                case CARDS.KNIGHT_DOWN_RIGHT_RIGHT: {

                    this.$spritesheet.animate(ANIMATIONS.KNIGHT_DOWN_RIGHT_RIGHT);

                    break;
                }

                case CARDS.KNIGHT_UP_UP_LEFT: {

                    this.$spritesheet.animate(ANIMATIONS.KNIGHT_UP_UP_LEFT);

                    break;
                }

                case CARDS.KNIGHT_UP_UP_RIGHT: {

                    this.$spritesheet.animate(ANIMATIONS.KNIGHT_UP_UP_RIGHT);

                    break;
                }
            }
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

    return ActorCard;
}

export default FactoryActorCard;
