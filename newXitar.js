/// <reference path="jquery.d.ts" />
/// <reference path='jqueryui.d.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Cell = (function () {
    function Cell(row, column) {
        this.row = row;
        this.column = column;
        this.element = $("<div></div>")[0];
    }
    Cell.parseCellLocation = function (pos) {
        var indices = pos.split(",");
        return { 'row': parseInt(indices[0]), 'column': parseInt(indices[1]) };
    };
    Cell.prototype.cellLocation = function () {
        return "" + this.row + "," + this.column;
    };
    return Cell;
})();
//states = {"normal","clicked","lastMoved",};
var Xitar = (function () {
    //cells:Cell[][];
    function Xitar() {
        this.column = -1;
        this.row = 0;
        this.amid = true;
        this.element = $("<img />")[0];
    }
    Xitar.prototype.updatePosition = function (row, column) {
        this.row = row;
        this.column = column;
        this.updateLayout();
    };
    Xitar.prototype.updateLayout = function () {
        this.element.style.left = "" + (this.column * 12.5) + "%";
        this.element.style.top = "" + (this.row * 12.5) + "%";
    };
    /*
    setCells(c:Cell[][]){
        this.cells = c;
    }
    */
    Xitar.prototype.startDrag = function (cells) {
    };
    return Xitar;
})();
var Huu = (function (_super) {
    __extends(Huu, _super);
    function Huu(img) {
        _super.call(this);
        $(this.element).attr("src", "img/" + img + "Huu.gif");
        $(this.element).addClass("xitar");
    }
    Huu.prototype.startDrag = function (cells) {
        //var cells:Cell[][] = event.data.cells;
        if (this.row > 0) {
            alert("hhhhhhhhhhhhhh" + this.row + "  " + this.column);
            $(cells[this.row - 1][this.column].element).droppable({
                drop: function (event, ui) {
                    alert("dddddddddddddddddd");
                    ui.draggable.draggable("disable");
                }
            });
        }
    };
    return Huu;
})(Xitar);
var Hasag = (function (_super) {
    __extends(Hasag, _super);
    function Hasag(img) {
        _super.call(this);
        $(this.element).attr("src", "img/" + img + "Hasag.gif");
        $(this.element).addClass("xitar");
    }
    return Hasag;
})(Xitar);
var Mori = (function (_super) {
    __extends(Mori, _super);
    function Mori(img) {
        _super.call(this);
        $(this.element).attr("src", "img/" + img + "Mori.gif");
        $(this.element).addClass("xitar");
    }
    return Mori;
})(Xitar);
var Teme = (function (_super) {
    __extends(Teme, _super);
    function Teme(img) {
        _super.call(this);
        $(this.element).attr("src", "img/" + img + "Teme.gif");
        $(this.element).addClass("xitar");
    }
    return Teme;
})(Xitar);
var Bars = (function (_super) {
    __extends(Bars, _super);
    function Bars(img) {
        _super.call(this);
        $(this.element).attr("src", "img/" + img + "Bars.gif");
        $(this.element).addClass("xitar");
    }
    return Bars;
})(Xitar);
var Han = (function (_super) {
    __extends(Han, _super);
    function Han(img) {
        _super.call(this);
        $(this.element).attr("src", "img/" + img + "Han.gif");
        $(this.element).addClass("xitar");
    }
    return Han;
})(Xitar);
var Board = (function () {
    function Board(element) {
        var _this = this;
        this.element = element;
        this.bee = true; // true:qagan     false:har
        this.playerTurn = false;
        this.cells = [];
        this.xitars = [];
        var referenceCell = $(this.createCells().element);
        this.xitars[0] = [];
        this.xitars[1] = [];
        this.createHuu();
        this.createHasag();
        this.createMori();
        this.createTeme();
        this.createBars();
        this.createHan();
        for (var i = 0; i < 16; i++) {
            $(this.xitars[0][i].element).data("xitar", 0).data("xitarIndex", i).draggable({
                containment: 'parent',
                grid: [referenceCell.width() * 0.99 + 2, referenceCell.height() * 0.99 + 2],
                cursor: 'crosshair',
                revert: "invalid"
            });
        }
        for (var i = 8; i < 16; i++) {
            this.ff = function (e) { this.xitars[0][$(e.target).data("xitarIndex")].startDrag(this.cells); };
            $(this.xitars[0][i].element).draggable({
                start: $.proxy(this, "ff")
            });
        }
        $(window).resize(function (evt) {
            $(_this.element).children(".xitar").draggable("option", "grid", [referenceCell.width() * 0.99 + 2, referenceCell.height() * 0.99 + 2]);
        });
    }
    Board.prototype.createHan = function () {
        var xitar = null;
        var qaganHan = new Han("qagan");
        var harHan = new Han("har");
        this.element.appendChild(qaganHan.element);
        this.element.appendChild(harHan.element);
        if (this.bee) {
            this.xitars[0][4] = qaganHan;
            this.xitars[1][4] = harHan;
        }
        else {
            this.xitars[1][4] = qaganHan;
            this.xitars[0][4] = harHan;
        }
        this.xitars[0][4].updatePosition(7, 4);
        this.xitars[1][4].updatePosition(0, 4);
    };
    Board.prototype.createBars = function () {
        var xitar = null;
        var qaganBars = new Bars("qagan");
        var harBars = new Bars("har");
        this.element.appendChild(qaganBars.element);
        this.element.appendChild(harBars.element);
        if (this.bee) {
            this.xitars[0][3] = qaganBars;
            this.xitars[1][3] = harBars;
        }
        else {
            this.xitars[1][3] = qaganBars;
            this.xitars[0][3] = harBars;
        }
        this.xitars[0][3].updatePosition(7, 3);
        this.xitars[1][3].updatePosition(0, 3);
    };
    Board.prototype.createTeme = function () {
        var xitar = null;
        for (var i = 2; i < 8; i += 3) {
            var qaganTeme = new Teme("qagan");
            var harTeme = new Teme("har");
            this.element.appendChild(qaganTeme.element);
            this.element.appendChild(harTeme.element);
            if (this.bee) {
                this.xitars[0][i] = qaganTeme;
                this.xitars[1][i] = harTeme;
            }
            else {
                this.xitars[1][i] = qaganTeme;
                this.xitars[0][i] = harTeme;
            }
            this.xitars[0][i].updatePosition(7, i);
            this.xitars[1][i].updatePosition(0, i);
        }
    };
    Board.prototype.createMori = function () {
        var xitar = null;
        for (var i = 1; i < 8; i += 5) {
            var qaganMori = new Mori("qagan");
            var harMori = new Mori("har");
            this.element.appendChild(qaganMori.element);
            this.element.appendChild(harMori.element);
            if (this.bee) {
                this.xitars[0][i] = qaganMori;
                this.xitars[1][i] = harMori;
            }
            else {
                this.xitars[1][i] = qaganMori;
                this.xitars[0][i] = harMori;
            }
            this.xitars[0][i].updatePosition(7, i);
            this.xitars[1][i].updatePosition(0, i);
        }
    };
    Board.prototype.createHasag = function () {
        var xitar = null;
        for (var i = 0; i < 8; i += 7) {
            var qaganHasag = new Hasag("qagan");
            var harHasag = new Hasag("har");
            this.element.appendChild(qaganHasag.element);
            this.element.appendChild(harHasag.element);
            if (this.bee) {
                this.xitars[0][i] = qaganHasag;
                this.xitars[1][i] = harHasag;
            }
            else {
                this.xitars[1][i] = qaganHasag;
                this.xitars[0][i] = harHasag;
            }
            this.xitars[0][i].updatePosition(7, i);
            this.xitars[1][i].updatePosition(0, i);
        }
    };
    Board.prototype.createHuu = function () {
        var xitar = null;
        for (var i = 8; i < 16; i++) {
            var qaganHuu = new Huu("qagan");
            var harHuu = new Huu("har");
            this.element.appendChild(qaganHuu.element);
            this.element.appendChild(harHuu.element);
            if (this.bee) {
                this.xitars[0][i] = qaganHuu;
                this.xitars[1][i] = harHuu;
            }
            else {
                this.xitars[1][i] = qaganHuu;
                this.xitars[0][i] = harHuu;
            }
            this.xitars[0][i].updatePosition(6, i - 8);
            this.xitars[1][i].updatePosition(1, i - 8);
        }
    };
    Board.prototype.createCells = function () {
        var cell = null;
        for (var row = 0; row < 8; row++) {
            this.cells[row] = [];
            for (var column = 0; column < 8; column++) {
                cell = new Cell(row, column);
                this.cells[row][column] = cell;
                this.element.appendChild(cell.element);
                if ((row + column) % 2 === 0) {
                    $(cell.element).addClass("cell nar");
                }
                else {
                    $(cell.element).addClass("cell sar");
                }
            }
        }
        return cell;
    };
    return Board;
})();
var Game = (function () {
    function Game() {
        var _this = this;
        this.state = Game.gameState.begin;
        this.updateStatus(Game.msgs.gameStart);
        this.playerBoard = new Board($("#playerBoard")[0]);
        this.playerBoard.onEvent = function (evt) {
            switch (evt) {
                case 'playerMissed':
                case 'hit':
                    _this.playerBoard.playerTurn = false;
                    break;
                case 'shipSunk':
                    _this.updateStatus(Game.msgs.lostShip);
                    _this.playerBoard.playerTurn = false;
                    break;
                case 'allSunk':
                    _this.updateStatus(Game.msgs.lostGame);
                    _this.playerBoard.playerTurn = true;
                    _this.state = Game.gameState.finished;
                    break;
            }
        };
    }
    Game.prototype.adversaryTurn = function () {
        this.playerBoard.playerTurn = false;
        this.state = Game.gameState.adversaryTurn;
        setTimeout(function () {
            //this.playerBoard.chooseMove();
        }, 250);
    };
    Game.prototype.startGame = function () {
        this.state = Game.gameState.playerTurn;
        this.playerBoard.playerTurn = true;
        this.updateStatus(Game.msgs.gameOn);
    };
    Game.prototype.updateStatus = function (msg) {
        $("#status").slideUp('fast', function () {
            $(this).text(msg).slideDown('fast'); // Then slide in the new text
        });
    };
    Game.gameState = { begin: 0, adversaryTurn: 1, playerTurn: 2, finished: 3 };
    Game.msgs = {
        gameStart: "Drag your ships to the desired location on your board (on the right), then bomb a square on the left board to start the game!",
        invalidPositions: "All ships must be in valid positions before the game can begin.",
        wait: "Wait your turn!",
        gameOn: "Game on!",
        hit: "Good hit!",
        shipSunk: "You sunk a ship!",
        lostShip: "You lost a ship :-(",
        lostGame: "You lost this time. Click anywhere on the left board to play again.",
        allSunk: "Congratulations!  You won!  Click anywhere on the left board to play again."
    };
    return Game;
})();
$(new Function("var game = new Game();"));
