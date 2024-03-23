const gameBoard = document.querySelector('#gameBoard');
let draggingShip;

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
    tile.style.width = tile.style.height = '48px';
    tile.className = 'tile';
    tile.id = `tile-${i}`;
    tile.dataset.coord = coord;
    tile.innerText = coord;
    // console.log(tile);

    tile.addEventListener('click', () => {
      console.log(`You just clicked ${coord}`);
    });
    tile.addEventListener('dragenter', (e) => {
      e.preventDefault();

      e.target.style.backgroundColor = 'blue';

      let count = draggingShip.dataset.size;

      let nextSibling = e.target.nextSibling;
      while (count > 1) {
        nextSibling.style.backgroundColor = 'blue';
        nextSibling = nextSibling.nextSibling;
        count--;
      }
    });
    tile.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.target.style.backgroundColor = 'transparent';
    });
    tile.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    tile.addEventListener('drop', (e) => {
      e.preventDefault();
      console.log(e.dataTransfer);

      const data = e.dataTransfer.getData('text');
      console.log(data);

      const ship = document.getElementById(data);
      console.log(ship);

      e.target.appendChild(ship);
      ship.style.position = 'absolute';
    });

    gameBoard.insertAdjacentElement('beforeend', tile);
  }
};

const dragStart = (e) => {
  // console.log(e);
  e.dataTransfer.setData('text', e.target.id);
  draggingShip = e.target;

  e.dataTransfer.effectAllowed = 'move';
};

const handleShipClick = (e) => {
  const orientation = e.target.style;
  const vertical = 'rotate(90deg)';
  const horizontal = 'rotate(0deg)';
  if (orientation.transform === vertical)
    return (orientation.transform = horizontal);
  orientation.transform = vertical;
};

createBoard(10, 10);

const ships = document.querySelectorAll('.ship');
console.log(ships);

ships.forEach((ship) => {
  ship.addEventListener('dragstart', dragStart);
  ship.addEventListener('click', handleShipClick);
});
