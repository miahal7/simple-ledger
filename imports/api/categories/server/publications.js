import { Meteor } from 'meteor/meteor';
import { Categories } from '../categories.js';

Meteor.publish("categories", () => {
    return Categories.find({ userId: this.userId });
});
