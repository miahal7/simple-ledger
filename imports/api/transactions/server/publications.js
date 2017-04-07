import { Meteor } from 'meteor/meteor';
import { Transactions } from '../transactions.js';

Meteor.publish("transactions", () => {
    return Transactions.find({ userId: this.userId });
});
