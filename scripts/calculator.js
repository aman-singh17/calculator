$(function () {
    if ($('ams-calculator').length == 0) {
        $('body').append('<ams-calculator><ams-operatorrow></ams-operatorrow><ams-numbers></ams-numbers></ams-calculator>');
    }

    let functionsInitialized = false;
    function initCalculator() {
        createButtons();
    }

    const operators = ['%', '/', 'x', '+', '-', '='];
    function createButtons() {
        for (let i = 9; i >= 0; i--) {
            $('ams-calculator ams-numbers').append('<button class="number" data-val="' + i + '">' + i + '</button>');
        }

        $('ams-calculator ams-numbers .number[data-val="0"]').addClass('wideNumber');
        $('ams-calculator ams-numbers').append('<button class="number" data-val=".">.</button>')

        operators.forEach(operation => {
            $('ams-calculator ams-operatorrow').append('<button class="operator" data-val="' + operation + '">' + operation + '</button>');
        });

        $('ams-calculator').append('<input class="result" type="text" value="0" disabled="disabled">');
        initializeFunctions();
    }

    let oldValue, newValue, currentOperator;

    function initializeFunctions() {
        if (functionsInitialized) {
            return;
        }
        $('ams-calculator .number').on('click', function () {
            newValue = $('ams-calculator .result').val() + $(this).data('val');
            if (typeof currentOperator !== 'undefined') {
                newValue = $(this).data('val');
            }
            $('ams-calculator .result').val(newValue);
            console.log("$('ams-calculator .result').val()", $('ams-calculator .result').val())
            console.log("$(this).data('val')", $(this).data('val'))
            currentOperator = $('ams-calculator .operator.active').data('val');
            $('ams-calculator .operator').removeClass('active');
        });


        $('ams-calculator .operator').on('click', function () {
            if (typeof newValue !== 'undefined') {
                if (typeof currentOperator !== 'undefined') {
                    console.log('oldValue', oldValue);
                    console.log('newValue', newValue);
                    newValue = calculate(oldValue, newValue, currentOperator);
                    $('ams-calculator .result').val(newValue);
                } else {
                    $('ams-calculator .result').val('');
                }
                oldValue = newValue;
                newValue = undefined;
            }

            currentOperator = $(this).data('val');
        });

        $('ams-calculator .operator').on('click', function () {
            $('ams-calculator .operator').removeClass('active');
            $(this).addClass('active');
        });

    }


    function calculate(value1, value2, operation) {
        value1 = parseFloat(value1);
        value2 = parseFloat(value2);
        switch (operation) {
            case '%':
                return value1 % value2;
            case '/':
                return value1 / value2;
            case 'x':
                return value1 * value2;
            case '+':
                return value1 + value2;
            case '-':
                return value1 - value2;
            default:
                break;
        }
    }



    initCalculator();
})