class Ship {
  private isVertical: boolean | undefined;
  private shipDiv: HTMLDivElement;
  private size: number;

  constructor(shipDiv:HTMLDivElement) {
    this.shipDiv = shipDiv;
    this.bindEvents();
    this.detectPositionAndSizeOfShips(this.shipDiv);
  }

  private detectPositionAndSizeOfShips(shipDiv: HTMLDivElement) {
    this.shipDiv.classList.forEach((c) => {
      if (c.includes('ship-')) {
        this.size = Number(c.split('-')[1]);
      }
    });
    if (this.size === 1) {
      this.isVertical = undefined;
    } else {
      if (shipDiv.classList.contains('ship_is-vertical')) {
        this.isVertical = true;
      }
      this.isVertical = false;
    }
  }

  private bindEvents() {
    this.shipDiv.addEventListener('pointerdown', this.handlerShipClick.bind(this));
  }
  
  private handlerShipClick(event:PointerEvent) {
    this.shipDiv.style.position = 'absolute';
    this.shipDiv.style.zIndex = '1000';

    document.body.append(this.shipDiv);

    const moveAt = (pageX: number, pageY: number) =>  {
      this.shipDiv.style.left = pageX - this.shipDiv.offsetWidth / 2 + 'px';
      this.shipDiv.style.top = pageY - this.shipDiv.offsetHeight / 2 + 'px';
    }

    moveAt(event.pageX, event.pageY);

    const onPointerMove = (event: PointerEvent) => {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('pointermove', onPointerMove);

    const pointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
    }

    document.addEventListener('pointerup', pointerUp);

    this.shipDiv.ondragstart = () => {
      return false;
    };

  }
}

document.querySelectorAll('.js-ship').forEach(elem => new Ship(elem as HTMLDivElement));