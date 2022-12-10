class Ship {
  private isVertical: boolean;
  private shipDiv: HTMLDivElement;

  constructor(shipDiv:HTMLDivElement) {
    this.shipDiv = shipDiv;
    this.bindEvents();
    this.detectTypeOfShip(this.shipDiv);
  }

  private detectTypeOfShip(shipDiv: HTMLDivElement) {
    if (shipDiv.classList.contains('ship_is-vertical')) {
      this.isVertical = true;
    }
    this.isVertical = false;
  }

  private bindEvents() {
    this.shipDiv.addEventListener('pointerdown', this.handlerShipClick)
  }
  
  private handlerShipClick() {
    console.log('click');
    console.log(this.isVertical);
  }
}

document.querySelectorAll('js-ship').forEach(elem => new Ship(elem as HTMLDivElement));