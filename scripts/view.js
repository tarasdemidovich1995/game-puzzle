export default class View {
  constructor(elem, width, height) {
    this.elem = elem;
    this.width = width;
    this.height = height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');

    this.playfieldWidth = this.width - 200;
    this.playfieldHeight = this.height;
    this.playfieldBorderWidth = 4;
    this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
    this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;
    this.playfieldX = this.playfieldBorderWidth;
    this.playfieldY = this.playfieldBorderWidth;

    this.panelWidth = 190;
    this.panelHeight = this.height;
    this.panelX = this.playfieldWidth + this.playfieldBorderWidth * 2 + 10;
    this.panelY = 0;

    this.loadScreenTimer = null;

    this.elem.appendChild(this.canvas);
  }

  async setState(size) {
    this.size = size;
    this.imageBorderWidth = 2;
    this.imageWidth = this.playfieldInnerWidth / size;
    this.imageHeight = this.playfieldInnerHeight / size;
    this.imageInnerWidth = this.imageWidth - this.imageBorderWidth * 2;
    this.imageInnerHeight = this.imageHeight - this.imageBorderWidth * 2;
    return this.downloadImages(size);
  }

  async downloadImages(size) {
    const listLength = size * size;
    const promises = [];
    this.renderLoadScreen();
    for (let i = 1; i < listLength; i++) {
      const img = new Image();
      const promise = new Promise((resolve, reject) => {
        img.onload = () => {
          setTimeout(() => {
            resolve(img);
          }, 500);
        };
        img.onerror = () => reject(new Error('image loading error'));
      });
      img.src = `./images/${size}x${size}/image_${i < 10 ? '0' : ''}${i}.jpg`;
      promises.push(promise);
    }
    await Promise.all(promises).then((values) => {
      clearInterval(this.loadScreenTimer);
      this.imagesList = values;
    });
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderLoadScreen() {
    let count = 0;
    this.loadScreenTimer = setInterval(() => {
      const panelWidth = 300;
      const panelHeight = 200;
      const panelX = this.width / 2 - panelWidth / 2;
      const panelY = this.height / 2 - panelHeight / 2;
      const smallCircleRadius = 5;
      const bigCircleRadius = 7.5;
      const circlesDistance = 30;
      const circleY = panelY + panelHeight / 2;
      const circleX = panelX + panelWidth / 2 - circlesDistance * 1.5;
      this.clearScreen();

      for (let i = 0; i < 4; i++) {
        const radius = i === count ? bigCircleRadius : smallCircleRadius;
        this.context.fillStyle = 'black';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(circleX + circlesDistance * i, circleY, radius, 0, Math.PI * 2);
        this.context.fill();
      }

      this.context.textAlign = 'start';
      this.context.textBaseline = 'top';
      this.context.fillStyle = 'black';
      this.context.font = '14px "Press Start 2P';
      this.context.fillText('     Please wait,     ', panelX, panelY + 0);
      this.context.fillText('the images are loading', panelX, panelY + 24);

      count = count === 3 ? 0 : count + 1;
    }, 300);
  }

  renderPlayfield(playfield) {
    this.clearScreen();
    this.context.strokeStyle = 'red';
    this.context.lineWidth = this.playfieldBorderWidth;
    this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight);
    for (let i = 0; i < playfield.length; i++) {
      for (let j = 0; j < playfield[i].length; j++) {
        if (playfield[i][j] === 0) return;
        const image = this.imagesList[playfield[i][j] - 1];
        const imgX = j;
        const imgY = i;
        this.drawImg(image, imgX, imgY);
      }
    }
  }

  drawImg(image, x, y) {
    const fieldX = this.playfieldX + x * this.imageWidth;
    const fieldY = this.playfieldY + y * this.imageHeight;
    const imgX = fieldX + this.imageBorderWidth;
    const imgY = fieldY + this.imageBorderWidth;

    this.context.strokeStyle = 'yellow';
    this.context.lineWidth = this.imageBorderWidth;
    this.context.strokeRect(fieldX, fieldY, this.imageWidth, this.imageHeight);
    this.context.drawImage(image, imgX, imgY, this.imageInnerWidth, this.imageInnerHeight);
  }
}
