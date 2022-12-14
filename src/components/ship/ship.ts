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
    let currentDroppable: Element|null = null;

    document.body.append(this.shipDiv);

    const moveAt = (pageX: number, pageY: number) =>  {
      this.shipDiv.style.left = pageX - this.shipDiv.offsetWidth / 2 + 'px';
      this.shipDiv.style.top = pageY - this.shipDiv.offsetHeight / 2 + 'px';
    }

    moveAt(event.pageX, event.pageY);

    const onPointerMove = (event: PointerEvent) => {
      moveAt(event.pageX, event.pageY);
      this.shipDiv.hidden = true;
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      this.shipDiv.hidden = false;

      if (!elemBelow) return;

      let droppableBelow = elemBelow.closest('.js-droppable');

      if (currentDroppable != droppableBelow) {

        if (currentDroppable) {
          this.leaveDroppable(currentDroppable);
        }
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          this.enterDroppable(currentDroppable);
        }
      }
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

  private leaveDroppable(currentDroppable: Element) {
    currentDroppable.classList.remove('active');
  }

  private enterDroppable(currentDroppable: Element) {
    currentDroppable.classList.add('active');
  }
}

document.querySelectorAll('.js-ship').forEach(elem => new Ship(elem as HTMLDivElement));


