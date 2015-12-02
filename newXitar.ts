/// <reference path="jquery.d.ts" />
/// <reference path='jqueryui.d.ts' />

class Cell {
    xitar:number;
    xitarIndex: number;
    element: HTMLElement;

    constructor(public row: number, public column: number) {
        this.element = $("<div></div>")[0];
    }

    static parseCellLocation(pos: string) {
        var indices: string[] = pos.split(",");
        return { 'row': parseInt(indices[0]), 'column': parseInt(indices[1]) };
    }

    cellLocation() {
        return "" + this.row+ "," + this.column;
    }
}


class Xitar {
    column:number = -1;
    row:number = -1;
    element: HTMLElement;
    cells:Cell[] = [];
    targetNum:number = -1;
    ithNum:number = -1;
    moved:boolean = true;

    constructor(public iosocket,public board:Board) {
        var board = this.board;
        this.element = $("<img />")[0];
        this.cells = [];
        $(this).bind('idjaiEvent',$.proxy(board.idhLitsener,board));
    }

    updatePosition(row: number, column: number) {
        this.row = row;
        this.column = column;
        this.updateLayout();
    }
    
    updateLayout() {
        this.element.style.left = "" + (this.column * 12.5) + "%";
        this.element.style.top = "" + (this.row * 12.5) + "%";
    }
    
    idjai(xitarI:number){
        $(this).trigger("idjaiEvent",xitarI);
    }

    outFromBoard(xitar:number, xitarIndex:number){
        this.row = -1;
        this.column = -1;
        this.board.element.removeChild(this.element);
        $(this.element).removeClass('xitar');
        if($(this.element).data('xitar') == 0){
            $('#deerHairqig').append(this.element);
        }else if($(this.element).data('xitar') == 1){
            $('#doorHairqig').append(this.element);
        }
    }

    hasMoved(v:string){
        this.moved = true;
        $(this).trigger("moved",v);
        
    }
    notMoved(){
        this.moved = false;
    }
    
    moveXitar(cellRaw:number, cellCol:number):boolean{
        this.updatePosition(cellRaw, cellCol);
        return true;
    }
    
    startDrag(cells:Cell[][]){
        
    }
    
    stopDrag(){
        for(var i = 0; i<this.cells.length; i++){
            $(this.cells[i].element).droppable("destroy");
        }
        this.cells.length = 0;
    }
    cellYImg(n:number):string{
        var str:string = '<img src="img/aa.gif" />';
        switch(n){
            case 1:str = '<img src="img/na.gif" />';
                break;
            case 2:str = '<img src="img/ba.gif" />';
                break;
            case 3:str = '<img src="img/pa.gif" />';
                break;
            case 4:str = '<img src="img/ha.gif" />';
                break;
            case 5:str = '<img src="img/ga.gif" />';
                break;
            case 6:str = '<img src="img/ma.gif" />';
                break;
            case 7:str = '<img src="img/la.gif" />';
                break;
        }
        return str;
    }
    cellDrop(x:number, y:number, oldCell:Cell){
        
        var x1:number = x;
        x1++;
        var yablt = document.createElement('div');
        var yabltNum = document.createElement('div');
        $('#yablt').append(yablt);
        $(yablt).addClass('yablt');
        $('#yablt').append(yabltNum);
        $(yabltNum).addClass('yabltNum');
        var img1:string = this.cellYImg($(oldCell.element).data('cellY'));
        var img2:string = this.cellYImg(y);
        $(yablt).html(img1 + ($(oldCell.element).data('cellX')+1) +'<br />|<br />' +img2+ x1);
        $(yablt).trigger('create');
        $(yabltNum).html(''+ this.board.yabltNum);
        $(yabltNum).trigger('create');
        yablt.style.left = (this.board.yabltNum*35) + 'px';
        yabltNum.style.left = (this.board.yabltNum*35-3) + 'px';
        this.board.yabltNum++;
        
        oldCell.xitar = -1;oldCell.xitarIndex = -1;
        //console.log('>>' + $(oldCell.element).data('cellX') +'-'+ $(oldCell.element).data('cellY'));
        //newCell.xitar = 0;newCell.xitarIndex = $(this.element).data("xitarIndex");
        //console.log('>>>>' + x +'-'+ y);
        this.board.cells[x][y].xitar = 0;
        this.board.cells[x][y].xitarIndex = $(this.element).data("xitarIndex");
        //console.log('>>>>>>>>' + x +'-'+ y);
        this.updatePosition(x, y);
        this.hasMoved($(this.element).data("xitarIndex") + ',' + x + ',' + y);
    }
    
    xitarStartDrag(i:number, cells:Cell[][], u_d:number, r_l:number):{i:number, b:boolean}{
        var self = this;
            console.log(i + '::' + (this.row+u_d) +' : '+ (this.column+r_l) +' - '+ cells[this.row+u_d][this.column+r_l].xitar);
                if(cells[this.row+u_d][this.column+r_l].xitar == -1){
                    this.cells[i] = cells[this.row+u_d][this.column+r_l];
                    i++;
                    (function (u_d,r_l){
                        $(cells[self.row+u_d][self.column+r_l].element).droppable({
                            drop:function(event,ui){
                                self.cellDrop(self.row+u_d,self.column+r_l,cells[self.row][self.column]);
                            }
                        });   
                    })(u_d,r_l);
                    return {i:i,b:false};
                }
                if(cells[this.row+u_d][this.column+r_l].xitar == 1){
                    this.cells[i] = cells[this.row+u_d][this.column+r_l];
                    i++;
                    (function (u_d,r_l){
                        $(cells[self.row+u_d][self.column+r_l].element).droppable({
                            drop:function(event,ui){
                                self.idjai(cells[self.row+u_d][self.column+r_l].xitarIndex);
                                self.cellDrop(self.row+u_d,self.column+r_l,cells[self.row][self.column]);
                            }
                        });
                    })(u_d,r_l);
                    return {i:i, b:true};
                }
                if(cells[this.row+u_d][this.column+r_l].xitar == 0){
                    console.log('break: ' + (this.row+u_d) +' : '+ (this.column+r_l));
                    return {i:i, b:true};
                }
    }
}
class Bars extends Xitar {
    constructor(public iosocket, img: String, board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Bars.png");
            $(this.element).addClass("xitar");
        
    }
    
    startDrag(cells:Cell[][]){
        if(this.board.firstStep){
            return;
        }
        var returnObj:{i:number, b:boolean}
        var i:number = 0;
        $(this.cells).empty();
        this.notMoved();
        var k:number = 1;
        while(this.row-k >= 0 && this.column-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,-k,-k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.row-k >= 0 && this.column+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,-k,k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.row-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,-k,0);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.row+k <= 7 && this.column-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,k,-k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.row+k <= 7 && this.column+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,k,k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.row+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,k,0);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.column-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,0,-k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.column+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,0,k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('-----------------------');
        for(var i = 0; i<this.cells.length; i++){
            console.log($(this.cells[i].element).data('cellX') +' - '+ $(this.cells[i].element).data('cellY'));
        }
        console.log('=======================');
    }
}

class Huu extends Xitar {
    constructor(public iosocket,img: String,public board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Huu.png");
            $(this.element).addClass("xitar");
        
    }
    
    startDrag(cells:Cell[][]){
        var self = this;
        var i:number = 0;
        $(this.cells).empty();
        this.notMoved();
        
        if(this.board.firstStep){
            if(this.row == 6){
                if((this.column == 4 && cells[3][4].xitar == 1)||(this.column == 4 && cells[3][4].xitar == -1 && cells[3][3].xitar == -1)){
                   this.cells[i] = cells[this.row-2][this.column];
                    i++;
                    $(cells[this.row-2][this.column].element).droppable({
                        drop:function(event,ui){
                            self.cellDrop(self.row-2,self.column,cells[6][4]);
                            self.board.firstStepMoved();
                        }
                    });
                }
                if((this.column == 3 && cells[3][3].xitar == 1)||(this.column == 3 && cells[3][4].xitar == -1 && cells[3][3].xitar == -1)){
                    this.cells[i] = cells[this.row-2][this.column];
                    i++;
                    $(cells[this.row-2][this.column].element).droppable({
                        drop:function(event,ui){
                            self.cellDrop(self.row-2,self.column,cells[6][3]);
                            self.board.firstStepMoved();
                        }
                    });
                }
            }
            return;
        }
        
        if(this.row > 0){
            if(cells[this.row-1][this.column].xitar == -1){
                this.cells[i] = cells[this.row-1][this.column];
                i++;
                $(cells[this.row-1][this.column].element).droppable({
                    drop:function(event,ui){self.cellDrop(self.row-1,self.column,cells[self.row][self.column]);}
                });
            }

            if(this.column > 0 && cells[this.row-1][this.column-1].xitar == 1){
                this.cells[i] = cells[this.row-1][this.column-1];
                i++;
                $(cells[this.row-1][this.column-1].element).droppable({
                    drop:function(event,ui){
                        self.idjai(cells[self.row-1][self.column-1].xitarIndex);
                        self.cellDrop(self.row-1,self.column-1,cells[self.row][self.column]);
                    }
                });
            }
            
            if(this.column < 7 && cells[this.row-1][this.column+1].xitar == 1){
                this.cells[i] = cells[this.row-1][this.column+1];
                i++;
                $(cells[this.row-1][this.column+1].element).droppable({
                    drop:function(event,ui){
                        self.idjai(cells[self.row-1][self.column+1].xitarIndex);
                        self.cellDrop(self.row-1,self.column+1,cells[self.row][self.column]);
                    }
                });
            }

        }
    }
}

class Hasag extends Xitar {
    constructor(public iosocket, img: String, board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Hasag.png");
            $(this.element).addClass("xitar");
        
    }
    startDrag(cells:Cell[][]){
        if(this.board.firstStep){
            return;
        }
        var returnObj:{i:number, b:boolean}
        var i:number = 0;
        $(this.cells).empty();
        this.notMoved();
        var k:number = 1;
        k = 1;
        while(this.row-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,-k,0);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.row+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,k,0);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.column-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,0,-k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.column+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,0,k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('-----------------------');
        for(var i = 0; i<this.cells.length; i++){
            console.log($(this.cells[i].element).data('cellX') +' - '+ $(this.cells[i].element).data('cellY'));
        }
        console.log('=======================');
    }
}

class Mori extends Xitar {
    constructor(public iosocket, img: String, board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Mori.png");
            $(this.element).addClass("xitar");
        
    }

    startDrag(cells:Cell[][]){
        if(this.board.firstStep){
            return;
        }
        var returnObj:{i:number, b:boolean}
        var i:number = 0;
        $(this.cells).empty();
        this.notMoved();
        if(this.row-1 >= 0 && this.column-2 >= 0){
            returnObj = this.xitarStartDrag(i,cells,-1,-2);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row-2 >= 0 && this.column-1 >= 0){
            returnObj = this.xitarStartDrag(i,cells,-2,-1);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row-2 >= 0 && this.column+1 <= 7){
            returnObj = this.xitarStartDrag(i,cells,-2,1);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row-1 >= 0 && this.column+2 <= 7){
            returnObj = this.xitarStartDrag(i,cells,-1,2);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row+1 <= 7 && this.column+2 <= 7){
            returnObj = this.xitarStartDrag(i,cells,1,2);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row+2 <= 7 && this.column+1 <= 7){
            returnObj = this.xitarStartDrag(i,cells,2,1);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row+2 <= 7 && this.column-1 >= 0){
            returnObj = this.xitarStartDrag(i,cells,2,-1);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row+1 <= 7 && this.column-2 >= 0){
            returnObj = this.xitarStartDrag(i,cells,1,-2);
            i = returnObj.i;
        }
        console.log('-----------------------');
        for(var i = 0; i<this.cells.length; i++){
            console.log($(this.cells[i].element).data('cellX') +' - '+ $(this.cells[i].element).data('cellY'));
        }
        console.log('=======================');
    }
}

class Teme extends Xitar {
    constructor(public iosocket, img: String, board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Teme.png");
            $(this.element).addClass("xitar");
        
    }

    startDrag(cells:Cell[][]){
        if(this.board.firstStep){
            return;
        }
        var returnObj:{i:number, b:boolean}
        var i:number = 0;
        $(this.cells).empty();
        this.notMoved();
        var k:number = 1;
        while(this.row-k >= 0 && this.column-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,-k,-k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.row-k >= 0 && this.column+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,-k,k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.row+k <= 7 && this.column-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,k,-k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('<-------------****------------>');
        k = 1;
        while(this.row+k <= 7 && this.column+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,k,k);
            i = returnObj.i;
            if(returnObj.b){break;}
            k++;
        }
        console.log('-----------------------');
        for(var i = 0; i<this.cells.length; i++){
            console.log($(this.cells[i].element).data('cellX') +' - '+ $(this.cells[i].element).data('cellY'));
        }
        console.log('=======================');
    }

}


class Han extends Xitar {
    constructor(public iosocket, img: String, board:Board) {
        super(iosocket, board);
            $(this.element).attr("src","img/"+img+"Han.png");
            $(this.element).addClass("xitar");
        
    }

    startDrag(cells:Cell[][]){
        if(this.board.firstStep){
            return;
        }
        var returnObj:{i:number, b:boolean}
        var i:number = 0;
        $(this.cells).empty();
        this.notMoved();
        var k:number = 1;
        if(this.row-k >= 0 && this.column-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,-k,-k);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row-k >= 0 && this.column+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,-k,k);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,-k,0);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row+k <= 7 && this.column-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,k,-k);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row+k <= 7 && this.column+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,k,k);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.row+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,k,0);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.column-k >= 0){
            returnObj = this.xitarStartDrag(i,cells,0,-k);
            i = returnObj.i;
        }
        console.log('<-------------****------------>');
        if(this.column+k <= 7){
            returnObj = this.xitarStartDrag(i,cells,0,k);
            i = returnObj.i;
        }
        console.log('-----------------------');
        for(var i = 0; i<this.cells.length; i++){
            console.log($(this.cells[i].element).data('cellX') +' - '+ $(this.cells[i].element).data('cellY'));
        }
        console.log('=======================');
    }
}


class Board {
    startDrag:Function;
    stopDrag:Function;
    xitars: Xitar[][];
    cells: Cell[][];
    firstStep:boolean = true;
    bee:boolean = true;   // true:qagan     false:har
    yabltNum:number = 1;

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
            $(this.xitars[1][i].element).data("xitar",1).data("xitarIndex", i);
            $(this.xitars[0][i].element).data("xitar",0).data("xitarIndex", i).draggable({
                    containment: 'parent',
                    grid: [referenceCell.width() * 0.99 + 2, referenceCell.height() * 0.99 + 2],
                    cursor: 'crosshair',
                    revert:"invalid"
                });
        }
        
        for(var i = 0; i<16; i++){
            this.startDrag = function(e){ 
                this.xitars[0][$(e.target).data("xitarIndex")].startDrag(this.cells);
            };
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
    
    firstStepMoved(){
        this.firstStep = false;
    }
    
    idhLitsener(e,xitarIndex:number){
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
                if((row+ column) % 2 === 0){
                    $(cell.element).addClass("cell nar");
                }else{
                    $(cell.element).addClass("cell sar");
                }
            }
        }
        return cell;
    }
    
    updateYbalt(xitarIndex:number, cellX:number, cellY:number){
        var cellX1:number = cellX;
        cellX1++;
        
        var oldCell = this.cells[this.xitars[1][xitarIndex].row][this.xitars[1][xitarIndex].column];
        var yablt = document.createElement('div');
        var yabltNum = document.createElement('div');
        $('#yablt').append(yablt);
        $(yablt).addClass('yablt');
        $('#yablt').append(yabltNum);
        $(yabltNum).addClass('yabltNum');
        var img1:string = this.xitars[1][xitarIndex].cellYImg($(oldCell.element).data('cellY'));
        var img2:string = this.xitars[1][xitarIndex].cellYImg(cellY);
        //alert(img2 +':'+ cellY)
        $(yablt).html(img1 + ($(oldCell.element).data('cellX')+1) +'<br />|<br />' +img2+ cellX1);
        $(yablt).trigger('create');
        $(yabltNum).html(''+ this.yabltNum);
        $(yabltNum).trigger('create');
        yablt.style.left = (this.yabltNum*35) + 'px';
        yabltNum.style.left = (this.yabltNum*35-3) + 'px';
        this.yabltNum++;
        
    }

    removeOwnXitar( cellRaw:number, cellCol:number){
        var xitarIndex = this.cells[cellRaw][cellCol].xitarIndex;
        if(xitarIndex != -1){
            this.xitars[0][xitarIndex].outFromBoard(0,xitarIndex);
        }
    }
    

}
class inputMogolWusug{
    pre:number = 32;
    prePre:number = 32;
    keypress:Function;
    constructor(){
        $('#inputDiv').append('<img id="cursor" src="img/cursor.gif" width="37" height="1" />');
        this.keypress = function(event){
            console.log(event.which);
            console.log('---'+this.pre+'+++');
            console.log('==='+this.prePre+'---');
            switch(event.which){
                case  32:
                    if(this.pre == 97 || this.pre == 105 || this.pre == 111 || this.pre == 109 || this.pre == 108 || this.pre == 115 || this.pre == 114 || this.pre == 103 || this.pre == 110 || this.pre == 98 || this.pre == 112 || this.pre == 104 || this.pre == 78){
                        $('#inputDiv img').last().prev().remove();
                        $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(this.pre)+'6.png" />');
                    }
                    $('#inputDiv img').last().before('<img src="img/space.png" />');
                    break;
                case  97:
                    if(this.pre == 32){
                        $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(event.which)+'.png" />');
                        //$('#cursor').insertBefore('<img src="img/'+String.fromCharCode(event.which)+'.png" />');
                    }else if(this.pre == 98 || this.pre == 112 || this.pre == 104){
                        $('#inputDiv img').last().prev().remove();
                        if(this.prePre == 32){
                            $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(this.pre)+String.fromCharCode(event.which)+'.png" />');
                        }else{
                            $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(this.pre)+String.fromCharCode(event.which)+'1.png" />');                            
                        }
                    }else{
                        $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(event.which)+'1.png" />');
                    }
                    break;
                case  105:
                case  111:
                    if(this.pre == 98 || this.pre == 112 || this.pre == 104){
                        $('#inputDiv img').last().prev().remove();
                        if(this.prePre == 32){
                            $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(this.pre)+String.fromCharCode(event.which)+'.png" />');
                        }else{
                            $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(this.pre)+String.fromCharCode(event.which)+'1.png" />');                            
                        }
                    }else{
                        $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(event.which)+'1.png" />');
                    }
                    break;
                case  117:
                case  73:
                    if(this.pre == 98 || this.pre == 112 || this.pre == 104){
                        $('#inputDiv img').last().prev().remove();
                        $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(this.pre)+String.fromCharCode(event.which)+'6.png" />');
                    }else{
                        $('#inputDiv img').last().prev().remove();
                        $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(event.which).toLowerCase()+'6.png" />');
                    }
                    break;
                case  69:
                    if(this.pre == 111 || this.pre == 105 || this.pre == 97 || this.pre == 109 || this.pre == 108 || this.pre == 115 || this.pre == 114 || this.pre == 103 || this.pre == 110 || this.pre == 98 || this.pre == 104){
                        $('#inputDiv img').last().prev().remove();
                        $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(this.pre)+'6.png" />');
                    }
                    $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(event.which)+'6.png" />');
                    break;
                case  109:
                case  108:
                case  115:
                case  114:
                case  103:
                case  110:
                case  98:
                case  104:
                //-------------------------------
                case  112:
                case  120:
                case  100:
                case  113:
                case  106:
                case  121:
                    if(this.pre == 32){
                        $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(event.which)+'.png" />');
                    }else{
                        $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(event.which)+'1.png" />');
                    }
                    break;
                case  116:
                case  72:
                    $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(event.which)+'.png" />');
                    break;
                case  78:
                    $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(event.which)+'1.png" />');
                    break;
                case  101:
                case  71:
                    $('#inputDiv img').last().before('<img src="img/'+String.fromCharCode(event.which)+'6.png" />');
                    break;
            }
            this.prePre = this.pre;
            if(event.which != 69){
                this.pre = event.which;
            }else{
                this.pre = 32;
            }
        };
        $(document).keypress($.proxy(this,'keypress'));
    }
}

class Game {
    playerBoard: Board;
    iM:inputMogolWusug;
    sendM:Function;
    receiveM:Function;
    messageNum:number = 0;
    constructor(public iosocket, player) {
        this.playerBoard = new Board($("#playerBoard")[0], this.iosocket, player);
        for(var i = 0; i<16; i++){
            $(this.playerBoard.xitars[0][i]).bind("moved", this.xitarListener);
            
        }
        this.iM = new inputMogolWusug();
        var pb = this.playerBoard;
        this.iosocket.on('message',function(message){
            var num:number[] = message.toString().split(',');
            pb.updateYbalt(num[0], 7 - num[1], num[2]);
            pb.removeOwnXitar(7 - num[1], num[2]);
            pb.cells[pb.xitars[1][num[0]].row][pb.xitars[1][num[0]].column].xitar = -1;
            pb.cells[pb.xitars[1][num[0]].row][pb.xitars[1][num[0]].column].xitarIndex = -1;
            pb.cells[7 - num[1]][num[2]].xitar = 1;
            pb.cells[7 - num[1]][num[2]].xitarIndex = num[0];
            pb.xitars[1][num[0]].moveXitar(7-num[1], num[2]);
        });
        this.receiveM = function(message){
            //alert(message);
            var sendM = document.createElement('div');
            $('#message_M').append(sendM);
            $(sendM).addClass('message_M');
            sendM.style.left = (this.messageNum*47) + 'px';
            console.log('qqqqqq:'+sendM.style.left);
            this.messageNum++;
            $(sendM).html(message);
        }
        
        this.iosocket.on('sendM',$.proxy(this,'receiveM'));
        
        this.sendM = function(){
            //alert('send');
            $('#inputDiv img').last().remove();
            this.iM.prePre = 32;
            this.iM.pre = 32;
            if($('#inputDiv').html() != ''){
                var sendM = document.createElement('div');
                $('#message_M').append(sendM);
                $(sendM).addClass('message_M');
                $(sendM).html($('#inputDiv').html());
                sendM.style.left = (this.messageNum*41) + 'px';
                console.log(sendM.style.left);
                this.messageNum++;
                this.iosocket.emit('sendM',$('#inputDiv').html());
            }
            $('#inputDiv').html('<img src="img/cursor.gif" width="37" height="1" />');
        }
        $('#send_botton').click(
            $.proxy(this,'sendM')
        );
    }

    private updateStatus(msg: string) {
        $("#status").slideUp('fast', function () {  // Slide out the old text
            $(this).text(msg).slideDown('fast');  // Then slide in the new text
        });
    }
    
    xitarListener(e,v:string){
        this.iosocket.send(v);
    }
}
            
//$(new Function("var game = new Game(iosocket);"));