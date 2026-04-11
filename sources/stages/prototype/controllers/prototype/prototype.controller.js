import {Actor, FACTORIES, UTILS} from '@theatrejs/theatrejs';

import StageCredits from 'stages/credits/credits.stage.js';

import ActorPlaceholder from '../../actors/placeholder/placeholder.actor.js';

class ControllerPrototype extends FACTORIES.ActorWithPreloadables([

    ActorPlaceholder
]) {

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        const delay = UTILS.sleep(3000);
        const preload = this.engine.preloadStage(StageCredits);

        Promise.all([delay, preload]).then(() => {

            this.engine.createStage(StageCredits)
        });

        this.stage.createActor(ActorPlaceholder);
    }
}

export default ControllerPrototype;
