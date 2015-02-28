$(function () {

    var gridRows = 6,
        gridColumns = 6,
        squareSize = 100,
        maxWidth = squareSize * gridColumns,
        colors = ['red', 'yellow', 'purple', 'orange', 'green', 'blue', 'violet'],
        kinds = ['circle', 'square'];

    var randomChoice = function (arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }

    var getNextColor = function (colors, not1, not2) {
        var color = randomChoice(colors);
        if (color === not1 || color === not2) {
            return getNextColor(colors, not1, not2);
        } else {
            return color;
        }
    }

    var generateOuterColors = function (colors, totalSquares, gridColumns) {
        var outerColors = [],
            lastColor = null,
            upColor = null,
            nextOuterColor;
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
        var innerColors = [],
            color;
        for (var i = 0; i < outerColors.length; i++) {
            color = getNextColor(outerColors, outerColors[i], null)
            innerColors[innerColors.length] = color;
        };
        return innerColors;
    }

    var createSquare = function(index, outerColors, innerColors) {
        var cell = $("<div class='cell'/>"),
            svg = $("<svg/>"),
            outerSquare = $("<rect width='100' height='100' class='outer'/>"),
            outerColor = outerColors[index],
            shape = randomChoice(kinds),
            innerShape;

        outerSquare.attr('fill', outerColor);
        svg.append(outerSquare);

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
        var maxWidth = squareSize * gridColumns,
            totalSquares = gridRows * gridColumns,
            outerColors = generateOuterColors(colors, totalSquares, gridColumns),
            innerColors = generateInnerColors(outerColors),
            cell;

        $("#grid").empty();
        $("#grid").css("max-width", maxWidth);
        $('input[value="rows"]').val(gridRows);
        $('input[value="columns"]').val(gridColumns);
        for (var i = 0; i < totalSquares; i++) {
            cell = createSquare(i, outerColors, innerColors);
            $("#grid").append(cell);
            // hack: http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
            $("#grid").html($("#grid").html());
        };
    };

    var checkAllBoxes = function () {
        var colorCheckBoxes = $("input[name=color]");
        for (var i = 0; i < colorCheckBoxes.length; i++) {
            colorCheckBoxes[i].checked = true;
        };
    };


    $("#all").click(function (event) {
        event.preventDefault();
        checkAllBoxes();

    });

    $("#generate").on("click", function(event){
        event.preventDefault();
        var colors = [],
            colorCheckBoxes = $("input[name=color]"),
            rawRows = $('input[value="rows"]').val(),
            rawColumns = $('input[value="columns"]').val(),
            gridRows = parseInt(rawRows),
            gridColumns = parseInt(rawColumns);


        for (var i = 0; i < colorCheckBoxes.length; i++) {
            if (colorCheckBoxes[i].checked) {
                colors[colors.length] = colorCheckBoxes[i].value;
            };
        };

        if (gridRows.toString() === "NaN" || gridColumns.toString() === "NaN") {
            alert("Please enter integer amounts for rows and columns")
        } else if (colors.length < 3) {
            alert("Need at least three colors selected")
        } else {
            generate(colors, gridRows, gridColumns);
        };
    });

    checkAllBoxes();

    generate(colors, gridRows, gridColumns);

});
