import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore.js';
// TODO implement ValidatedMethod and SimpleSchema
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Transactions } from './transactions.js';
import { aggregateTotal } from './aggregate-total.js';

Meteor.methods({
  bankTotal() {
    return aggregateTotal({ cleared: true });
  },
  userTotal() {
    return aggregateTotal({});
  },
  insertTransaction(month) {
    Transactions.insert({
      vendor: '',
      category: '',
      amount: '',
      date: moment().format('MM/DD/YYYY'),
      cleared: false,
      deposit: false,
      recurring: false,
      deleted: false,
      memo: '',
      month: month,
      userId: Meteor.userId(),
      createdAt: moment().format(),
      updatedAt: moment().format(),
    });
  },
  updateTransaction(_id, changed) {
    const _changed = Object.assign({}, changed);

    if (_.contains(_.keys(_changed), "amount")) {
      _changed.amount = parseFloat(parseFloat(_changed.amount).toFixed(2));
    }

    Transactions.update(_id, { $set: _changed });
  },
  tempDeleteTransaction(_id) {
    Transactions.update(_id, {
      $set: {
        deleted: true,
        updatedAt: moment().format(),
      },
    });
  },
  deleteFlaggedTransactions(_id) {
    let deleted = false;

    if (_id) {
      Transactions.remove({ _id: _id, deleted: true, userId: Meteor.userId() });
      deleted = true;
    } else {
      Transactions.remove({ userId: Meteor.userId(), deleted: true });
      deleted = true;
    }

    return deleted;
  },
  'copyRecurring'(userId, _month) {
    let month = _month;

    if (!month) {
      month = moment().subtract(1, 'month').format('MM/YY');
    }

    const recurring = Transactions.find({ userId: userId, month: month, recurring: true, deleted: false }).fetch();

    _.each(recurring, function (_r) {
      const r = Object.assign({}, _r);
      delete r._id;
      r.month = moment(month, 'MM/YY').add(1, 'month').format('MM/YY');
      r.date = moment(r.date, "MM/DD/YYYY").add(1, 'month').format('MM/DD/YYYY');
      r.cleared = false;
      r.createdAt = moment().format();
      r.updatedAt = moment().format();

      Transactions.insert(r);
    });
  },
});
