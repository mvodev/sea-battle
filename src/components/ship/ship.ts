class Ship {
  private isVertical: boolean | undefined;
  private shipDiv: HTMLDivElement;
  private size!: number;
  private SHIP_SIZE_IN_PX = 30;
  private callback: (message:string|null) => void;
  private THRESHFOLD_OF_DETECTING_MOVE = 5;// when click on ship its getting vertical or gorizontal
                                          // and this value as 5px need to detect whether we click on ship or
                                          // trying to move it

  constructor(shipDiv: HTMLDivElement, callback: (message:string | null) => void) {
    this.shipDiv = shipDiv;
    this.bindEvents();
    this.detectPositionAndSizeOfShips(this.shipDiv);
    this.callback = callback;
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
    this.shipDiv.addEventListener('pointerdown', this.handlerShipClick);
  }

  private changeOrientation = () => {
    this.shipDiv.classList.toggle('ship_is-vertical');
    this.isVertical = !this.isVertical;
  }
  
  private handlerShipClick = (event:PointerEvent) => {
    const initialShiftX = event.clientX;
    const initialShiftY = event.clientY;
    let shiftX = event.clientX - this.shipDiv.getBoundingClientRect().left;
    let shiftY = event.clientY - this.shipDiv.getBoundingClientRect().top;
    let currentDroppable: Element | null = null;

    const moveAt = (pageX: number, pageY: number) =>  {
      if (Math.abs(initialShiftX - pageX) > this.THRESHFOLD_OF_DETECTING_MOVE 
      || Math.abs(initialShiftY - pageY) > this.THRESHFOLD_OF_DETECTING_MOVE) {
        this.shipDiv.style.position = 'absolute';
        this.shipDiv.style.zIndex = '1000';
        document.body.append(this.shipDiv);
      }
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

    const onPointerUp = (event:PointerEvent) => {
      if (Math.abs(initialShiftX - event.clientX) < this.THRESHFOLD_OF_DETECTING_MOVE 
      || Math.abs(initialShiftY - event.clientY) < this.THRESHFOLD_OF_DETECTING_MOVE) {
          this.changeOrientation();
      }
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    }

    document.addEventListener('pointerup', onPointerUp);

    this.shipDiv.ondragstart = () => {
      return false;
    };

  }

  private handleDroppable (
    currentDroppable: Element,
    shiftX: number,
    shiftY: number,
    direction: 'leave' | 'enter') {
      let iDs = '';
      iDs += currentDroppable.getAttribute('data-id') + ' '+this.isVertical + ' '+ this.size;
      if (this.size !== 1) {
        const cellsBefore = Math.floor(shiftX/this.SHIP_SIZE_IN_PX);
        const cellsAfter = Math.floor(((this.size * this.SHIP_SIZE_IN_PX) - shiftX)/this.SHIP_SIZE_IN_PX);
        iDs += 'cellsBefore '+cellsBefore;
        iDs += 'cellAfter' + cellsAfter;
      }
    // if (this.size === 1) {
    //   // direction === 'leave' ? currentDroppable.classList.remove('active') :currentDroppable.classList.add('active');
    // } else {
    //   const cellsBefore = Math.floor(shiftX/this.SHIP_SIZE_IN_PX);
    //   const cellsAfter = Math.floor(((this.size * this.SHIP_SIZE_IN_PX) - shiftX)/this.SHIP_SIZE_IN_PX);
    //   direction === 'leave' ? currentDroppable.classList.remove('active') :currentDroppable.classList.add('active');
    //   if (cellsBefore > 0) {
    //     let before = cellsBefore;
    //     let previosCell = currentDroppable.previousElementSibling;
    //     while (before > 0) {
    //       if (previosCell) {
    //         //direction === 'leave' ? previosCell.classList.remove('active') : previosCell.classList.add('active');
    //         iDs += '|~|'+previosCell?.getAttribute('data-id');
    //         previosCell = previosCell.previousElementSibling;
    //       }
    //       before--;
    //     }
    //   }
    //   if (cellsAfter > 0) {
    //     let after = cellsAfter;
    //     let afterCell = currentDroppable.nextElementSibling;
    //     while (after > 0) {
    //       if (afterCell) {
    //         //direction === 'leave' ? afterCell.classList.remove('active') : afterCell.classList.add('active');
    //         iDs += '|~|'+afterCell?.getAttribute('data-id');
    //         afterCell = afterCell.nextElementSibling;
    //       }
    //       after--;
    //     }
    //   }  
    // }
    this.callback(iDs);
  }
}
export default Ship;



