$(function () {

    gridRows = 6;
    gridColumns = 6;

    squareSize = 100;

    maxWidth = squareSize * gridColumns;

    totalSquares = gridRows * gridColumns;

    colors = ['red', 'yellow', 'purple', 'orange', 'green', 'blue', 'violet', 'cyan'];
    kinds = ['circle', 'square'];


    var randomChoice = function (arr) {
        index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }

    var getNextColor = function (colors, not1, not2) {
        color = randomChoice(colors);
        if (color === not1 || color === not2) {
            return getNextColor(colors, not1, not2);
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
            nextOuterColor = getNextColor(colors, lastColor, upColor);
            outerColors[outerColors.length] = nextOuterColor;
        };
        return outerColors;
    };

    var generateInnerColors = function (outerColors) {
        innerColors = [];
        for (var i = 0; i < outerColors.length; i++) {
            color = getNextColor(outerColors, outerColors[i], null)
            innerColors[innerColors.length] = color;
        };
        return innerColors;
    }

    var createSquare = function(index, outerColors, innerColors) {
        cell = $("<div class='cell'/>");
        svg = $("<svg/>");
        outerSquare = $("<rect width='100' height='100' class='outer'/>")
        outerColor = outerColors[index];
        outerSquare.attr('fill', outerColor);
        svg.append(outerSquare);

        shape = randomChoice(kinds);
        if (shape === 'circle') {
            innerShape = $('<circle cx="50" cy="50" r="35" class="inner"/>');
        } else {
            // it's a square
            innerShape = $('<rect width="70" height="70" x="15" y="15" class="inner" />');

        };
        innerShape.attr('fill', innerColors[index]);
        svg.append(innerShape);
        cell.append(svg);
        return cell
    };

    var generate = function(colors, gridRows, gridColumns) {
        maxWidth = squareSize * gridColumns;
        $("#grid").empty();
        $("#grid").css("max-width", maxWidth);
        $('input[value="rows"]').val(gridRows);
        $('input[value="columns"]').val(gridColumns);
        totalSquares = gridRows * gridColumns;
        outerColors = generateOuterColors(colors, totalSquares, gridColumns);
        innerColors = generateInnerColors(outerColors);
        for (var i = 0; i < totalSquares; i++) {
            cell = createSquare(i, outerColors, innerColors);
            $("#grid").append(cell);
            // hack: http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
            $("#grid").html($("#grid").html());
        };
    };


    $("#all").click(function () {
        event.preventDefault();
        var colorCheckBoxes = $("input[name=color]");
        for (var i = 0; i < colorCheckBoxes.length; i++) {
            if (!colorCheckBoxes[i].checked) {
                colorCheckBoxes[i].click();
            };
        };
    });

    $("#generate").on("click", function(event){
        event.preventDefault();
        var colors = []
        var colorCheckBoxes = $("input[name=color]");
        for (var i = 0; i < colorCheckBoxes.length; i++) {
            if (colorCheckBoxes[i].checked) {
                colors[colors.length] = colorCheckBoxes[i].value;
            };
        };
        rawRows = $('input[value="rows"]').val();
        rawColumns = $('input[value="columns"]').val();

        gridRows = parseInt(rawRows);
        gridColumns = parseInt(rawColumns);

        if (gridRows.toString() === "NaN" || gridColumns.toString() === "NaN") {
            alert("Please enter integer amounts for rows and columns")
        } else if (colors.length < 3) {
            alert("Need at least three colors selected")
        } else {
            generate(colors, gridRows, gridColumns);
        };
    });

    $("input[name=color]").click();

    generate(colors, gridRows, gridColumns);

});
