import { Meteor } from 'meteor/meteor';

import { Categories } from './categories.js';

Meteor.methods({
    upsertCategory(name) {
        Categories.upsert({
            name: name,
        }, {
            name: name,
            userId: Meteor.userId(),
        }, { multi: false });
    },
});
