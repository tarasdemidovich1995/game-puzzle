export default class View {
  constructor(elem, width, height) {
    this.elem = elem;
    this.width = width;
    this.height = height;

    this.createCanvas();
    this.createPlayfield();
    this.createGamePanel();
    this.elem.appendChild(this.canvas);

    this.loadScreenTimer = null;
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');
  }

  createPlayfield() {
    this.playfieldWidth = this.width - 200;
    this.playfieldHeight = this.height;
    this.playfieldBorderWidth = 4;
    this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
    this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;
    this.playfieldX = this.playfieldBorderWidth;
    this.playfieldY = this.playfieldBorderWidth;
  }

  createGamePanel() {
    this.panelWidth = 190;
    this.panelHeight = this.height;
    this.panelX = this.playfieldWidth + this.playfieldBorderWidth * 2 + 10;
    this.panelY = 0;

    this.timePanelWidth = this.panelWidth;
    this.timePanelHeight = 24;
    this.timePanelX = this.panelX;
    this.timePanelY = this.panelY;

    this.stepPanelWidth = this.panelWidth;
    this.stepPanelHeight = 24;
    this.stepPanelX = this.timePanelX;
    this.stepPanelY = this.timePanelY + 24;

    this.context.textAlign = 'start';
    this.context.textBaseline = 'top';
    this.context.font = '14px "Press Start 2P';
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

  clearLoadScreen() {
    clearInterval(this.loadScreenTimer);
    this.loadScreenTimer = null;
    this.clearScreen();
  }

  clearPlayfield() {
    this.context.clearRect(0, 0, this.playfieldWidth, this.playfieldHeight);
  }

  clearGamePanel() {
    this.context.clearRect(this.panelX, this.panelY, this.panelWidth, this.panelHeight);
  }

  clearStepPanel() {
    this.context.clearRect(this.stepPanelX, this.stepPanelY, this.stepPanelWidth, this.stepPanelHeight);
  }

  clearTimePanel() {
    this.context.clearRect(this.timePanelX, this.timePanelY, this.timePanelWidth, this.timePanelHeight);
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
        this.context.fillStyle = 'black';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.arc(circleX + circlesDistance * i, circleY, radius, 0, Math.PI * 2);
        this.context.fill();
      }

      this.context.fillStyle = 'black';
      this.context.fillText('     Please wait,     ', infoX, infoY + 0);
      this.context.fillText('the images are loading', infoX, infoY + 24);

      count = count === 3 ? 0 : count + 1;
    }, 300);
  }

  renderGameScreen(playfield) {
    this.clearPlayfield();
    this.context.strokeStyle = 'red';
    this.context.lineWidth = this.playfieldBorderWidth;
    this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight);
    for (let i = 0; i < playfield.length; i++) {
      for (let j = 0; j < playfield[i].length; j++) {
        if (playfield[i][j] !== 0) {
          const image = this.imagesList[playfield[i][j] - 1];
          const imgX = j;
          const imgY = i;
          this.drawImg(image, imgX, imgY);
        }
      }
    }
  }

  renderStepPanel(steps) {
    this.clearGamePanel();
    this.context.fillStyle = 'black';
    this.context.fillText(`Steps: ${steps}`, this.stepPanelX, this.stepPanelY);
  }

  renderTimePanel(time) {
    this.clearTimePanel();
    this.context.fillStyle = 'black';
    this.context.fillText(`Time: ${time}`, this.timePanelX, this.timePanelY);
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
