import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import Headroom from 'headroom.js';
// import { _ } from 'meteor/underscore';

import '/imports/ui/components/header/header.js';
import './app-body.html';

Template.App_body.onCreated(function () {

});

Template.App_body.onRendered(function () {
    Meteor.call('deleteFlaggedTransactions', false);

    const headroom = new Headroom(document.getElementById("page-header"), {
        offset: 205,
        tolerance: 5,
    });

    headroom.init();
});
