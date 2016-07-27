/*global window, document, $, google, mapCenter, FastClick */

var steps = document.querySelectorAll('.frame .step'),
    delay = 600,
    progress = 4500;

[].forEach.call(steps, function(step, i) {

    function next(event) {
        if (i < steps.length - 1) {
            steps[i].classList.remove('done');
            setTimeout(function() {
                steps[i].classList.remove('visible');
                steps[i + 1].classList.add('visible');
                setTimeout(function() {
                    steps[i + 1].classList.add('done');
                }, 20);
            }, delay);
            if (i == 1) {
                setTimeout(forward, progress);
            }
        }
        event.preventDefault();
    }

    function forward() {
        i = i + 1;
        next();
    }

    var buttons = step.querySelectorAll('.button-yes,.button-no');

    for (var j = 0; j < buttons.length; ++j) {
        var button = buttons[j];
        button.addEventListener('click', next);
    }
});
