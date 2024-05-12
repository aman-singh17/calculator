$(function () {
    if ($('ams-calculator').length == 0) {
        $('body').append('<ams-calculator><ams-operatorrow></ams-operatorrow><ams-numbers></ams-numbers></ams-calculator>');
    }

    let functionsInitialized = false;
    function initCalculator() {
        createButtons();
    }

    const operators = ['C', '+/-', '/', '%', '=', '-', '+', 'x'];
    function createButtons() {
        for (let i = 9; i >= 0; i--) {
            if (i != 9 && i % 3 == 0) {
                createOperator($('ams-calculator ams-numbers'), operators.pop());
            }
            createNumber($('ams-calculator ams-numbers'), i);
        }

        $('ams-calculator ams-numbers .number[data-val="0"]').addClass('wideNumber');
        $('ams-calculator ams-numbers').append('<button class="number" data-val=".">.</button>')
        createOperator($('ams-calculator ams-numbers'), operators.pop());

        operators.forEach(operation => {
            createOperator($('ams-calculator ams-operatorrow'), operation);
        });

        $('ams-calculator').prepend('<input class="result" type="text" value="0" disabled="disabled">');
        initializeFunctions();
    }


    function createNumber(selector, number) {
        $(selector).append('<button class="number" data-val="' + number + '">' + number + '</button>');
    }

    function createOperator(selector, operation) {
        $(selector).append('<button class="operator" data-val="' + operation + '">' + operation + '</button>');

    }

    let value1, value2, oldvalue2, resultValue, currentOperator, lastOperator, newOperation;
    newOperation = true;

    function initializeFunctions() {
        if (functionsInitialized) {
            return;
        }
        $('ams-calculator .number').on('click', function () {
            let currentValue = $('ams-calculator .result').val() != "0" ? $('ams-calculator .result').val() : '';
            resultValue = parseFloat(currentValue + $(this).data('val'));

            if (newOperation) {
                resultValue = parseFloat($(this).data('val'));
                newOperation = false;
            }
            $('ams-calculator .result').val(resultValue);
            if (typeof value1 === 'undefined' || (typeof lastOperator === 'undefined' && typeof currentOperator === 'undefined')) {
                value1 = resultValue;
            } else {
                value2 = resultValue;
            }

            console.log('resultValue', resultValue);
            console.log(value1);
            currentOperator = $('ams-calculator .operator.active').data('val');
            console.log(currentOperator);
            // $('ams-calculator .operator').removeClass('active');
        });


        $('ams-calculator .operator').on('click', function () {
            console.log(currentOperator);
            if (typeof value2 !== 'undefined' || currentOperator == '=' && typeof lastOperator !== 'undefined' && lastOperator != '=') {
                if (typeof currentOperator !== 'undefined') {
                    console.log('currentOperator', currentOperator);
                    console.log('lastOperator', lastOperator);
                    let operator = currentOperator;
                    if (currentOperator == 'C') {
                        if (typeof value2 === 'undefined') {
                            value1 = undefined;
                        } else {
                            value2 = undefined;
                        }
                    }
                    if (currentOperator == '=' && typeof lastOperator !== 'undefined' && lastOperator != '=') {
                        if (typeof value2 === 'undefined') {
                            value2 = oldvalue2;
                        }
                        operator = lastOperator;
                    }
                    value1 = calculate(value1, value2, operator);
                    $('ams-calculator .result').val(value1);
                } else {
                    $('ams-calculator .result').val('');
                }
                oldvalue2 = value2;
                value2 = undefined;
            }

            newOperation = true;


            currentOperator = $(this).data('val');
        });

        $('ams-calculator .operator').on('click', function () {
            $('ams-calculator .operator').removeClass('active');
            $(this).addClass('active');
        });

    }


    function calculate(value1, value2, operation = '=') {
        value1 = parseFloat(value1);
        value2 = parseFloat(value2);

        console.log('value1', value1);
        console.log('value2', value2);
        console.log('oldvalue2', oldvalue2);

        if (operation != '=') {
            lastOperator = operation;
        }


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
            case '=':
                if (typeof lastOperator !== 'undefined' && lastOperator != '=') {
                    return calculate(value1, value2, lastOperator);
                }
            case 'C':
                if (typeof value2 === 'undefined') {
                    return undefined;
                }
            default:
                break;
        }
    }


    $(document).on('keypress', function (e) {
        if (e.which == 13) {  // 13 is the ASCII code for Enter
            $("button[data-val='=']").click();  // Trigger click on matching button
        } else if (e.which == 8) {  // KeyCode for Backspace
            e.preventDefault();  // Prevent the default backspace behavior (like going back in browser history)
            var currentValue = $('ams-calculator input.result').val();
            var newValue = currentValue.slice(0, -1);  // Remove the last character
            $('ams-calculator input.result').val(newValue ? newValue : '0');  // Set to '0' if empty
        } else {
            var key = String.fromCharCode(e.which);  // Convert char code to string
            if (!isNaN(key) || ['*', '%', '/', '+', '-', '='].includes(key)) {
                if (key == '*') {
                    key = 'x';
                }
                $("button[data-val='" + key + "']").click();  // Trigger click on matching button
            }
        }
    });

    initCalculator();
})