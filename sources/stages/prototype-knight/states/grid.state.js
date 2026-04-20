import {Grid, State, Vector2} from '@theatrejs/theatrejs';

/**
 * @typedef {object} TypeGrid A representation of a grid.
 * @property {boolean} TypeGrid.$hero The presence of the 'hero'.
 * @property {boolean} TypeGrid.$king The presence of a 'king'.
 * @property {boolean} TypeGrid.$pawn The presence of a 'pawn'.
 * @property {boolean} TypeGrid.$walkable The walkable status of the cell.
 */

/**
 * @type {Grid<TypeGrid>}
 */
const grid = new Grid();

/**
 * The state manager of the grid.
 * @type {State<Grid<TypeGrid>>}
 * @constant
 */
const stateGrid = /** @type {State<Grid<TypeGrid>>} */(new State(grid));

/**
 * Gets the grid.
 * @returns {Grid<TypeGrid>}
 */
function getGrid() {

    return stateGrid.getState();
}

/**
 * Resets the grid.
 */
function resetGrid() {

    stateGrid.setState(new Grid());
}

/**
 * Gets the grid cell position of the 'hero'.
 * @returns {Vector2}
 */
function getGridHero() {

    const grid = getGrid();

    let position;

    grid.iterate(({$data, $position, $terminate}) => {

        if ($data.$hero === false) {

            return;
        }

        $terminate();

        position = $position.clone();
    });

    return position;
}

/**
 * Gets the grid cell position of the 'king'.
 * @returns {Vector2}
 */
function getGridKing() {

    const grid = getGrid();

    let position;

    grid.iterate(({$data, $position, $terminate}) => {

        if ($data.$king === false) {

            return;
        }

        $terminate();

        position = $position.clone();
    });

    return position;
}

/**
 * Gets the presence of a 'pawn' on the given grid cell.
 * @param {Vector2} $cell The grid cell position.
 * @returns {boolean}
 */
function getGridPresencePawn($cell) {

    const position = $cell.clone();

    const grid = getGrid();

    if (grid.has(position) === false) {

        return false;
    }

    return grid.get(position).$pawn;
}

/**
 * Gets the walkable status of the given grid cell.
 * @param {Vector2} $cell The grid cell position.
 * @returns {boolean}
 */
function getGridWalkable($cell) {

    const position = $cell.clone();

    const grid = getGrid();

    if (grid.has(position) === false) {

        return false;
    }

    return grid.get(position).$walkable;
}

/**
 * Moves the presence of the 'hero' to the given grid cell position.
 * @param {Vector2} $cell The grid cell position.
 */
function moveGridHero($cell) {

    setGridHero(getGridHero(), false);
    setGridHero($cell, true);
}

/**
 * Sets the presence of the 'hero' on the given grid cell position.
 * @param {Vector2} $cell The grid cell position.
 * @param {boolean} $presence The presence of the 'hero'.
 */
function setGridHero($cell, $presence = true) {

    const position = $cell.clone();

    const grid = getGrid();

    if (grid.has(position) === false) {

        grid.set(position, {

            $hero: $presence,
            $king: false,
            $pawn: false,
            $walkable: false
        });

        return;
    }

    const data = window.structuredClone(grid.get(position));

    data.$hero = $presence;

    grid.set($cell.clone(), data);
}

/**
 * Sets the presence of a 'king' on the given grid cell position.
 * @param {Vector2} $cell The grid cell position.
 * @param {boolean} $presence The presence of a 'king'.
 */
function setGridKing($cell, $presence = true) {

    const position = $cell.clone();

    const grid = getGrid();

    if (grid.has(position) === false) {

        grid.set(position, {

            $hero: false,
            $king: $presence,
            $pawn: false,
            $walkable: false
        });

        return;
    }

    const data = window.structuredClone(grid.get(position));

    data.$king = $presence;

    grid.set($cell.clone(), data);
}

/**
 * Sets the presence of a 'pawn' on the given grid cell position.
 * @param {Vector2} $cell The grid cell position.
 * @param {boolean} $presence The presence of a 'pawn'.
 */
function setGridPawn($cell, $presence = true) {

    const position = $cell.clone();

    const grid = getGrid();

    if (grid.has(position) === false) {

        grid.set(position, {

            $hero: false,
            $king: false,
            $pawn: $presence,
            $walkable: false
        });

        return;
    }

    const data = window.structuredClone(grid.get(position));

    data.$pawn = $presence;

    grid.set($cell.clone(), data);
}

/**
 * Sets the walkable status of the given grid cell position.
 * @param {Vector2} $cell The grid cell position.
 * @param {boolean} $walkable The walkable status.
 */
function setGridWalkable($cell, $walkable = true) {

    const position = $cell.clone();

    const grid = getGrid();

    if (grid.has(position) === false) {

        grid.set(position, {

            $hero: false,
            $king: false,
            $pawn: false,
            $walkable: $walkable
        });

        return;
    }

    const data = window.structuredClone(grid.get(position));

    data.$walkable = true;

    grid.set($cell.clone(), data);
}

export {

    stateGrid,

    getGrid,
    resetGrid,

    getGridHero,
    getGridKing,
    getGridPresencePawn,
    getGridWalkable,
    moveGridHero,
    setGridHero,
    setGridKing,
    setGridPawn,
    setGridWalkable
};
