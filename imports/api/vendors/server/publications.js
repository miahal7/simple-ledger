import { Meteor } from 'meteor/meteor';
import { Vendors } from '../vendors.js';

Meteor.publish("vendors", () => {
    return Vendors.find({ userId: this.userId });
});
