import {Actor, FACTORIES, FiniteStateMachine, INPUT_CODES, Vector2, Vibration} from '@theatrejs/theatrejs';

import * as URLS from 'constants/urls.constants.js'

import {getZIndexBackground, getZIndexInterface} from 'states/z-indexes.state.js';

import StageSplashScreen from 'stages/splash-screen/splash-screen.stage.js';

import ActorCameraman from 'actors/cameraman/cameraman.actor.js';
import * as ACTIONS_CAMERAMAN from 'actors/cameraman/cameraman.actions.js';
import FactoryActorUiButton from 'actors/ui-button/ui-button.factory.js';
import * as ACTIONS_UI_BUTTON_LUDUM_DARE from 'actors/ui-button/ui-button.actions.js';

import ActorTitle from '../../actors/title/title.actor.js';

const ActorUiButtonLudumDare = FactoryActorUiButton('Ludum Dare');

class ControllerCredits extends FACTORIES.ActorWithPreloadables([

    ActorCameraman,
    ActorTitle,
    ActorUiButtonLudumDare
]) {

    /**
     * @typedef {('ACTIVATED' | 'ENTERING' | 'IDLE' | 'LEAVING' | 'LEFT' | 'LOADING')} TypeStateMachine A finite state machine state.
     */

    /**
     * Stores the 'cameraman' actor.
     * @type {ActorCameraman}
     * @private
     */
    $actorCameraman;

    /**
     * Stores the 'game title' actor.
     * @type {Actor}
     * @private
     */
    $actorTitle;

    /**
     * Stores the 'ui button ludum dare' actor.
     * @type {Actor}
     * @private
     */
    $actorUiButtonLudumDare;

    /**
     * Stores the finite state machine.
     * @type {FiniteStateMachine<TypeStateMachine>}
     * @private
     */
    $machine;

    /**
     * Stores the preloaded status of the next stage.
     * @type {boolean}
     * @private
     */
    $preloaded;

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$preloaded = false;

        this.engine.preloadStage(StageSplashScreen).then(() => {

            this.$preloaded = true;
        });

        const $DEBOUNCE_ACTIVATION = 400;
        const $DEBOUNCE_STAGE = 2000;
        const $DEBOUNCE_TRANSITION = 800;

        this.$machine = new FiniteStateMachine([

            {
                $state: 'LOADING',
                $transitions: [

                    {
                        $state: 'ENTERING',
                        $condition: ({$timer}) => ($timer >= $DEBOUNCE_STAGE)
                    }
                ]
            },
            {
                $state: 'ENTERING',
                $onEnter: () => {

                    this.$actorCameraman = /** @type {ActorCameraman} */(this.stage.createActor(ActorCameraman));
                    this.stage.setPointOfView(this.$actorCameraman.camera);

                    this.$actorTitle = this.stage.createActor(ActorTitle)
                    .setZIndex(getZIndexBackground())
                    .mimic(this);
                },
                $transitions: [

                    {
                        $state: 'IDLE',
                        $condition: ({$timer}) => ($timer >= $DEBOUNCE_TRANSITION)
                    }
                ]
            },
            {
                $state: 'IDLE',
                $onEnter: () => {

                    this.$actorUiButtonLudumDare = this.stage.createActor(ActorUiButtonLudumDare)
                    .setComponent('target')
                    .setZIndex(getZIndexInterface())
                    .mimic(this);

                    this.$actorUiButtonLudumDare.triggerAction(ACTIONS_UI_BUTTON_LUDUM_DARE.SELECT);
                },
                $transitions: [

                    {
                        $state: 'ACTIVATED',
                        $condition: () => {

                            if (this.engine.getInput(INPUT_CODES.POINTER.POINT) === true) {

                                const cursor = this.engine.getTranslationFromScreen(new Vector2(

                                    this.engine.getInputAnalog(INPUT_CODES.POINTER.POSITION_X),
                                    this.engine.getInputAnalog(INPUT_CODES.POINTER.POSITION_Y)
                                ));

                                const target = this.engine.raycast(cursor)
                                .find(($target) => ($target.hasComponent('target') === true));

                                if (target === this.$actorUiButtonLudumDare) {

                                    return true;
                                }
                            }

                            return (

                                this.engine.getInput(INPUT_CODES.GAMEPAD_XBOX.A) === true
                                || this.engine.getInput(INPUT_CODES.GAMEPAD_XBOX.START) === true
                                || this.engine.getInput(INPUT_CODES.KEYBOARD_AZERTY.ENTER) === true
                                || this.engine.getInput(INPUT_CODES.KEYBOARD_AZERTY.SPACE) === true
                            );
                        }
                    }
                ]
            },
            {
                $state: 'ACTIVATED',
                $onEnter: () => {

                    this.$actorUiButtonLudumDare.triggerAction(ACTIONS_UI_BUTTON_LUDUM_DARE.ACTIVATE);
                    this.$actorCameraman.triggerAction(ACTIONS_CAMERAMAN.SHAKE);

                    this.addVibration(new Vibration({

                        $duration: 100,
                        $intensityFrequencyHigh: 0.5,
                        $intensityFrequencyLow: 0.5
                    }));
                },
                $onTick: ({$timer}) => {

                    if ($timer >= $DEBOUNCE_ACTIVATION && this.$actorUiButtonLudumDare.visible === true) {

                        this.$actorUiButtonLudumDare.setVisible(false);
                    }
                },
                $transitions: [

                    {
                        $state: 'LEAVING',
                        $condition: ({$timer}) => ($timer >= $DEBOUNCE_ACTIVATION + $DEBOUNCE_TRANSITION)
                    }
                ]
            },
            {
                $state: 'LEAVING',
                $onEnter: () => {

                    this.$actorTitle.setVisible(false);

                    window.open(URLS.LUDUM_DARE);
                },
                $transitions: [

                    {
                        $state: 'LEFT',
                        $condition: () => (this.$preloaded === true)
                    }
                ]
            },
            {
                $state: 'LEFT',
                $onEnter: () => {

                    this.engine.createStage(StageSplashScreen);
                }
            }
        ]);

        this.$machine.initiate('LOADING');
    }

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        this.$machine.tick($timetick);
    }
}

export default ControllerCredits;
