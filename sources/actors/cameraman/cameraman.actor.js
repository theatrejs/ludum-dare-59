import {Actor, Curve, CURVES, Vector2} from '@theatrejs/theatrejs';

import * as ACTIONS from './cameraman.actions.js';

/**
 * The shake amplitude.
 * @type {number}
 * @constant
 * @private
 */
const $AMPLITUDE_SHAKE = 4;

/**
 * The shake duration.
 * @type {number}
 * @constant
 * @private
 */
const $DURATION_SHAKE = 200;

/**
 * The travelling duration.
 * @type {number}
 * @constant
 * @private
 */
const $DURATION_TRAVELLING = 1600;

/**
 * @extends {Actor<(ACTIONS.DISABLE_TRAVELLING | ACTIONS.ENABLE_TRAVELLING | ACTIONS.SHAKE), undefined>}
 */
class ActorCameraman extends Actor {

    /**
     * Stores the 'arm' actor.
     * @type {Actor}
     * @private
     */
    $arm;

    /**
     * Stores the 'camera' actor.
     * @type {Actor}
     * @private
     */
    $camera;

    /**
     * Stores the accumulated delta rounding during the translations of the 'travelling' action.
     * @type {Vector2}
     * @private
     */
    $deltaRounding;

    /**
     * Stores the elapsed time for the 'shaking' action.
     * @type {number}
     * @private
     */
    $elapsedTimeShaking;

    /**
     * Stores the elapsed time for the 'travelling' action.
     * @type {number}
     * @private
     */
    $elapsedTimeTravelling;

    /**
     * Stores the current 'shaked' translation.
     * @type {Vector2}
     * @private
     */
    $shake;

    /**
     * Stores the 'shaking' status.
     * @type {boolean}
     * @private
     */
    $shaking;

    /**
     * Stores the 'travelling' translation.
     * @type {Vector2}
     * @private
     */
    $travel;

    /**
     * Stores the 'travelling' status.
     * @type {boolean}
     * @private
     */
    $travelling;

    /**
     * Gets the 'arm' actor.
     * @type {Actor}
     * @public
     */
    get arm() {

        return this.$arm;
    }

    /**
     * Gets the 'camera' actor.
     * @type {Actor}
     * @public
     */
    get camera() {

        return this.$camera;
    }

    /**
     * Triggers the 'disable travelling' action.
     * @private
     */
    $actionDisableTravelling() {

        this.$arm.translateTo(this.translation);
        this.$camera.translateTo(this.$arm.translation.clone().add(this.$shake));

        this.$travelling = false;
        this.$elapsedTimeTravelling = 0;
        this.$move = new Vector2(0, 0);
    }

    /**
     * Triggers the 'enable travelling' action.
     * @private
     */
    $actionEnableTravelling() {

        this.$travelling = true;
    }

    /**
     * Triggers the 'shake' action.
     * @private
     */
    $actionShake() {

        this.$elapsedTimeShaking = 0;
        this.$shaking = true;
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$arm = new Actor(this.stage);
        this.$camera = new Actor(this.stage);

        this.$elapsedTimeShaking = 0;
        this.$elapsedTimeTravelling = 0;

        this.$shake = new Vector2(0, 0);
        this.$travel = new Vector2(0, 0);

        this.$deltaRounding = new Vector2(0, 0);

        this.$shaking = false;
        this.$travelling = false;

        this.listenAction(ACTIONS.DISABLE_TRAVELLING, this.$actionDisableTravelling.bind(this));
        this.listenAction(ACTIONS.ENABLE_TRAVELLING, this.$actionEnableTravelling.bind(this));
        this.listenAction(ACTIONS.SHAKE, this.$actionShake.bind(this));

        this.$actionDisableTravelling();
    }

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        if (this.$travelling === true) {

            this.$elapsedTimeTravelling += $timetick;

            if (this.$elapsedTimeTravelling < $DURATION_TRAVELLING) {

                const translation = this.$travel.clone().scale(

                    new Curve(CURVES.easeOut(4))
                    .setDuration($DURATION_TRAVELLING)
                    .getProgress(this.$elapsedTimeTravelling - $timetick, this.$elapsedTimeTravelling)
                );

                this.$arm.translate(translation.clone().add(this.$deltaRounding).round());
                this.$deltaRounding = translation.clone().add(this.$deltaRounding).subtract(translation.clone().add(this.$deltaRounding).round())
            }

            else {

                this.$arm.translateTo(this.translation);
                this.$deltaRounding = new Vector2(0, 0);
            }
        }

        if (this.$shaking === true) {

            if (this.$elapsedTimeShaking < $DURATION_SHAKE) {

                this.$elapsedTimeShaking += $timetick;

                const deltaX = new Curve(CURVES.multiply(CURVES.negate(CURVES.easeIn(2)), CURVES.sine(20)))
                .setDuration($DURATION_SHAKE)
                .getProgress(0, this.$elapsedTimeShaking);

                const deltaY = new Curve(CURVES.multiply(CURVES.negate(CURVES.easeIn(2)), CURVES.sine(15)))
                .setDuration($DURATION_SHAKE)
                .getProgress(0, this.$elapsedTimeShaking);

                const shake = new Vector2($AMPLITUDE_SHAKE * deltaX, ($AMPLITUDE_SHAKE / 2) * deltaY);

                this.$shake = shake.round();
            }

            else  {

                this.$shaking = false;
                this.$elapsedTimeShaking = 0;
                this.$shake = new Vector2(0, 0);
            }
        }

        this.$camera.translateTo(this.$arm.translation.clone().add(this.$shake));
    }

    /**
     * @type {Actor['onTranslate']}
     */
    onTranslate($translation) {

        const previous = this.translation.clone().subtract($translation);
        const remaining = previous.clone().subtract(this.$arm.translation);
        const translation = remaining.add($translation);

        if (this.$travelling === true) {

            this.$elapsedTimeTravelling = 0;
            this.$travel = translation;

            return;
        }

        this.$arm.translate(translation);
        this.$camera.translateTo(this.$arm.translation.clone().add(this.$shake));
    }
}

export default ActorCameraman;
