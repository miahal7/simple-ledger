import { Meteor } from 'meteor/meteor';

import { Vendors } from './vendors.js';

Meteor.methods({
    upsertVendor(name) {
        Vendors.upsert({
            name: name,
            userId: Meteor.userId(),
        }, {
            name: name,
            userId: Meteor.userId(),
        }, { multi: false });
    },
});
