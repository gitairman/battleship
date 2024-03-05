const gameBoard = document.querySelector('#gameBoard')

const createBoard = (length, width) => {
  const area = length * width
  let row = 0,
    col = 0

  gameBoard.style.width = `${width * 50}px`
  gameBoard.style.height = `${length * 50}px`
  for (let i = 0; i < area; i++) {
    console.log(i / length)
    row = Math.floor(i / length) + 65
    col = (i % width) + 1
    gameBoard.insertAdjacentHTML(
      'beforeend',
      `<div
        style="width:${50}px; height:${50}px;"
        class="tile"
        id=tile-${i}
        data-coord=${String.fromCharCode(row) + col}>
        ${String.fromCharCode(row) + col}
      </div>`
    )
  }
}

createBoard(10, 10)
