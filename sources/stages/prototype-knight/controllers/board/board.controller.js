import {Actor, FACTORIES, FiniteStateMachine, INPUT_CODES, Sound, Vector2} from '@theatrejs/theatrejs';

import * as CARDS from '../../constants/cards.contants.js';
import * as DURATIONS from '../../constants/durations.contants.js';

import {getEventBus, resetEventBus} from '../../eventbuses/prototype/prototype.eventbus.js';
import * as EVENTS from '../../eventbuses/prototype/prototype.events.js';

import {drawCardLeft, drawCardMiddle, drawCardRight, getBoard, getCardLeft, getCardMiddle, getCardRight, playCardLeft, playCardMiddle, playCardRight, resetBoard, shuffleDeck, shuffleStack} from '../../states/board.state.js';

import FactoryActorCard from '../../actors/card/card.factory.js';
import ActorGrid from '../../actors/grid/grid.actor.js';
import { getZIndexInterface } from 'states/z-indexes.state.js';

import soundAmbiant from './sounds/ambiant/ambiant.rpp';
import soundDraw from '../../actors/card/sounds/draw/draw.rpp';

class ControllerBoard extends FACTORIES.ActorWithPreloadables([

    FactoryActorCard(CARDS.KNIGHT_DOWN_LEFT_LEFT),
    FactoryActorCard(CARDS.KNIGHT_DOWN_RIGHT_RIGHT),
    FactoryActorCard(CARDS.KNIGHT_UP_UP_LEFT),
    FactoryActorCard(CARDS.KNIGHT_UP_UP_RIGHT),
    FACTORIES.PreloadableSound(soundAmbiant),
    FACTORIES.PreloadableSound(soundDraw),
]) {

    /**
     * @typedef {('DRAW_LEFT' | 'DRAW_MIDDLE' | 'DRAW_RIGHT' | 'IDLE' | 'PLAY_LEFT' | 'PLAY_MIDDLE' | 'PLAY_RIGHT')} TypeStateMachine A finite state machine state.
     */

    /**
     * Stores the 'card' actor on the left slot.
     * @type {Actor}
     * @private
     */
    $actorCardLeft;

    /**
     * Stores the 'card' actor on the middle slot.
     * @type {Actor}
     * @private
     */
    $actorCardMiddle;

    /**
     * Stores the 'card' actor on the right slot.
     * @type {Actor}
     * @private
     */
    $actorCardRight;

    /**
     * Stores the finite state machine.
     * @type {FiniteStateMachine<TypeStateMachine>}
     * @private
     */
    $machine;

    /**
     * Triggers the 'idle enter' action.
     */
    $actionIdleEnter() {

        console.log('~ BOARD - IDLE');

        console.log('[', getBoard().$left, getBoard().$middle, getBoard().$right, ']');

        getEventBus().trigger(EVENTS.STATE_BOARD_READY);
    }

    /**
     * Triggers the 'draw card left enter' action.
     */
    $actionDrawCardLeftEnter() {

        console.log('< BOARD - DRAW CARD LEFT');
    }

    /**
     * Triggers the 'draw card left leave' action.
     */
    $actionDrawCardLeftLeave() {

        console.log('< BOARD - SHUFFLE');

        drawCardLeft();

        this.$actorCardLeft = this.stage.createActor(FactoryActorCard(getCardLeft()))
        .translateTo(this.translation.clone()).translateX(-72)
        .setZIndex(this.zIndex)
        .setLabel('card-left')
        .follow(this);

        this.addSound(new Sound({

            $audio: soundDraw,
            $volume: 2
        }));

        getEventBus().trigger(EVENTS.ACTION_BOARD_DRAW_CARD_LEFT);

        shuffleStack();
    }

    /**
     * Triggers the 'draw card middle enter' action.
     */
    $actionDrawCardMiddleEnter() {

        console.log('< BOARD - DRAW CARD MIDDLE');
    }

    /**
     * Triggers the 'draw card middle leave' action.
     */
    $actionDrawCardMiddleLeave() {

        console.log('< BOARD - SHUFFLE');

        drawCardMiddle();

        this.$actorCardMiddle = this.stage.createActor(FactoryActorCard(getCardMiddle()))
        .translateTo(this.translation.clone()).translateX(0)
        .setZIndex(this.zIndex)
        .setLabel('card-middle')
        .follow(this);

        this.addSound(new Sound({

            $audio: soundDraw,
            $volume: 2
        }));

        getEventBus().trigger(EVENTS.ACTION_BOARD_DRAW_CARD_MIDDLE);

        shuffleStack();
    }

    /**
     * Triggers the 'draw card right enter' action.
     */
    $actionDrawCardRightEnter() {

        console.log('< BOARD - DRAW CARD RIGHT');
    }

    /**
     * Triggers the 'draw card right leave' action.
     */
    $actionDrawCardRightLeave() {

        console.log('< BOARD - SHUFFLE');

        drawCardRight();

        this.$actorCardRight = this.stage.createActor(FactoryActorCard(getCardRight()))
        .translateTo(this.translation.clone()).translateX(72)
        .setZIndex(this.zIndex)
        .setLabel('card-right')
        .follow(this);

        this.addSound(new Sound({

            $audio: soundDraw,
            $volume: 2
        }));

        getEventBus().trigger(EVENTS.ACTION_BOARD_DRAW_CARD_RIGHT);

        shuffleStack();
    }

    /**
     * Triggers the 'play card left enter' action.
     */
    $actionPlayCardLeftEnter() {

        console.log('> BOARD - PLAY CARD LEFT');

        playCardLeft();

        this.stage.removeActor(this.$actorCardLeft);

        getEventBus().trigger(EVENTS.ACTION_BOARD_PLAY_CARD_LEFT);
    }

    /**
     * Triggers the 'play card left leave' action.
     */
    $actionPlayCardLeftLeave() {

        console.log('! BOARD - CARD PLAYED');

        getEventBus().trigger(EVENTS.STATE_BOARD_CARD_PLAYED);
    }

    /**
     * Triggers the 'play card middle enter' action.
     */
    $actionPlayCardMiddleEnter() {

        console.log('> BOARD - PLAY CARD MIDDLE');

        playCardMiddle();

        this.stage.removeActor(this.$actorCardMiddle);

        getEventBus().trigger(EVENTS.ACTION_BOARD_PLAY_CARD_MIDDLE);
    }

    /**
     * Triggers the 'play card middle leave' action.
     */
    $actionPlayCardMiddleLeave() {

        console.log('! BOARD - CARD PLAYED');

        getEventBus().trigger(EVENTS.STATE_BOARD_CARD_PLAYED);
    }

    /**
     * Triggers the 'play card right enter' action.
     */
    $actionPlayCardRightEnter() {

        console.log('> BOARD - PLAY CARD RIGHT');

        playCardRight();

        this.stage.removeActor(this.$actorCardRight);

        getEventBus().trigger(EVENTS.ACTION_BOARD_PLAY_CARD_RIGHT);
    }

    /**
     * Triggers the 'play card right leave' action.
     */
    $actionPlayCardRightLeave() {

        console.log('! BOARD - CARD PLAYED');

        getEventBus().trigger(EVENTS.STATE_BOARD_CARD_PLAYED);
    }

    /**
     * Checks the status of the commands for playing the left card.
     * @returns {boolean}
     * @private
     */
    $getCommandPlayCardLeft() {

        if (this.engine.getInput(INPUT_CODES.POINTER.POINT) === true) {

            const cursor = this.engine.getTranslationFromScreen(new Vector2(

                this.engine.getInputAnalog(INPUT_CODES.POINTER.POSITION_X),
                this.engine.getInputAnalog(INPUT_CODES.POINTER.POSITION_Y)
            ));

            const target = this.engine.raycast(cursor)
            .find(($target) => ($target.label === 'card-left'));

            if (typeof target !== 'undefined') {

                return true;
            }
        }

        return this.engine.getInput(INPUT_CODES.GAMEPAD_XBOX.X)
        || this.engine.getInput(INPUT_CODES.KEYBOARD_AZERTY.DIGIT_1)
        || this.engine.getInput(INPUT_CODES.KEYBOARD_AZERTY.LEFT);
    }

    /**
     * Checks the status of the commands for playing the middle card.
     * @returns {boolean}
     * @private
     */
    $getCommandPlayCardMiddle() {

        if (this.engine.getInput(INPUT_CODES.POINTER.POINT) === true) {

            const cursor = this.engine.getTranslationFromScreen(new Vector2(

                this.engine.getInputAnalog(INPUT_CODES.POINTER.POSITION_X),
                this.engine.getInputAnalog(INPUT_CODES.POINTER.POSITION_Y)
            ));

            const target = this.engine.raycast(cursor)
            .find(($target) => ($target.label === 'card-middle'));

            if (typeof target !== 'undefined') {

                return true;
            }
        }

        return this.engine.getInput(INPUT_CODES.GAMEPAD_XBOX.A)
        || this.engine.getInput(INPUT_CODES.KEYBOARD_AZERTY.DIGIT_2)
        || this.engine.getInput(INPUT_CODES.KEYBOARD_AZERTY.UP);
    }

    /**
     * Checks the status of the commands for playing the right card.
     * @returns {boolean}
     * @private
     */
    $getCommandPlayCardRight() {

        if (this.engine.getInput(INPUT_CODES.POINTER.POINT) === true) {

            const cursor = this.engine.getTranslationFromScreen(new Vector2(

                this.engine.getInputAnalog(INPUT_CODES.POINTER.POSITION_X),
                this.engine.getInputAnalog(INPUT_CODES.POINTER.POSITION_Y)
            ));

            console.log(this.engine.raycast(cursor))

            const target = this.engine.raycast(cursor)
            .find(($target) => ($target.label === 'card-right'));

            if (typeof target !== 'undefined') {

                return true;
            }
        }

        return this.engine.getInput(INPUT_CODES.GAMEPAD_XBOX.B)
        || this.engine.getInput(INPUT_CODES.KEYBOARD_AZERTY.DIGIT_3)
        || this.engine.getInput(INPUT_CODES.KEYBOARD_AZERTY.RIGHT);
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.addSound(new Sound({

            $audio: soundAmbiant,
            $loop: true,
            $volume: 0.25
        }));

        this.$stateEnded = false;

        resetBoard();

        shuffleDeck();

        drawCardLeft();
        drawCardMiddle();
        drawCardRight();

        this.$actorCardLeft = this.stage.createActor(FactoryActorCard(getCardLeft()))
        .translateX(-72)
        .setLabel('card-left')
        .mimic(this); // @TODO

        this.$actorCardMiddle = this.stage.createActor(FactoryActorCard(getCardMiddle()))
        .translateX(0)
        .setLabel('card-middle')
        .mimic(this); // @TODO

        this.$actorCardRight = this.stage.createActor(FactoryActorCard(getCardRight()))
        .translateX(72)
        .setLabel('card-right')
        .mimic(this); // @TODO

        this.$machine = new FiniteStateMachine([

            {
                $state: 'IDLE',
                $onEnter: () => this.$actionIdleEnter(),
                $transitions: [

                    {
                        $condition: () => (this.$getCommandPlayCardLeft() === true),
                        $state: 'PLAY_LEFT'
                    },
                    {
                        $condition: () => (this.$getCommandPlayCardMiddle() === true),
                        $state: 'PLAY_MIDDLE'
                    },
                    {
                        $condition: () => (this.$getCommandPlayCardRight() === true),
                        $state: 'PLAY_RIGHT'
                    }
                ]
            },
            {
                $state: 'PLAY_LEFT',
                $onEnter: () => this.$actionPlayCardLeftEnter(),
                $onLeave: () => this.$actionPlayCardLeftLeave(),
                $transitions: [

                    {
                        $condition: ({$timer}) => ($timer >= DURATIONS.CARD_PLAY),
                        $state: 'DRAW_LEFT'
                    }
                ]
            },
            {
                $state: 'DRAW_LEFT',
                $onEnter: () => this.$actionDrawCardLeftEnter(),
                $onLeave: () => this.$actionDrawCardLeftLeave(),
                $transitions: [

                    {
                        $condition: ({$timer}) => (

                            $timer >= DURATIONS.CARD_DRAW
                            && this.$getCommandPlayCardLeft() === false
                        ),
                        $state: 'IDLE'
                    }
                ]
            },
            {
                $state: 'PLAY_MIDDLE',
                $onEnter: () => this.$actionPlayCardMiddleEnter(),
                $onLeave: () => this.$actionPlayCardMiddleLeave(),
                $transitions: [

                    {
                        $condition: ({$timer}) => ($timer >= DURATIONS.CARD_PLAY),
                        $state: 'DRAW_MIDDLE'
                    }
                ]
            },
            {
                $state: 'DRAW_MIDDLE',
                $onEnter: () => this.$actionDrawCardMiddleEnter(),
                $onLeave: () => this.$actionDrawCardMiddleLeave(),
                $transitions: [

                    {
                        $condition: ({$timer}) => (

                            $timer >= DURATIONS.CARD_DRAW
                            && this.$getCommandPlayCardMiddle() === false
                        ),
                        $state: 'IDLE'
                    }
                ]
            },
            {
                $state: 'PLAY_RIGHT',
                $onEnter: () => this.$actionPlayCardRightEnter(),
                $onLeave: () => this.$actionPlayCardRightLeave(),
                $transitions: [

                    {
                        $condition: ({$timer}) => ($timer >= DURATIONS.CARD_PLAY),
                        $state: 'DRAW_RIGHT'
                    }
                ]
            },
            {
                $state: 'DRAW_RIGHT',
                $onEnter: () => this.$actionDrawCardRightEnter(),
                $onLeave: () => this.$actionDrawCardRightLeave(),
                $transitions: [

                    {
                        $condition: ({$timer}) => (

                            $timer >= DURATIONS.CARD_DRAW
                            && this.$getCommandPlayCardRight() === false
                        ),
                        $state: 'IDLE'
                    }
                ]
            }
        ]);

        this.$machine.initiate('IDLE');

        getEventBus().listen(EVENTS.STATE_BOARD_ENDED, () => {

            this.$stateEnded = true;
        });
    }

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        if (this.$stateEnded === false) {

            this.$machine.tick($timetick);
        }

        this.translateTo(this.engine.getBoundariesFromFraming().boundaryBottom)
        .setZIndex(getZIndexInterface());
    }
}

export default ControllerBoard;
