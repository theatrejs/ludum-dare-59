import {Engine, ExtensionGamepad, ExtensionGravity, ExtensionGyroscope, ExtensionMidi, ExtensionPointer} from '@theatrejs/theatrejs';

import StageCredits from 'stages/credits/credits.stage.js';
import StageSplashScreen from 'stages/splash-screen/splash-screen.stage.js';

import {getStage} from 'states/stage.state.js';

ExtensionGamepad.activate(0.75);
ExtensionGravity.activate();
ExtensionGyroscope.activate();
ExtensionMidi.activate();
ExtensionPointer.activate();

const engine = new Engine();
engine.initiate(25);

await engine.preloadStage(StageCredits);
await engine.preloadStage(StageSplashScreen);
await engine.preloadStage(getStage());

engine.createStage(getStage());
// engine.createStage(StageSplashScreen);
