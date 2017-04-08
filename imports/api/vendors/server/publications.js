import { Meteor } from 'meteor/meteor';
import { Vendors } from '../vendors.js';

Meteor.publish("vendors", function () {
    return Vendors.find({ userId: this.userId });
});
