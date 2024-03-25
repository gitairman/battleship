const gameBoard = document.querySelector('#gameBoard');
const borderWidth = 1;
const tileWidth = 50;
const tileHeight = 50;
let draggingShip;
let clone;
let draggingOver;

const setTiles = (count, currNode, colour) => {
  while (count > 0) {
    currNode.style.backgroundColor = colour;
    currNode = currNode.nextSibling;
    count--;
  }
};

const dropShip = (e) => {
  e.preventDefault();

  const currNode = draggingOver;
  if (!currNode.classList.contains('tile')) return;

  const shipLen = Number(draggingShip.dataset.size);
  const currNodeId = Number(currNode.id.split('-')[1]);
  const isOnBoard = (currNodeId % 10) + shipLen <= 10;

  if (!isOnBoard) {
    const prevParent = draggingShip.parentNode;
    setTiles(shipLen, currNode, 'transparent');
    return setTiles(shipLen, prevParent, 'blue');
  }

  currNode.appendChild(draggingShip);
  draggingShip.style.position = 'absolute';
  clone.remove();

  setTiles(shipLen, currNode, 'blue');
};

const dragLeave = (e) => {
  e.preventDefault();
  // const currNode = e.target;
  // if (!currNode.classList.contains('tile')) return;

  // const shipLen = Number(draggingShip.dataset.size);
  // const currNodeId = Number(currNode.id.split('-')[1]);
  // const isOnBoard = (currNodeId % 10) + shipLen <= 10;
  // const count = isOnBoard ? shipLen : 10 - (currNodeId % 10);
  // setTiles(count, currNode, 'transparent');
};

const dragEnter = (e) => {
  e.preventDefault();
  // console.log(e);

  // const currNode = e.target;
  // if (!currNode.classList.contains('tile')) return;

  // // setTimeout to ensure following code runs after drag leave handler
  // setTimeout(() => {
  //   const shipLen = Number(draggingShip.dataset.size);

  //   const currNodeId = Number(currNode.id.split('-')[1]);
  //   const isOnBoard = (currNodeId % 10) + shipLen <= 10;
  //   const colour = isOnBoard ? 'green' : 'red';

  //   const count = isOnBoard ? shipLen : 10 - (currNodeId % 10);

  //   setTiles(count, currNode, colour);
  // });
};

const dragOver = (e) => {
  e.preventDefault();
  const tile = Math.floor(e.pageY / 50) * 10 + Math.floor(e.pageX / 50);
  const currNode = document.getElementById(`tile-${tile}`);
  let prevNode = draggingOver;
  if (currNode === prevNode || !currNode) return;
  if (!prevNode) prevNode = currNode;

  const shipLen = Number(draggingShip.dataset.size);
  const currNodeId = Number(currNode.id.split('-')[1]);
  const isOnBoard = (currNodeId % 10) + shipLen <= 10;
  const colour = isOnBoard ? 'green' : 'red';
  const count = isOnBoard ? shipLen : 10 - (currNodeId % 10);
  setTiles(count, prevNode, 'transparent');
  setTiles(count, currNode, colour);

  draggingOver = currNode;

  // console.log('x: ', e.pageX, 'y: ', e.pageY);
  // console.log(
  //   'tile: ',
  //   Math.floor(e.pageY / 50) * 10 + Math.floor(e.pageX / 50)
  // );
};

const dragStart = (e) => {
  console.log(e.target);

  draggingShip = e.target;
  clone = draggingShip.cloneNode(true);
  const isRotated = draggingShip.style.transform === 'rotate(90deg)';

  clone.id = `${draggingShip.id}-clone`;
  clone.style.position = 'absolute';
  clone.style.top = '-150px';

  const yOffset = tileHeight / 2 - borderWidth * 2;
  let xOffset = yOffset;

  const inner = clone.childNodes[1];
  if (isRotated) {
    inner.style.transform = 'rotate(90deg)';

    const shipLen = draggingShip.dataset.size;
    xOffset = (shipLen * tileWidth) / 2 - borderWidth * 2;
  }

  document.body.appendChild(clone);

  e.dataTransfer.setDragImage(clone, xOffset, yOffset);
  e.dataTransfer.effectAllowed = 'move';

  const currParent = e.target.parentNode;
  if (!currParent.classList.contains('tile')) return;

  const count = draggingShip.dataset.size;
  setTiles(count, currParent, 'blue');
};

const handleTileClick = (e) => {
  console.log(e);
  const coord = e.target.dataset.coord;
  console.log(`You just clicked ${coord}`);
};

const handleShipClick = (e) => {
  const orientation = e.currentTarget.style;

  const vertical = 'rotate(90deg)';
  const horizontal = 'rotate(0deg)';
  if (orientation.transform === vertical)
    return (orientation.transform = horizontal);
  orientation.transform = vertical;
};

const createBoard = (length, width) => {
  const area = length * width;
  let row = 0,
    col = 0;

  gameBoard.style.width = `${width * 50}px`;
  gameBoard.style.height = `${length * 50}px`;
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

    tile.addEventListener('click', handleTileClick);
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
