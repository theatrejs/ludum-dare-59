import {FACTORIES, Stage} from '@theatrejs/theatrejs';

import {getColor} from 'states/color.state.js';
import {getFraming} from 'states/framing.state.js';

import ControllerSplashScreen from './controllers/splash-screen/splash-screen.controller.js';

class StageSplashScreen extends FACTORIES.StageWithPreloadables([

    ControllerSplashScreen
]) {

    /**
     * @type {Stage['onCreate']}
     */
    onCreate() {

        this.engine.setColor(getColor());
        this.engine.setFraming(getFraming());

        this.createActor(ControllerSplashScreen);
    }
}

export default StageSplashScreen;
