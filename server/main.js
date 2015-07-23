var userId = 'jlucio';

Meteor.methods({
  'insertTransaction': function (month) {
    Transactions.insert(
      {
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
        userId: userId,
        createdAt: moment().format(),
        updatedAt: moment().format()
      }
    );
  },
  'updateTransaction': function (_id, changed) {
    console.log("Updating transaction " + _id + " with -> ", changed);
    Transactions.update(_id, {$set: changed});
  },
  'tempDeleteTransaction': function (_id) {
    Transactions.update(_id, {$set: {deleted: true, updatedAt: moment().format()}});
  },
  'deleteFlaggedTransactions': function (_id) {
    var deleted = false;
    if(_id){
      Transactions.remove({_id: _id, deleted: true, userId: userId});
      deleted = true;
      console.log("Flagged Transaction deleted");
    } else {
      Transactions.remove({userId: userId, deleted: true});
      deleted = true;
      console.log("Flagged Transaction(s) deleted");
    }

    return deleted;
  },
  'upsertVendor': function (name) {
    Vendors.upsert({name: name, userId: userId},
      {
        name: name,
        userId: userId
      },
      {multi: false}
    );
  },
  'upsertCategory': function (name) {
    Categories.upsert({name: name},
      {
        name: name,
        userId: userId
      },
      {multi: false}
    );
  }
});

Meteor.startup(function () {
  // code to run on server at startup
});