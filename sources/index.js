import {Engine, ExtensionGamepad, ExtensionGravity, ExtensionGyroscope, ExtensionPointer} from '@theatrejs/theatrejs';

import StageSplashScreen from 'stages/splash-screen/splash-screen.stage.js';

ExtensionGamepad.activate();
ExtensionGravity.activate();
ExtensionGyroscope.activate();
ExtensionPointer.activate();

const engine = new Engine();
engine.initiate(25);

await engine.preloadStage(StageSplashScreen);
engine.createStage(StageSplashScreen);
