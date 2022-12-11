class Ship {
  private isVertical: boolean;
  private shipDiv: HTMLDivElement;
  private size: number;

  constructor(shipDiv:HTMLDivElement) {
    this.shipDiv = shipDiv;
    this.bindEvents();
    this.detectPositionAndSizeOfShip(this.shipDiv);
  }

  private detectPositionAndSizeOfShip(shipDiv: HTMLDivElement) {
    if (shipDiv.classList.contains('ship_is-vertical')) {
      this.isVertical = true;
    }
    this.isVertical = false;
    this.shipDiv.classList.forEach((c) => {
      if (c.includes('ship-')) {
        this.size = Number(c.split('-')[1]);
      }
    });
  }

  private bindEvents() {
    this.shipDiv.addEventListener('pointerdown', this.handlerShipClick.bind(this));
  }
  
  private handlerShipClick() {
    console.log('inside handlerShipClick');
  }
}

document.querySelectorAll('.js-ship').forEach(elem => new Ship(elem as HTMLDivElement));