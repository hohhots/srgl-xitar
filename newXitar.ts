/// <reference path="jquery.d.ts" />
/// <reference path='jqueryui.d.ts' />

class Cell {
    xitar:number;
    xitarIndex: number;
    hasHit: boolean;
    element: HTMLElement;

    constructor(public row: number, public column: number) {
        this.element = $("<div></div>")[0];
    }

    static parseCellLocation(pos: string) {
        var indices: string[] = pos.split(",");
        return { 'row': parseInt(indices[0]), 'column': parseInt(indices[1]) };
    }

    cellLocation() {
        return "" + this.row + "," + this.column;
    }
}

//states = {"normal","clicked","lastMoved",};

class Xitar {
    column:number = -1;
    row:number = 0;
    amid:boolean = true;
    //state:States;
    element: HTMLElement;
    drop:Function;
    cells:Cell[];
    moved:boolean = true;
    droped:Function;

    constructor(public iosocket, board:Board) {
        this.element = $("<img />")[0];
        this.cells = [];
        $(this).bind('idjaiEvent',$.proxy(board.idhLitsener,board));
    }

    updatePosition(row: number, column: number) {
        this.row = row;
        this.column = column;
        this.updateLayout();
    }
    
    idjai(xitarIndex:number){
        $(this).trigger("idjaiEvent",xitarIndex);
    }
    
    hasMoved(v:string){
        this.moved = true;
        //alert("hasMoved=========" + v);
        $(this).trigger("moved",v);
        
    }
    notMoved(){
        this.moved = false;
    }
    
    stopDrag(){
        for(var i = 0; i<this.cells.length; i++){
            //$(this.cells[i].element).droppable("disable");
        }
        $(this.cells).empty();
        if(!this.moved){
            this.updatePosition(this.row, this.column);
        }
    }
    
    cellDrop(x:number, y:number){
        //$(this.element).draggable("disable");
        this.hasMoved($(this.element).data("xitarIndex") + ',' + x + ',' + y);
        this.updatePosition(x, y);
    }    
    
    updateLayout() {
        this.element.style.left = "" + (this.column * 12.5) + "%";
        this.element.style.top = "" + (this.row * 12.5) + "%";
    }
    /*
    setCells(c:Cell[][]){
        this.cells = c;
    }
    */
    
    dropEnd(){
        
    }
    
    startDrag(cells:Cell[][]){
        
    }
    
    moveXitar(cellRaw:number, cellCol:number):boolean{
        this.updatePosition(cellRaw, cellCol);
        return true;
    }
    
    outFromBoard(xitar:number, xitarIndex:number){
        //alert(xitarIndex);
        this.element.style.position = 'absolute';
        this.element.style.top = 100+xitar*350+'px';
        if(xitarIndex > 7) {xitarIndex = 5}
        else if(xitarIndex > 4) {xitarIndex = 7 - xitarIndex;}
        this.element.style.left = xitarIndex*80+'px';
        //alert(xitar+':'+xitarIndex+':'+(700-xitar*500)+','+xitarIndex*80);
        this.amid = false;
        
    }
}

class Huu extends Xitar {
    constructor(public iosocket,img: String,public board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Huu.gif");
            $(this.element).addClass("xitar");
        
    }
    
    startDrag(cells:Cell[][]){
        var self = this;
        var i:number = 0;
        $(this.cells).empty();
        this.notMoved();
        if(this.row > 0){
            if(cells[this.row-1][this.column].xitar == -1){
                var x = this.row-1;
                var y = this.column;
                this.cells[i] = cells[this.row-1][this.column];
                i++;
                /*
                this.droped = function(e){
                    this.cellDrop(x,y);
                } ;
                */
                $(cells[this.row-1][this.column].element).droppable({
                    //drop:$.proxy(this,"droped")
                    drop:function(event,ui){self.cellDrop(x,y);}
                });
            }
            if(this.column < 7 && cells[this.row-1][this.column+1].xitar == 1){
                console.log('9999999999999999999');
                var x = this.row-1;
                var y = this.column+1;
                this.cells[i] = cells[x][y];
                i++;
                /*
                this.droped = function(e){
                    this.cellDrop(x,y);
                } ;
                */
                var targetCell = cells[x][y];
                $(cells[x][y].element).droppable({
                    //drop:$.proxy(this,"droped")
                    drop:function(event,ui){
                        self.cellDrop(x,y);
                        //self.board.xitars[1][targetCell.xitarIndex].outFromBoard(1,targetCell.xitarIndex);
                        self.idjai(targetCell.xitarIndex);
                    }
                });
            }
            
            if(this.column > 0 && cells[this.row-1][this.column-1].xitar == 1){
                console.log('8888888888888888888');
                var x = this.row-1;
                var y = this.column-1;
                this.cells[i] = cells[x][y];
                i++;
                var targetCell = cells[x][y];
                $(cells[x][y].element).droppable({
                    drop:function(event,ui){
                        self.cellDrop(x,y);
                        self.idjai(targetCell.xitarIndex);
                    }
                });
            }
            
            //alert(this.column+':'+cells[this.row-1][this.column+1].xitar);
            
            
            
        }
    }
}

class Hasag extends Xitar {
    constructor(public iosocket, img: String, board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Hasag.gif");
            $(this.element).addClass("xitar");
        
    }
}

class Mori extends Xitar {
    constructor(public iosocket, img: String, board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Mori.gif");
            $(this.element).addClass("xitar");
        
    }
}

class Teme extends Xitar {
    constructor(public iosocket, img: String, board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Teme.gif");
            $(this.element).addClass("xitar");
        
    }
}

class Bars extends Xitar {
    constructor(public iosocket, img: String, board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Bars.gif");
            $(this.element).addClass("xitar");
        
    }
}

class Han extends Xitar {
    constructor(public iosocket, img: String, board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Han.gif");
            $(this.element).addClass("xitar");
        
    }
}


class Board {
    startDrag:Function;
    stopDrag:Function;
    xitarMoved:boolean = false;
    xitars: Xitar[][];
    clickedXitar:Xitar;
    lastMovedXitar:Xitar;
    cells: Cell[][];
    bee:boolean = true;   // true:qagan     false:har
    playerTurn = false;
    onEvent: Function;           // Callback function when an action on the board occurs

    private positioningEnabled: boolean;    // Set to true when the player can position the xitar

    constructor(public element: HTMLElement, public iosocket, player) {
        this.cells = [];
        this.xitars = [];
        var referenceCell = $(this.createCells().element);

        if(player == 'har') this.bee = false;
        
        this.xitars[0] = [];
        this.xitars[1] = [];
        this.createHuu();
        this.createHasag();
        this.createMori();
        this.createTeme();
        this.createBars();
        this.createHan();
        
        for(var i = 0; i<16; i++){
             
        }
        
        for(var i = 0; i<16; i++){
            $(this.xitars[0][i].element).data("xitar",0).data("xitarIndex", i).draggable({
                    containment: 'parent',
                    grid: [referenceCell.width() * 0.99 + 2, referenceCell.height() * 0.99 + 2],
                    cursor: 'crosshair',
                    revert:"invalid"
                });
        }
        
        for(var i = 8; i<16; i++){
            this.startDrag = function(e){ this.xitars[0][$(e.target).data("xitarIndex")].startDrag(this.cells);};
            this.stopDrag = function(e){ 
                this.xitars[0][$(e.target).data("xitarIndex")].stopDrag();
                if(this.xitars[0][$(e.target).data("xitarIndex")].moved){
                    //this.allXitarDragDisable();
                }
            };
            $(this.xitars[0][i].element).draggable({
                start:$.proxy(this,"startDrag"),
                stop:$.proxy(this,"stopDrag")
            });
            
        }
        

        $(window).resize((evt) => {
            $(this.element).children(".xitar").draggable("option", "grid", [referenceCell.width() * 0.99 + 2, referenceCell.height() * 0.99 + 2]);
        });

    }
    
    idhLitsener(e,xitarIndex:number){
        //alert(' idjai:'+xitarIndex);
        //alert(typeof(this));
        this.xitars[1][xitarIndex].outFromBoard(1,xitarIndex);
    }

    allXitarDragDisable(){
        for(var i = 0; i<16; i++){
            $(this.xitars[0][i].element).draggable("disable");
        }
    }
    
    createHan(){
        var xitar: Xitar = null;
        var qaganHan:Han = new Han(this.iosocket, "qagan", this);
        var harHan:Han = new Han(this.iosocket, "har", this);
            
        this.element.appendChild(qaganHan.element);
        this.element.appendChild(harHan.element);
        if(this.bee){
            this.xitars[0][4] = qaganHan;
            this.xitars[1][4] = harHan;
        }else {
            this.xitars[1][4] = qaganHan;
            this.xitars[0][4] = harHan;
        }
        this.xitars[0][4].updatePosition(7, 4);
        this.cells[7][4].xitar = 0;
        this.cells[7][4].xitarIndex = 4;

        this.xitars[1][4].updatePosition(0, 4);
        this.cells[0][4].xitar = 1;
        this.cells[0][4].xitarIndex = 4;
            
    }
    
    
    createBars(){
        var xitar: Xitar = null;
        var qaganBars:Bars = new Bars(this.iosocket, "qagan", this);
        var harBars:Bars = new Bars(this.iosocket, "har", this);
            
        this.element.appendChild(qaganBars.element);
        this.element.appendChild(harBars.element);
        if(this.bee){
            this.xitars[0][3] = qaganBars;
            this.xitars[1][3] = harBars;
        }else {
            this.xitars[1][3] = qaganBars;
            this.xitars[0][3] = harBars;
        }
        this.xitars[0][3].updatePosition(7, 3);
        this.cells[7][3].xitar = 0;
        this.cells[7][3].xitarIndex = 3;
        
        this.xitars[1][3].updatePosition(0, 3);
        this.cells[0][3].xitar = 1;
        this.cells[0][3].xitarIndex = 3;
            
    }
    
    
    createTeme(){
        var xitar: Xitar = null;
        for(var i = 2; i<8; i+=3){
            var qaganTeme:Teme = new Teme(this.iosocket, "qagan", this);
            var harTeme:Teme = new Teme(this.iosocket, "har", this);
            
            this.element.appendChild(qaganTeme.element);
            this.element.appendChild(harTeme.element);
            if(this.bee){
                this.xitars[0][i] = qaganTeme;
                this.xitars[1][i] = harTeme;
            }else {
                this.xitars[1][i] = qaganTeme;
                this.xitars[0][i] = harTeme;
            }
            this.xitars[0][i].updatePosition(7, i);
            this.cells[7][i].xitar = 0;
            this.cells[7][i].xitarIndex =i;

            this.xitars[1][i].updatePosition(0, i);
            this.cells[0][i].xitar = 1;
            this.cells[0][i].xitarIndex =i;
            
        }
    }
    
    
    createMori(){
        var xitar: Xitar = null;
        for(var i = 1; i<8; i+=5){
            var qaganMori:Mori = new Mori(this.iosocket, "qagan", this);
            var harMori:Mori = new Mori(this.iosocket, "har", this);
            
            this.element.appendChild(qaganMori.element);
            this.element.appendChild(harMori.element);
            if(this.bee){
                this.xitars[0][i] = qaganMori;
                this.xitars[1][i] = harMori;
            }else {
                this.xitars[1][i] = qaganMori;
                this.xitars[0][i] = harMori;
            }
            this.xitars[0][i].updatePosition(7, i);
            this.cells[7][i].xitar = 0;
            this.cells[7][i].xitarIndex =i;

            this.xitars[1][i].updatePosition(0, i);
            this.cells[0][i].xitar = 1;
            this.cells[0][i].xitarIndex =i;
            
        }
    }
    
    
    createHasag(){
        var xitar: Xitar = null;
        for(var i = 0; i<8; i+=7){
            var qaganHasag:Hasag = new Hasag(this.iosocket, "qagan", this);
            var harHasag:Hasag = new Hasag(this.iosocket, "har", this);
            
            this.element.appendChild(qaganHasag.element);
            this.element.appendChild(harHasag.element);
            if(this.bee){
                this.xitars[0][i] = qaganHasag;
                this.xitars[1][i] = harHasag;
            }else {
                this.xitars[1][i] = qaganHasag;
                this.xitars[0][i] = harHasag;
            }
            this.xitars[0][i].updatePosition(7, i);
            this.cells[7][i].xitar = 0;
            this.cells[7][i].xitarIndex =i;

            this.xitars[1][i].updatePosition(0, i);
            this.cells[0][i].xitar = 1;
            this.cells[0][i].xitarIndex =i;
            
        }
    }
    
    createHuu(){
        var xitar: Xitar = null;
        for(var i = 8; i< 16; i++){
            var qaganHuu:Huu = new Huu(this.iosocket, "qagan", this);
            var harHuu:Huu = new Huu(this.iosocket, "har", this);
            
            this.element.appendChild(qaganHuu.element);
            this.element.appendChild(harHuu.element);
            if(this.bee){
                this.xitars[0][i] = qaganHuu;
                this.xitars[1][i] = harHuu;
            }else {
                this.xitars[1][i] = qaganHuu;
                this.xitars[0][i] = harHuu;
            }
            this.xitars[0][i].updatePosition(6, i-8);
            this.cells[6][i-8].xitar = 0;
            this.cells[6][i-8].xitarIndex =i;

            this.xitars[1][i].updatePosition(1, i-8);
            this.cells[1][i-8].xitar = 1;
            this.cells[1][i-8].xitarIndex =i;
            
        }
    }
        
    createCells():Cell{
        var cell: Cell = null;
        for (var row = 0; row < 8; row++) {
            this.cells[row] = [];
            for (var column = 0; column < 8; column++) {
                cell = new Cell(row, column);
                this.cells[row][column] = cell;
                this.cells[row][column].xitar = -1;
                this.cells[row][column].xitarIndex = -1;
                this.element.appendChild(cell.element);
                $(cell.element).data("cellX",row).data("cellY",column);
                if((row + column) % 2 === 0){
                    $(cell.element).addClass("cell nar");
                }else{
                    $(cell.element).addClass("cell sar");
                }
            }
        }
        return cell;
    }
    
    removeOwnXitar( cellRaw:number, cellCol:number){
        var xitarIndex = this.cells[cellRaw][cellCol].xitarIndex;
        if(xitarIndex != -1){
            //alert('------'+xitarIndex);
            this.xitars[0][xitarIndex].outFromBoard(0,xitarIndex);
            //alert(xitarIndex);
        }
    }
    

}

class Game {
    static gameState = { begin: 0, adversaryTurn: 1, playerTurn: 2, finished: 3 };
    static msgs = {
        gameStart: "Drag your xitars to the desired location on your board (on the right), then bomb a square on the left board to start the game!",
        invalidPositions: "All xitars must be in valid positions before the game can begin.",
        wait: "Wait your turn!",
        gameOn: "Game on!",
        hit: "Good hit!",
        xitarSunk: "You sunk a xitar!",
        lostxitar: "You lost a xitar :-(",
        lostGame: "You lost this time. Click anywhere on the left board to play again.",
        allSunk: "Congratulations!  You won!  Click anywhere on the left board to play again."
    };

    
    state = Game.gameState.begin;
    playerBoard: Board;

    constructor(public iosocket, player) {
        this.updateStatus(Game.msgs.gameStart);
        this.playerBoard = new Board($("#playerBoard")[0], this.iosocket, player);
        for(var i = 0; i<16; i++){
            $(this.playerBoard.xitars[0][i]).bind("moved", this.xitarListener);
            
        }
        var pb = this.playerBoard;
        this.iosocket.on('message',function(message){
            //alert(message);
            var num:number[] = message.toString().split(',');
            //alert(num[0]);
            pb.xitars[1][num[0]].moveXitar(7-num[1], num[2]);
            pb.removeOwnXitar(num[1], num[2]);
        });
        

        this.playerBoard.onEvent = (evt: string) => {
            switch (evt) {
                case 'playerMissed':
                case 'hit':
                    this.playerBoard.playerTurn = false;
                    break;
                case 'xitarSunk':
                    this.updateStatus(Game.msgs.lostxitar);
                    this.playerBoard.playerTurn = false;
                    break;
                case 'allSunk':
                    this.updateStatus(Game.msgs.lostGame);
                    this.playerBoard.playerTurn = true;
                    this.state = Game.gameState.finished;
                    break;
            }
        };
    }

    private adversaryTurn() {
        this.playerBoard.playerTurn = false;
        this.state = Game.gameState.adversaryTurn;
        setTimeout(() => {
            //this.playerBoard.chooseMove();
        }, 250);
    }

    private startGame() {
        this.state = Game.gameState.playerTurn;
        this.playerBoard.playerTurn = true;
        this.updateStatus(Game.msgs.gameOn);
    }

    private updateStatus(msg: string) {
        $("#status").slideUp('fast', function () {  // Slide out the old text
            $(this).text(msg).slideDown('fast');  // Then slide in the new text
        });
    }
    
    xitarListener(e,v:string){
        //alert(v + "------------------");
        this.iosocket.send(v);
    }
}
            
//$(new Function("var game = new Game(iosocket);"));