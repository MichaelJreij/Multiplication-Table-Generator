$(document).ready(function () {
    initializeSlider("#sliderStartHorizontal", "#startHorizontal");
    initializeSlider("#sliderEndHorizontal", "#endHorizontal");
    initializeSlider("#sliderStartVertical", "#startVertical");
    initializeSlider("#sliderEndVertical", "#endVertical");

    $("#tabs").tabs();

    $("#startHorizontal, #endHorizontal, #startVertical, #endVertical").on(
        "input",
        function () {
            const sliderId =
                "#" +
                $(this)
                    .attr("id")
                    .replace("start", "sliderStart")
                    .replace("end", "sliderEnd");
            $(sliderId).slider("value", $(this).val());
        }
    );

    $("#deleteSelectedTabs").on("click", function () {
        const selectedTabs = $("#tabs ul li input:checked");
        selectedTabs.each(function () {
            const tabId = $(this).closest("li").remove().attr("aria-controls");
            $("#" + tabId).remove();
        });
        $("#tabs").tabs("refresh");
        toggleDeleteButtons();
    });

    $("#deleteAllTabs").on("click", function () {
        $("#tabs ul li").remove();
        $("#tabs div").remove();
        $("#tabs").tabs("refresh");
        toggleDeleteButtons();
    });

    $("#multiplicationForm").validate({
        rules: {
            startHorizontal: {
                required: true,
                number: true,
                range: [-50, 50],
            },
            endHorizontal: {
                required: true,
                number: true,
                range: [-50, 50],
            },
            startVertical: {
                required: true,
                number: true,
                range: [-50, 50],
            },
            endVertical: {
                required: true,
                number: true,
                range: [-50, 50],
            },
        },

        messages: {
            startHorizontal: {
                required: "Please enter a value for the start row",
                range: "Please enter a value between -50 and 50",
            },
            endHorizontal: {
                required: "Please enter a value for the end row",
                range: "Please enter a value between -50 and 50",
            },
            startVertical: {
                required: "Please enter a value for the start column",
                range: "Please enter a value between -50 and 50",
            },
            endVertical: {
                required: "Please enter a value for the end column",
                range: "Please enter a value between -50 and 50",
            },
        },

        onkeyup: function (element) {
            $(element).valid();
            if ($("#multiplicationForm").valid()) {
                newTabs();
            }
        },

        submitHandler: function (form) {
            newTabs();
            return false;
        },
    });

    $("#tabs").on("tabsactivate", function () {
        toggleDeleteButtons();
    });

    toggleDeleteButtons();
});

function newTabs() {
    const startRow = parseInt($("#startHorizontal").val());
    const endRow = parseInt($("#endHorizontal").val());
    const startColumn = parseInt($("#startVertical").val());
    const endColumn = parseInt($("#endVertical").val());

    const tabId = `tab-${startColumn}-${endColumn}-${startRow}-${endRow}`;
    const checkBoxId = `checkbox-${startColumn}-${endColumn}-${startRow}-${endRow}`;

    if ($("#tabs ul li a[href='#" + tabId + "']").length > 0) {
        return;
    }

    const generatedTables = generateTable(
        startRow,
        endRow,
        startColumn,
        endColumn
    );

    $("#tabs ul").append(
        `<li><input type="checkbox" id="${checkBoxId}"/><a href="#${tabId}">[${startRow}/${endRow} , ${startColumn}/${endColumn}]</a></li>`
    );

    $("#tabs").append(`<div id="${tabId}"></div>`);
    $(`#${tabId}`).append(generatedTables);

    $("#tabs").tabs("refresh");

    const tabIndex = $("#tabs ul li").length - 1;

    $("#tabs").tabs("option", "active", tabIndex);
}

function generateTable(startRow, endRow, startColumn, endColumn) {
    const tableContainer = $("<div class='table-container'></div>");
    const table = $("<table></table>");

    const verticalStep = startRow <= endRow ? 1 : -1;
    const horizontalStep = startColumn <= endColumn ? 1 : -1;

    for (
        let i = startRow - verticalStep;
        i !== endRow + verticalStep;
        i += verticalStep
    ) {
        const row = $("<tr></tr>");
        for (
            let j = startColumn - horizontalStep;
            j !== endColumn + horizontalStep;
            j += horizontalStep
        ) {
            const cell = $("<td></td>");
            if (i === startRow - verticalStep && j === startColumn - horizontalStep) {
                cell.addClass("blank_header");
            } else if (i === startRow - verticalStep) {
                cell.html(`<strong>${j}</strong>`).addClass("row_header");
            } else if (j === startColumn - horizontalStep) {
                cell.html(`<strong>${i}</strong>`).addClass("column_header");
            } else {
                cell.text(i * j);
            }

            row.append(cell);
        }

        table.append(row);
    }
    tableContainer.append(table);
    return tableContainer;
}

function initializeSlider(sliderId, inputId) {
    $(sliderId).slider({
        range: "min",
        min: -50,
        max: 50,
        slide: function (event, ui) {
            $(inputId).val(ui.value);
        },
        change: function (event, ui) {
            $(inputId).valid();
            if ($("#multiplicationForm").valid()) {
                newTabs();
            }
        },
    });
}

function toggleDeleteButtons() {
    const deleteButtons = $("#deleteSelectedTabs");
    const deleteAllButtons = $("#deleteAllTabs");
    const tabs = $("#tabs");
    const tabsCount = $("#tabs ul li").length;
    if (tabsCount > 0) {
        deleteButtons.show();
        deleteAllButtons.show();
        tabs.show();
    } else {
        deleteButtons.hide();
        deleteAllButtons.hide();
        tabs.hide();
    }
}
