# Actor Cameraman

> *📦 An actor to handle camera features.*

## Overview

#### `cameraman`

The `cameraman` is **the only Actor you should move**.

#### `cameraman.arm`

The `cameraman.arm` Actor :
- is handled by the `cameraman`.
- **moves smoothly** when the **travelling is enabled** in the `cameraman` Actor.
- **moves instantly** when the **travelling is disabled** in the `cameraman` Actor.
- is **protected** from **camera shake**.

#### `cameraman.camera`

The `cameraman.camera` Actor :
- is handled by the `cameraman`.
- **moves smoothly** when the **travelling is enabled** in the `cameraman` Actor.
- **moves instantly** when the **travelling is disabled** in the `cameraman` Actor.
- is **affected** by **camera shake**.

## Quick Start

#### `create the actor`

```javascript
const cameraman = /** @type {ActorCameraman} */(this.createActor(ActorCameraman));
stage.setPointOfView(cameraman.camera);
```

#### `follow the hero`

```javascript
cameraman.follow(hero);
```

#### `enable travelling`

```javascript
cameraman.triggerAction(ACTIONS_CAMERAMAN.ENABLE_TRAVELLING);
```

#### `shake the camera`

```javascript
cameraman.triggerAction(ACTIONS_CAMERAMAN.SHAKE);
```

## Example - HUD

#### `create HUD actor`

```javascript
const hud = /** @type {ActorHud} */(this.createActor(ActorHud))
.translateTo(this.engine.getBoundariesFromScreen().boundaryTop);
```

#### `update HUD actor`

```javascript
hud.translateTo(this.engine.getBoundariesFromScreen().boundaryTop);
```
