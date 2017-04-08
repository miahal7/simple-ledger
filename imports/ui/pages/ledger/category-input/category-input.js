import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import { Categories } from '/imports/api/categories/categories.js';
import './category-input.html';

Template.categoryInput.onRendered(function () {
    Meteor.typeahead.inject($(this.find('.typeahead')));
});

Template.categoryInput.helpers({
    categories() {
        return Categories.find().fetch().map((category) => {
            return category.name;
        });
    },
});
