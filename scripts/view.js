export default class View {
  constructor(container, width, height) {
    this.container = container;
    this.width = width;
    this.height = height;

    this.createCanvas();
    this.createPlayfield();

    this.loadScreenTimer = null;
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');
  }

  createPlayfield() {
    this.playfieldWidth = this.width;
    this.playfieldHeight = this.height;
    this.playfieldX = 0;
    this.playfieldY = 0;
  }

  async setState(size) {
    this.container.appendChild(this.canvas);

    this.size = size;
    this.imageBorderWidth = 2;
    this.imageWidth = this.playfieldWidth / size;
    this.imageHeight = this.playfieldHeight / size;
    this.imageInnerWidth = this.imageWidth - this.imageBorderWidth * 2;
    this.imageInnerHeight = this.imageHeight - this.imageBorderWidth * 2;
    return this.downloadImages(size);
  }

  async downloadImages(size) {
    const listLength = size * size;
    const promises = [];
    for (let i = 1; i < listLength; i++) {
      const img = new Image();
      const promise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('image loading error'));
      });
      img.src = `./images/${size}x${size}/image_${i < 10 ? '0' : ''}${i}.jpg`;
      promises.push(promise);
    }
    await Promise.all(promises).then((values) => {
      this.imagesList = values;
    });
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  removeCanvas() {
    this.container.remove();
  }

  clearField(x, y, width, height) {
    this.context.clearRect(x, y, width, height);
  }

  clearLoadScreen() {
    clearInterval(this.loadScreenTimer);
    this.loadScreenTimer = null;
    this.clearScreen();
  }

  renderLoadScreen() {
    let count = 0;
    this.loadScreenTimer = setInterval(() => {
      const infoWidth = 300;
      const infoHeight = 200;
      const infoX = this.width / 2 - infoWidth / 2;
      const infoY = this.height / 2 - infoHeight / 2;
      const smallCircleRadius = 5;
      const bigCircleRadius = 7.5;
      const circlesDistance = 30;
      const circleY = infoY + infoHeight / 2;
      const circleX = infoX + infoWidth / 2 - circlesDistance * 1.5;
      this.clearScreen();

      for (let i = 0; i < 4; i++) {
        const radius = i === count ? bigCircleRadius : smallCircleRadius;
        this.context.fillStyle = '#7c7c7c';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(circleX + circlesDistance * i, circleY, radius, 0, Math.PI * 2);
        this.context.fill();
      }

      this.context.font = '24px "Roboto"';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillStyle = '#7c7c7c';
      this.context.fillText('     Please wait,     ', infoX + infoWidth / 2, infoY + 0);
      this.context.fillText('the images are loading', infoX + infoWidth / 2, infoY + 36);

      count = count === 3 ? 0 : count + 1;
    }, 300);
  }

  renderGameScreen(playfield) {
    this.clearScreen();
    for (let y = 0; y < playfield.length; y++) {
      for (let x = 0; x < playfield[y].length; x++) {
        if (playfield[y][x] !== 0) {
          const image = this.imagesList[playfield[y][x] - 1];
          const imgX = this.playfieldX + x * this.imageWidth;
          const imgY = this.playfieldY + y * this.imageHeight;
          this.renderImg(image, imgX, imgY);
        }
      }
    }
  }

  renderImageAnimation(prevX, prevY, nextX, nextY, imgNum) {
    const image = this.imagesList[imgNum - 1];
    let imgX = prevX;
    let imgY = prevY;
    let timerId = null;
    const step = this.imageWidth / 20;
    switch (true) {
      case (prevX === nextX && imgY > nextY):
        timerId = setInterval(() => {
          this.clearField(nextX, nextY, this.imageWidth, this.imageWidth * 2);
          if (imgY - step <= nextY) {
            imgY = nextY;
            clearInterval(timerId);
          } else {
            imgY -= step;
          }
          this.renderImg(image, imgX, imgY);
        }, 5);
        break;
      case (prevX === nextX && imgY < nextY):
        timerId = setInterval(() => {
          this.clearField(prevX, prevY, this.imageWidth, this.imageWidth * 2);
          if (imgY + step >= nextY) {
            imgY = nextY;
            clearInterval(timerId);
          } else {
            imgY += step;
          }
          this.renderImg(image, imgX, imgY);
        }, 5);
        break;
      case (prevY === nextY && imgX > nextX):
        timerId = setInterval(() => {
          this.clearField(nextX, nextY, this.imageWidth * 2, this.imageWidth);
          if (imgX - step <= nextX) {
            clearInterval(timerId);
            imgX = nextX;
          } else {
            imgX -= step;
          }
          this.renderImg(image, imgX, imgY);
        }, 5);
        break;
      case (prevY === nextY && imgX < nextX):
        timerId = setInterval(() => {
          this.clearField(prevX, prevY, this.imageWidth * 2, this.imageWidth);
          if (imgX + step >= nextX) {
            clearInterval(timerId);
            imgX = nextX;
          } else {
            imgX += step;
          }
          this.renderImg(image, imgX, imgY);
        }, 5);
        break;
      default:
        break;
    }
  }

  renderDragNDrop(playfield, imgNum, imgX, imgY) {
    const image = this.imagesList[imgNum - 1];
    this.renderGameScreen(playfield);
    this.renderImg(image, imgX - this.imageWidth / 2, imgY - this.imageWidth / 2);
  }

  renderImg(image, imgX, imgY) {
    this.context.strokeStyle = '#7c7c7c';
    this.context.lineWidth = this.imageBorderWidth;
    this.context.strokeRect(imgX, imgY, this.imageWidth, this.imageHeight);
    this.context.drawImage(
      image,
      imgX + this.imageBorderWidth,
      imgY + this.imageBorderWidth,
      this.imageInnerWidth,
      this.imageInnerHeight
    );
  }
}
