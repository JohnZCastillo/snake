const cell = Array.from(document.querySelectorAll(".cell"));

const upBtn = document.querySelector(".up");
const rightBtn = document.querySelector(".right");
const leftBtn = document.querySelector(".left");
const downBtn = document.querySelector(".down");

// div that display the score
const scoreDisplay = document.querySelector("#score");

// stats for game
const stats = {
  // score is negative one because when game is started the snake has 1 score
  score: -1,
};

downBtn.addEventListener("click", () => snake.setDirection(movement.DOWN));
upBtn.addEventListener("click", () => snake.setDirection(movement.UP));
rightBtn.addEventListener("click", () => snake.setDirection(movement.RIGHT));
leftBtn.addEventListener("click", () => snake.setDirection(movement.LEFT));

// append value to score
const updateScore = (value) => {
  // update current score
  stats.score += value;
  //update displayed score
  // add 1 since score is starting with -1
  scoreDisplay.innerHTML = stats.score + 1;
};

const snakeHeadPosition = () => {
  return cell.findIndex((value) => value.classList.contains("snake-head"));
};

const food = {
  position: 0,
  available: false,
  show: function () {
    if (this.available) return;

    let temp = Math.floor(Math.random() * 100);

    // loop until food is not in snake's body path.
    while (snake.body.includes(temp)) {
      temp = Math.floor(Math.random() * 100);
    }
    // 0 - 99
    this.position = temp;
    cell[this.position].classList.add("snake-food");
    this.available = true;
  },
};

const movement = {
  UP: Symbol("UP"),
  DOWN: Symbol("DOWN"),
  RIGHT: Symbol("RIGHT"),
  LEFT: Symbol("LEFT"),
};

const edge = {
  top: (index) => index <= 9,
  bottom: (index) => index >= 90,
  left: (index) => index % 10 === 0,
  right: (index) => (index + 1) % 10 === 0,
};

const snake = {
  head: 0,
  body: [],
  direction: movement.RIGHT,
  isDead: function () {
    for (let i = 0; i < this.body.length; i++) {
      for (let j = i; j < this.body.length; j++) {
        if (i === j) continue;
        if (this.body[i] === this.body[j]) return true;
      }
    }
    return false;
  },
  eat: function () {
    if (food.position === this.head) {
      // update score when a fruit is eaten.
      updateScore(1);

      // remove food in display
      cell[food.position].classList.remove("snake-food");
      food.available = false;
      food.position = -1;

      //grow snake body when food is eaten
      this.grow();

      console.log(stats.score);
    }
  },
  setDirection: function (direction) {
    if (
      (direction === movement.LEFT && this.direction === movement.RIGHT) ||
      (direction === movement.RIGHT && this.direction === movement.LEFT) ||
      (direction === movement.DOWN && this.direction === movement.UP) ||
      (direction === movement.UP && this.direction === movement.DOWN)
    )
      return;
    this.direction = direction;
  },
  grow: function () {
    const length = this.body.length;
    const tail = length === 0 ? this.head : this.body[length - 1];

    switch (this.direction) {
      case movement.RIGHT:
        this.body.push(edge.left(tail) ? tail + 9 : tail - 1);
        break;
      case movement.LEFT:
        this.body.push(edge.right(tail) ? tail - 9 : tail + 1);
        break;
      case movement.UP:
        this.body.push(edge.bottom(tail) ? tail - 90 : tail + 10);
        break;
      case movement.DOWN:
        this.body.push(edge.top(tail) ? tail + 90 : tail - 10);
        break;
    }

    this.body.forEach((value) => {
      cell[value].classList.add("snake-body");
    });
  },
};

const trail = () => {
  // move firts the head
  move();

  let holder = snake.body[0];
  let temp = 0;

  // move the rest of the body
  for (let i = 1; i < snake.body.length; i++) {
    cell[snake.body[i - 1]].classList.add("snake-body");
    cell[snake.body[i]].classList.remove("snake-body");

    temp = snake.body[i];

    snake.body[i] = holder;

    holder = temp;
  }

  snake.body[0] = snake.head;
};

const move = () => {
  let next = snake.head;

  switch (snake.direction) {
    case movement.RIGHT:
      next += edge.right(next) ? -9 : 1;
      break;
    case movement.LEFT:
      next += edge.left(next) ? 9 : -1;
      break;
    case movement.DOWN:
      next += edge.bottom(next) ? -90 : 10;
      break;
    case movement.UP:
      next += edge.top(next) ? 90 : -10;
      break;
  }

  cell[snake.head].classList.remove("snake-head");
  cell[next].classList.add("snake-head");
  snake.head = next;
};

snake.head = snakeHeadPosition();
snake.body.push(snake.head);

window.addEventListener("keydown", (event) => {
  console.log(event);
  switch (event.key) {
    case "ArrowLeft":
      snake.setDirection(movement.LEFT);
      break;
    case "ArrowRight":
      snake.setDirection(movement.RIGHT);
      break;
    case "ArrowUp":
      snake.setDirection(movement.UP);
      break;
    case "ArrowDown":
      snake.setDirection(movement.DOWN);
      break;
  }
});

const gameStart = setInterval(() => {
  food.show();
  snake.eat();
  trail();

  if (snake.isDead()) {
    clearInterval(gameStart);
  }
}, 300);
