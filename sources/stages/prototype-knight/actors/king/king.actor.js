import {Actor, FACTORIES, FiniteStateMachine, Sound, UTILS, Vector2} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import {getGridHero, getGridKing, setGridKing} from '../../states/grid.state.js';

import {getEventBus} from '../../eventbuses/prototype/prototype.eventbus.js';
import * as EVENTS from '../../eventbuses/prototype/prototype.events.js';

import * as ACTIONS from './king.actions.js';
import * as STATES from './king.states.js';

import * as ANIMATIONS from './spritesheets/king/king.animations.js';
import asepriteKing from './spritesheets/king/king.aseprite';
import soundIdle from './sounds/idle/idle.rpp';
import StageSplashScreen from 'stages/splash-screen/splash-screen.stage.js';
import StagePrototype from 'stages/prototype-knight/prototype.stage.js';

import * as ACTIONS_HERO from '../../actors/hero/hero.actions.js';

/**
 * @typedef {import('./king.actions.js').TypeAction} TypeAction An action.
 * @private
 */

/**
 * @typedef {import('./king.states.js').TypeState} TypeState A state.
 * @private
 */

/**
 * The size of a grid cell.
 * @type {number}
 * @constant
 * @private
 */
const $SIZE_CELL = 32;

/**
 * @extends {Actor<TypeAction, TypeState>}
 */
class ActorKing extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteKing),
    FACTORIES.PreloadableSound(soundIdle)
]) {

    /**
     * @typedef {import('./spritesheets/king/king.animations.js').TypeAnimation} TypeAnimationKing An animation.
     * @private
     */

    /**
     * @typedef {('DRAW_ARROW' | 'FIRE' | 'WAITING')} TypeStateMachine A finite state machine state.
     */

    /**
     * Stores the finite state machine.
     * @type {FiniteStateMachine<TypeStateMachine>}
     * @private
     */
    $machine;

    /**
     * TODOOOOOOOOOOOOOOOOOOOOOO.
     * @type {boolean}
     * @private
     */
    $ready;

    /**
     * TODOOOOOOOOOOOOOOOOOOOOOO.
     * @type {boolean}
     * @private
     */
    $released;

    /**
     * Stores the spritesheet.
     * @type {PLUGIN_ASEPRITE.Spritesheet<TypeAnimationKing>}
     * @private
     */
    $spritesheet;

    /**
     * Triggers the 'attack' action.
     */
    $actionAttack() {

        this.$spritesheet.animate(ANIMATIONS.ATTACK, false);

        this.addSound(new Sound({

            $audio: soundIdle,
            $volume: 2
        }));
    }

    /**
     * Triggers the 'follow hero' action.
     */
    $actionFollowHero() {

        this.$ready = true;

        setGridKing(getGridKing().add(new Vector2(getGridHero().x, 0)));

        this.translateTo(new Vector2(this.stage.getActorWithLabel('hero').translation.x, this.translation.y));

        this.$released = true;
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

        this.$ready = false;

        this.listenAction(ACTIONS.IDLE, this.$actionIdle.bind(this));
        this.listenAction(ACTIONS.START, this.$actionStart.bind(this));

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeAnimationKing>} **/(asepriteKing));

        this.$actionIdle();

        getEventBus().listen(EVENTS.STATE_BOARD_HERO_MOVED, this.$actionFollowHero.bind(this));

        this.$machine = new FiniteStateMachine([

            {
                $state: 'WAITING',
                $transitions: [

                    {
                        $condition: () => (this.$ready === true),
                        $state: 'DRAW_ARROW'
                    }
                ]
            },
            {
                $state: 'DRAW_ARROW',
                $onLeave: () => {

                    this.$released = false;
                },
                $transitions: [

                    {
                        $condition: ({$timer}) => ($timer >= 3000),
                        $state: 'FIRE'
                    },
                    {
                        $condition: () => (this.$released === true),
                        $state: 'DRAW_ARROW'
                    }
                ]
            },
            {
                $state: 'FIRE',
                $onEnter: () => {

                    console.log('FIRE');

                    this.$actionAttack();
                    this.stage.getActorWithLabel('hero').triggerAction(ACTIONS_HERO.DIE);

                    UTILS.sleep(300).then(() => {

                        this.stage.getActorWithLabel('cameraman').triggerAction('ACTION_SHAKE');
                    });

                    getEventBus().trigger(EVENTS.STATE_BOARD_ENDED);

                    UTILS.sleep(2000).then(() => {

                        this.engine.createStage(StagePrototype);
                    });
                },
                $transitions: [

                    {
                        $condition: () => (true),
                        $state: 'DRAW_ARROW'
                    }
                ]
            }
        ]);

        this.$machine.initiate('WAITING');
    }

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        this.$spritesheet.tick($timetick);

        if (this.sprite !== this.$spritesheet.sprite) {

            this.setSprite(this.$spritesheet.sprite);
        }

        this.$machine.tick($timetick);
    }
}

export default ActorKing;
