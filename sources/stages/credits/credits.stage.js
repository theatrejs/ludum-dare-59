import {FACTORIES, Stage} from '@theatrejs/theatrejs';

import {getColor} from 'states/color.state.js';
import {getFraming} from 'states/framing.state.js';

import ControllerCredits from './controllers/credits/credits.controller.js';

class StageCredits extends FACTORIES.StageWithPreloadables([

    ControllerCredits
]) {

    /**
     * @type {Stage['onCreate']}
     */
    onCreate() {

        this.engine.setColor(getColor());
        this.engine.setFraming(getFraming());

        this.createActor(ControllerCredits);
    }
}

export default StageCredits;
