import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import { Vendors } from '/imports/api/vendors/vendors.js';
import './vendor-input.html';

Template.vendorInput.onRendered(function () {
    Meteor.typeahead.inject($(this.find('.typeahead')));
});

Template.vendorInput.helpers({
    vendors() {
        return Vendors.find().fetch().map((vendor) => {
            return vendor.name;
        });
    },
});
