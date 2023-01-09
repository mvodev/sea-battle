class Ship {
  private isVertical: boolean | undefined;
  private shipDiv: HTMLDivElement;
  private size!: number;
  private shipSize = 30;

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
    let shiftX = event.clientX - this.shipDiv.getBoundingClientRect().left;
    let shiftY = event.clientY - this.shipDiv.getBoundingClientRect().top;
    this.shipDiv.style.position = 'absolute';
    this.shipDiv.style.zIndex = '1000';
    let currentDroppable: Element|null = null;

    document.body.append(this.shipDiv);

    const moveAt = (pageX: number, pageY: number) =>  {
      this.shipDiv.style.left = pageX - shiftX + 'px';
      this.shipDiv.style.top = pageY - shiftY + 'px';
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
          this.handleDroppable(currentDroppable, shiftX, shiftY, 'leave');
        }
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          this.handleDroppable(currentDroppable, shiftX, shiftX, 'enter');
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

  private handleDroppable (
    currentDroppable: Element,
    shiftX: number,
    shiftY: number,
    direction: 'leave' | 'enter') {
    if (this.size === 1) {
      direction === 'leave' ? currentDroppable.classList.remove('active') :currentDroppable.classList.add('active');
    } else {
      const cellsBefore = Math.floor(shiftX/this.shipSize);
      const cellsAfter = Math.floor(((this.size * this.shipSize) - shiftX)/this.shipSize);
      direction === 'leave' ? currentDroppable.classList.remove('active') :currentDroppable.classList.add('active');
      if (cellsBefore > 0) {
        let before = cellsBefore;
        let previosCell = currentDroppable.previousElementSibling;
        while (before > 0) {
          if (previosCell) {
            direction === 'leave' ? previosCell.classList.remove('active') : previosCell.classList.add('active');
            previosCell = previosCell.previousElementSibling;
          }
          before--;
        }
      }
      if (cellsAfter > 0) {
        let after = cellsAfter;
        let afterCell = currentDroppable.nextElementSibling;
        while (after > 0) {
          if (afterCell) {
            direction === 'leave' ? afterCell.classList.remove('active') : afterCell.classList.add('active');
            afterCell = afterCell.nextElementSibling;
          }
          after--;
        }
      }  
    }
  }
}
export default Ship;



