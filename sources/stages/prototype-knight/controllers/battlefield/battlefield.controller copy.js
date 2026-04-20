import {Actor, FACTORIES, Vector2} from '@theatrejs/theatrejs';

import * as CARDS from '../../constants/cards.contants.js';

import {eventbus} from '../../eventbuses/prototype/prototype.eventbus.js';
import * as EVENTS from '../../eventbuses/prototype/prototype.events.js';

import {getBoard} from '../../states/board.state.js';

import ActorPlaceholder from '../../actors/placeholder/placeholder.actor.js';

class ControllerBattlefield extends FACTORIES.ActorWithPreloadables([

    ActorPlaceholder
]) {

    /**
     * Stores the 'knight' actor.
     * @type {Actor}
     * @private
     */
    $actorKnight;

    /**
     * Triggers the 'apply card effect' action.
     */
    $actionApplyCardEffect() {

        console.log('! BATTLEFIELD', '[', getBoard().$stack, ']');

        switch (getBoard().$stack) {

            case CARDS.KNIGHT_DOWN_LEFT_LEFT: {

                this.$actorKnight.translate(new Vector2(-64, -32)); // @TODO

                break;
            }

            case CARDS.KNIGHT_DOWN_RIGHT_RIGHT: {

                this.$actorKnight.translate(new Vector2(64, -32)); // @TODO

                break;
            }

            case CARDS.KNIGHT_UP_UP_LEFT: {

                this.$actorKnight.translate(new Vector2(-32, 64)); // @TODO

                break;
            }

            case CARDS.KNIGHT_UP_UP_RIGHT: {

                this.$actorKnight.translate(new Vector2(32, 64)); // @TODO

                break;
            }
        }
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$actorKnight = this.stage.createActor(ActorPlaceholder)
        .translate(new Vector2(0, 64)); // @TODO

        eventbus.listen(EVENTS.STATE_BOARD_CARD_PLAYED, this.$actionApplyCardEffect.bind(this));
    }
}

export default ControllerBattlefield;
