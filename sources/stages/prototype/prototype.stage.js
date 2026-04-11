import {FACTORIES, Stage} from '@theatrejs/theatrejs';

import {getColor} from 'states/color.state.js';
import {getFraming} from 'states/framing.state.js';

import ControllerPrototype from './controllers/prototype/prototype.controller.js';

class StagePrototype extends FACTORIES.StageWithPreloadables([

    ControllerPrototype
]) {

    /**
     * @type {Stage['onCreate']}
     */
    onCreate() {

        this.engine.setColor(getColor());
        this.engine.setFraming(getFraming());

        this.createActor(ControllerPrototype);
    }
}

export default StagePrototype;
