import { Meteor } from 'meteor/meteor';
import { Transactions } from '../transactions.js';

Meteor.publish("transactions", function (month) {
    const trans = Transactions.find({ userId: this.userId, month });
    console.log('TRANSACTIONS', trans.count());

    return trans;
});
