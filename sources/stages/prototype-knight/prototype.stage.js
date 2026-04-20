import {FACTORIES, Stage, UTILS, Vector2} from '@theatrejs/theatrejs';

import {getColor} from 'states/color.state.js';
import {getFraming} from 'states/framing.state.js';

import ControllerBattlefield from './controllers/battlefield/battlefield.controller.js';
import ControllerBoard from './controllers/board/board.controller.js';

class StagePrototype extends FACTORIES.StageWithPreloadables([

    ControllerBattlefield,
    ControllerBoard
]) {

    /**
     * @type {Stage['onCreate']}
     */
    onCreate() {

        UTILS.sleep(1000).then(() => {

            this.engine.setColor(getColor());
            this.engine.setFraming(getFraming());

            this.createActor(ControllerBattlefield);
            this.createActor(ControllerBoard);
        });
    }
}

export default StagePrototype;
