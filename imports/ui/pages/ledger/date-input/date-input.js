import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import './date-input.html';

Template.dateInput.onRendered(function () {
    $(".datepicker").datepicker({
        autoclose: true,
        clearBtn: true,
        enableOnReadonly: true,
        orientation: "left auto",
        container: 'body',
    });
});
