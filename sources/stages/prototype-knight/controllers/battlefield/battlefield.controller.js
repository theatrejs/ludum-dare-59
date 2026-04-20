import {Actor, Curve, CURVES, FACTORIES, FiniteStateMachine, INPUT_CODES, Midi, MIDI_STATUSES, Seed, UTILS, Vector2, Vibration} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import ActorCameraman from 'actors/cameraman/cameraman.actor.js';
import * as ACTIONS_CAMERAMAN from 'actors/cameraman/cameraman.actions.js';

import {getStage} from 'states/stage.state.js';

import levels from '../../levels/prototype/prototype.ldtk';
import * as ENTITIES from '../../levels/prototype/prototype.entities.js';
import * as LAYERS from '../../levels/prototype/prototype.layers.js';
import * as LEVELS from '../../levels/prototype/prototype.levels.js';

import {getGridHero, getGridPresencePawn, getGridWalkable, moveGridHero, resetGrid, setGridHero, setGridKing, setGridPawn, setGridWalkable} from '../../states/grid.state.js';

import fontTheatrejs from '../../fonts/theatrejs/theatrejs.font.aseprite';

import ActorGround from '../../actors/ground/ground.actor.js';
import ActorHero from '../../actors/hero/hero.actor.js';
import ActorKing from '../../actors/king/king.actor.js';
import ActorPawn from '../../actors/pawn/pawn.actor.js';
import * as ACTIONS_HERO from '../../actors/hero/hero.actions.js';
import * as ACTIONS_GROUND from '../../actors/ground/ground.actions.js';
import * as ACTIONS_PAWN from '../../actors/pawn/pawn.actions.js';

import * as CARDS from '../../constants/cards.contants.js';

import {getEventBus, resetEventBus} from '../../eventbuses/prototype/prototype.eventbus.js';
import * as EVENTS from '../../eventbuses/prototype/prototype.events.js';

import {getBoard, resetBoard} from '../../states/board.state.js';
import StageCredits from 'stages/credits/credits.stage.js';
import { getFirstLevel, getNextLevel, stateLevelCurrent } from 'stages/prototype-knight/states/levels.state.js';
import StagePrototype from 'stages/prototype-knight/prototype.stage.js';
import ActorGrid from 'stages/prototype-knight/actors/grid/grid.actor.js';

/**
 * The size of a grid cell.
 * @type {number}
 * @constant
 * @private
 */
const $SIZE_CELL = 32;

class ControllerPrototype extends FACTORIES.ActorWithPreloadables([

    ActorCameraman,
    ActorGround,
    ActorHero,
    ActorKing,
    ActorPawn,
    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(fontTheatrejs)
]) {

    /**
     * @typedef {('BOOTING' | 'DASH' | 'DASH_RECOVER' | 'MOVING')} TypeStateMachine A finite state machine state.
     */

    /**
     * Stores the 'cameraman' actor.
     * @type {ActorCameraman}
     * @private
     */
    $actorCameraman;

    /**
     * Stores the 'hero' actor.
     * @type {ActorHero}
     * @private
     */
    $actorHero;

    /**
     * Triggers the 'apply card effect' action.
     */
    $actionApplyCardEffect() {

        console.log('! BATTLEFIELD', '[', getBoard().$stack, ']');

        switch (getBoard().$stack) {

            case CARDS.KNIGHT_DOWN_LEFT_LEFT: {

                moveGridHero(getGridHero().add(new Vector2(- 2, 1)));

                break;
            }

            case CARDS.KNIGHT_DOWN_RIGHT_RIGHT: {

                moveGridHero(getGridHero().add(new Vector2(2, 1)));

                break;
            }

            case CARDS.KNIGHT_UP_UP_LEFT: {

                moveGridHero(getGridHero().add(new Vector2(- 1, - 2)));

                break;
            }

            case CARDS.KNIGHT_UP_UP_RIGHT: {

                moveGridHero(getGridHero().add(new Vector2(1, - 2)));

                break;
            }
        }

        const zIndex = this.$getZIndex(getGridHero());

        this.$actorHero
        .translateTo(this.$getPosition(getGridHero()).scale($SIZE_CELL))
        .setZIndex(zIndex + 0.5)
        .triggerAction(ACTIONS_HERO.MOVE);

        getEventBus().trigger(EVENTS.STATE_BOARD_HERO_MOVED);

        if (getGridWalkable(getGridHero()) === false) {

            console.log('YOU DIED (VOID)');

            this.$actorHero.triggerAction(ACTIONS_HERO.DIE);

            UTILS.sleep(300).then(() => {

                this.$actorCameraman.triggerAction(ACTIONS_CAMERAMAN.SHAKE);
            });

            getEventBus().trigger(EVENTS.STATE_BOARD_ENDED);

            UTILS.sleep(2000).then(() => {

                this.engine.createStage(StagePrototype);
            });

            return;
        }

        if (getGridPresencePawn(getGridHero())) {

            const pawn = this.stage.actors.find(($actor) => {

                if ($actor.label !== 'pawn') {

                    return false;
                }

                if ($actor.identifier !== Vector2.serialize(getGridHero())) {

                    return false;
                }

                // console.log($actor.label, $actor.identifier, Vector2.serialize(getGridHero()))

                return true;
            });

            setGridPawn(getGridHero(), false);

            pawn
            .triggerAction(ACTIONS_PAWN.DIE)
            .setLabel('');

            // // console.log(pawn);
            // this.stage.removeActor(pawn);
        }

        if (this.stage.hasActorWithLabel('pawn') === false) {

            getEventBus().trigger(EVENTS.STATE_BOARD_ENDED);

            UTILS.sleep(2000).then(() => {

                console.log('---------------------');

                if (typeof getNextLevel() === 'undefined') {

                    stateLevelCurrent.setState(getFirstLevel());

                    this.engine.createStage(StageCredits);

                    return;
                }

                stateLevelCurrent.setState(getNextLevel());

                this.engine.createStage(StagePrototype);
            });

            return;
        }

        if (getGridPresencePawn(getGridHero().clone().add(new Vector2(- 1,- 1)))) {

            const pawn = this.stage.actors.find(($actor) => {

                if ($actor.label !== 'pawn') {

                    return false;
                }

                if ($actor.identifier !== Vector2.serialize(getGridHero().clone().add(new Vector2(- 1, - 1)))) {

                    return false;
                }

                return true;
            });

            console.log('YOU DIED (LEFT)');

            pawn.triggerAction(ACTIONS_PAWN.ATTACK);
            this.$actorHero.triggerAction(ACTIONS_HERO.DIE);

            UTILS.sleep(300).then(() => {

                this.$actorCameraman.triggerAction(ACTIONS_CAMERAMAN.SHAKE);
            });

            getEventBus().trigger(EVENTS.STATE_BOARD_ENDED);

            UTILS.sleep(2000).then(() => {

                this.engine.createStage(StagePrototype);
            });

            return;
        }

        else if (getGridPresencePawn(getGridHero().clone().add(new Vector2(1,- 1)))) {

            const pawn = this.stage.actors.find(($actor) => {

                if ($actor.label !== 'pawn') {

                    return false;
                }

                if ($actor.identifier !== Vector2.serialize(getGridHero().clone().add(new Vector2(1, - 1)))) {

                    return false;
                }

                return true;
            });

            console.log('YOU DIED (RIGHT)');

            pawn.triggerAction(ACTIONS_PAWN.ATTACK);
            this.$actorHero.triggerAction(ACTIONS_HERO.DIE);

            UTILS.sleep(300).then(() => {

                this.$actorCameraman.triggerAction(ACTIONS_CAMERAMAN.SHAKE);
            });

            getEventBus().trigger(EVENTS.STATE_BOARD_ENDED);

            UTILS.sleep(2000).then(() => {

                this.engine.createStage(StagePrototype);
            });

            return;
        }
    }

    /**
     * Creates a 'ground' actor.
     * @param {Vector2} $cell The grid cell position.
     * @returns {ActorGround}
     * @private
     */
    $createGround($cell) {

        const position = this.$getPosition($cell).scale($SIZE_CELL);
        const zIndex = this.$getZIndex($cell);

        const actor = /** @type {ActorGround} */(this.stage.createActor(ActorGround))
        .translateTo(position)
        .setZIndex(zIndex - 100);

        const color = $cell.x + $cell.y;

        if (color % 2 === 0) {

            actor.triggerAction(ACTIONS_GROUND.IDLE_BLACK);
        }

        else {

            actor.triggerAction(ACTIONS_GROUND.IDLE_WHITE);
        }

        setGridWalkable($cell);

        return actor;
    }

    /**
     * Creates a 'hero' actor.
     * @param {Vector2} $cell The grid cell position.
     * @returns {ActorHero}
     * @private
     */
    $createHero($cell) {

        const position = this.$getPosition($cell).scale($SIZE_CELL);
        const zIndex = this.$getZIndex($cell);

        const actor = /** @type {ActorHero} */(this.stage.createActor(ActorHero))
        .translateTo(position)
        .setLabel('hero')
        .setZIndex(zIndex);

        setGridHero($cell);

        this.$actorHero = actor;

        this.$actorCameraman
        .translateTo(this.$actorHero.translation)
        .follow(this.$actorHero)
        .setLabel('cameraman');
        // .translateX(32) // @TODO
        // .translateY(32) // @TODO
        // .mimic(this.$actorHero);

        return actor;
    }

    /**
     * Creates a 'king' actor.
     * @param {Vector2} $cell The grid cell position.
     * @returns {ActorKing}
     * @private
     */
    $createKing($cell) {

        const position = this.$getPosition($cell).scale($SIZE_CELL);
        const zIndex = this.$getZIndex($cell);

        const actor = /** @type {ActorKing} */(this.stage.createActor(ActorKing))
        .translateTo(position)
        .setZIndex(zIndex);

        setGridKing($cell);

        return actor;
    }

    /**
     * Creates a 'pawn' actor.
     * @param {Vector2} $cell The grid cell position.
     * @returns {ActorPawn}
     * @private
     */
    $createPawn($cell) {

        const position = this.$getPosition($cell).scale($SIZE_CELL);
        const zIndex = this.$getZIndex($cell);

        const actor = /** @type {ActorPawn} */(this.stage.createActor(ActorPawn))
        .translateTo(position)
        .setZIndex(zIndex)
        .setLabel('pawn')
        .setIdentifier(Vector2.serialize($cell));

        // console.log($cell, Vector2.serialize($cell))

        setGridPawn($cell);

        return actor;
    }

    /**
     * Gets a vector in the top-down space from the given vector in the two-dimensionnal space
     * @param {Vector2} $vector The given vector.
     * @returns {Vector2}
     * @private
     */
    $getPosition($vector) {

        const vector = $vector.clone()
        .multiply(new Vector2(1, - 1))
        // .subtract(new Vector2($vector.y * (1 / 3), 0));

        // const vector = $vector.clone()
        // .multiply(new Vector2(1 / 2, - 1 / 4))
        // .subtract(new Vector2($vector.y * (1 / 2), $vector.x * (1 / 4)));

        return vector;
    }

    /**
     * Gets a z-index value in the top-down from the given vector in the two-dimensionnal space
     * @param {Vector2} $vector The given vector.
     * @returns {number}
     * @private
     */
    $getZIndex($vector) {

        // return $vector.y;

        return $vector.y;
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        resetEventBus();

        resetGrid();

        this.$actorCameraman = /** @type {ActorCameraman} */(this.stage.createActor(ActorCameraman));

        this.stage.setPointOfView(this.$actorCameraman.camera);

        levels.createGrid({

            $layer: LAYERS.ENVIRONMENT,
            $level: stateLevelCurrent.getState()
        })
        .iterate(({$data, $position}) => {

            const label = /** @type {import('../../levels/prototype/prototype.entities.js').TypeEntity} */($data.label);

            switch (label) {

                case ENTITIES.GROUND: {

                    this.$createGround($position);

                    break;
                }
            }
        });

        levels.createGrid({

            $layer: LAYERS.ENTITIES,
            $level: stateLevelCurrent.getState()
        })
        .iterate(({$data, $position}) => {

            const label = /** @type {import('../../levels/prototype/prototype.entities.js').TypeEntity} */($data.label);

            switch (label) {

                case ENTITIES.PAWN: {

                    this.$createPawn($position);

                    break;
                }

                case ENTITIES.KING: {

                    this.$createKing($position);

                    break;
                }

                case ENTITIES.HERO: {

                    this.$createHero($position)
                    // .setIdentifier($data.identifier);

                    break;
                }
            }
        });

        this.$actorCameraman.triggerAction(ACTIONS_CAMERAMAN.ENABLE_TRAVELLING);

        getEventBus().listen(EVENTS.STATE_BOARD_CARD_PLAYED, this.$actionApplyCardEffect.bind(this));
    }

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        //
    }
}

export default ControllerPrototype;
