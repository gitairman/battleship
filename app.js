const gameBoard = document.querySelector('#gameBoard');
const borderWidth = 1;
const tileWidth = 50;
const tileHeight = 50;
let draggingShip;
let shipIsVertical = false;
let clone;
let draggingOver;

const setTiles = (count, currNode, colour) => {
  let offset;
  if (shipIsVertical) {
    offset = 10;
  } else offset = 1;
  let currTile = Number(currNode.id.split('-')[1]);
  const startRow = Math.floor(currTile / 10);
  let currRow = startRow;

  while (count > 0) {
    currNode.style.backgroundColor = colour;
    currNode = document.getElementById(`tile-${currTile + offset}`);
    currTile += offset;
    count--;
    if (currTile > 100) break;
    if (offset === 10) continue;
    currRow = Math.floor(currTile / 10);
    if (offset === 1 && currRow != startRow) break;
  }
};

const setShip = (ship, currNode) => {
  let offset;
  if (shipIsVertical) {
    offset = 10;
  } else offset = 1;
  let currTile = Number(currNode.id.split('-')[1]);

  let count = ship.dataset.size;
  while (count > 0) {
    currNode.classList.add('ship_on');
    currNode.dataset.ship = ship.id;
    currNode = document.getElementById(`tile-${currTile + offset}`);
    currTile += offset;
    count--;
  }
};

const unsetShip = (ship, currNode) => {
  console.log(ship, currNode);

  let offset;
  if (shipIsVertical) {
    offset = 10;
  } else offset = 1;
  let currTile = Number(currNode.id.split('-')[1]);

  let count = ship.dataset.size;
  while (count > 0) {
    currNode.classList.remove('ship_on');
    currNode.dataset.ship = null;
    currNode = document.getElementById(`tile-${currTile + offset}`);
    currTile += offset;
    count--;
  }
};

const checkShipOnBoard = (len, tile) => {
  if (shipIsVertical) return (len - 1) * 10 + tile < 100;
  return (tile % 10) + len <= 10;
};
const checkCanRotate = (rotateTo, len, currNode) => {
  const tile = Number(currNode.id.split('-')[1]);
  if (rotateTo === 'vertical') return (len - 1) * 10 + tile < 100;

  return (tile % 10) + len <= 10;
};

const dropShip = (e) => {
  e.preventDefault();
  // console.log(e);

  const currNode = draggingOver;

  const shipLen = Number(draggingShip.dataset.size);
  const currNodeId = Number(currNode.id.split('-')[1]);
  const isOnBoard = checkShipOnBoard(shipLen, currNodeId);

  if (!isOnBoard) {
    const prevParent = draggingShip.parentNode;
    setTiles(shipLen, currNode, 'transparent');
    return setTiles(shipLen, prevParent, 'blue');
  }

  currNode.appendChild(draggingShip);
  draggingShip.style.position = 'absolute';
  clone.remove();

  setTiles(shipLen, currNode, 'blue');
  setShip(draggingShip, currNode);
};

const dragLeave = (e) => {
  e.preventDefault();
};

const dragEnter = (e) => {
  e.preventDefault();
};

const dragOver = (e) => {
  e.preventDefault();
  // console.log(e);

  const tile = Math.floor(e.pageY / 50) * 10 + Math.floor(e.pageX / 50);
  const currNode = document.getElementById(`tile-${tile}`);
  let prevNode = draggingOver;
  if (currNode === prevNode || !currNode) return;
  if (!prevNode) prevNode = currNode;

  const shipLen = Number(draggingShip.dataset.size);
  const currNodeId = Number(currNode.id.split('-')[1]);

  const isOnBoard = checkShipOnBoard(shipLen, currNodeId);

  const colour = isOnBoard ? 'green' : 'red';

  setTiles(shipLen, prevNode, 'transparent');
  setTiles(shipLen, currNode, colour);

  draggingOver = currNode;

  // console.log('x: ', e.pageX, 'y: ', e.pageY);
  // console.log(
  //   'tile: ',
  //   Math.floor(e.pageY / 50) * 10 + Math.floor(e.pageX / 50)
  // );
};

const dragStart = (e) => {
  if (draggingShip && draggingShip.parentNode.classList.contains('tile')) {
    setTiles(draggingShip.dataset.size, draggingShip.parentNode, 'transparent');
  }

  if (e.target.parentNode.classList.contains('tile')) {
    unsetShip(e.target, e.target.parentNode);
  }

  draggingShip = e.target;
  clone = draggingShip.cloneNode(true);
  shipIsVertical = draggingShip.style.transform === 'rotate(90deg)';

  clone.id = `${draggingShip.id}-clone`;
  clone.style.position = 'absolute';
  clone.style.top = '-150px';

  const yOffset = tileHeight / 2 - borderWidth * 2;
  let xOffset = yOffset;

  const inner = clone.childNodes[1];
  if (shipIsVertical) {
    inner.style.transform = 'rotate(90deg)';

    const shipLen = draggingShip.dataset.size;
    xOffset = (shipLen * tileWidth) / 2 - borderWidth * 2;
  }

  document.body.appendChild(clone);

  e.dataTransfer.setDragImage(clone, xOffset, yOffset);
  e.dataTransfer.effectAllowed = 'move';
};

const handleTileClick = ({ target }) => {
  const coord = target.dataset.coord;
  if (coord) return console.log(`You just clicked on tile ${coord}`);
  const ship = target.innerText;
  return console.log(`You just click on a ${ship}`);
};

const rotateShip = (newOrientation, ship, orientation, currLoc) => {
  const shipLen = Number(ship.dataset.size);
  const isOnBoard = currLoc.classList.contains('tile');

  if (isOnBoard) {
    setTiles(shipLen, currLoc, 'transparent');
    unsetShip(ship, currLoc);
  }
  orientation.transform = newOrientation;
  shipIsVertical = !shipIsVertical;
  if (isOnBoard) {
    setTiles(shipLen, currLoc, 'blue');
    setShip(ship, currLoc);
  }
};

const handleShipClick = ({ currentTarget }) => {
  const ship = currentTarget;
  console.log(ship);

  const currLoc = ship.parentNode;
  const orientation = ship.style;
  const shipLen = Number(ship.dataset.size);

  const vertical = 'rotate(90deg)';
  const horizontal = 'rotate(0deg)';

  if (orientation.transform === vertical) {
    const canRotate = checkCanRotate('horizontal', shipLen, currLoc);

    if (!canRotate) return console.log('cannot rotate to horizontal');
    rotateShip(horizontal, ship, orientation, currLoc);
    return;
  }
  const canRotate = checkCanRotate('vertical', shipLen, currLoc);

  if (!canRotate) return console.log('cannot rotate to vertical');
  rotateShip(vertical, ship, orientation, currLoc);
};

const createBoard = (length, width) => {
  const area = length * width;
  let row = 0,
    col = 0;

  gameBoard.style.width = `${width * 50}px`;
  gameBoard.style.height = `${length * 50}px`;
  gameBoard.addEventListener('click', handleTileClick);
  for (let i = 0; i < area; i++) {
    // console.log(i / length);
    row = Math.floor(i / length) + 65;
    col = (i % width) + 1;

    const tile = document.createElement('div');
    const coord = String.fromCharCode(row) + col;
    tile.style.width = tile.style.height = tileWidth - borderWidth * 2 + 'px';
    tile.className = 'tile';
    tile.id = `tile-${i}`;
    tile.dataset.coord = coord;
    tile.innerText = coord;
    // console.log(tile);

    tile.addEventListener('dragenter', dragEnter);
    tile.addEventListener('dragleave', dragLeave);
    tile.addEventListener('dragover', dragOver);
    tile.addEventListener('drop', dropShip);

    gameBoard.insertAdjacentElement('beforeend', tile);
  }
};

createBoard(10, 10);

const ships = document.querySelectorAll('.ship');

ships.forEach((ship) => {
  ship.addEventListener('dragstart', dragStart);
  ship.addEventListener('click', handleShipClick);
});
