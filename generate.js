$(function () {

    gridRows = 6;
    gridColumns = 8;

    squareSize = 100;

    maxWidth = squareSize * gridColumns;

    totalSquares = gridRows * gridColumns;

    colors = ['red', 'yellow', 'purple', 'orange', 'green', 'blue', 'violet', 'cyan'];
    kinds = ['circle', 'square'];


    var randomChoice = function (arr) {
        index = Math.floor(Math.random() * arr.length);
        return arr[index]
    }

    var getNextOuterColor = function (colors, lastColor, upColor) {
        color = randomChoice(colors);
        if (color === lastColor || color === upColor) {
            return getNextOuterColor(colors, lastColor, upColor);
        } else {
            return color;
        }
    }

    var generateOuterColors = function (colors, totalSquares, gridColumns) {
        outerColors = [];
        lastColor = null;
        upColor = null;
        for (var i = 0; i < totalSquares; i++) {
            if (i > 0) {
                lastColor = outerColors[outerColors.length - 1];
            };
            if (i >= gridColumns) {
                upColor = outerColors[i - gridColumns];
            };
            nextOuterColor = getNextOuterColor(colors, lastColor, upColor);
            outerColors[outerColors.length] = nextOuterColor;
        };
        return outerColors;
    }

    var generateColorArray = function (rowWidth, totalSquares) {
        colorArray = [];
        lastColor = null;
        upColor = null;
        for (var i = 0; i < totalSquares; i++) {
            color = chooseFromArray(colors, lastColor);
            lastColor = color;
            if (i >= rowWidth - 1) {
                upColor = colorArray[i - rowWidth + 1]
            }

            colorArray.push(color);
        };
        return colorArray
    }

    var chooseFromArray = function (arr, except) {
        index = Math.floor(Math.random() * arr.length);
        if (arr[index] === except) {
            return chooseFromArray(arr, except);
        }
        return arr[index];
    };

    var createSquare = function(index, colorArray) {
        cell = $("<div class='cell'/>");
        svg = $("<svg/>");
        outerSquare = $("<rect width='100' height='100' class='outer'/>")
        outerColor = colorArray[index];
        outerSquare.attr('fill', outerColor);
        svg.append(outerSquare);

        shape = chooseFromArray(kinds, null);
        if (shape === 'circle') {
            innerShape = $('<circle cx="50" cy="50" r="35" class="inner"/>');
        } else {
            // it's a square
                innerShape = $('<rect width="70" height="70" x="15" y="15" class="inner" />');

        };
        innerShape.attr('fill', chooseFromArray(colors, outerColor));
        svg.append(innerShape);
        cell.append(svg);
        return cell
    };

    var generate = function() {
        $("#grid").css("max-width", maxWidth);
        colorArray = generateColorArray(gridColumns, totalSquares);
        for (var i = 0; i < totalSquares; i++) {

            cell = createSquare(i, colorArray);
            $("#grid").append(cell);
            // hack: http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
            $("#grid").html($("#grid").html());
        };
    };

    generate();
});