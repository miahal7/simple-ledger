import { Meteor } from 'meteor/meteor';
import { Transactions } from '../transactions.js';

Meteor.publish("transactions", function () {
    const trans = Transactions.find({ userId: this.userId });
    console.log('TRANS', trans.count());

    return trans;
});
