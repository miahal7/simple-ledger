Meteor.methods({
  'insertTransaction': function () {
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
        month: moment().format('MM/YY'),
        userId: userId,
        createdAt: moment().format(),
        updatedAt: moment().format()
      }
    );
  },
  'updateTransaction': function (_id, changed) {
    Transactions.update(_id, {$set: changed});
  },
  'tempDeleteTransaction': function (_id) {
    Transactions.update(_id, {$set: {deleted: true, updatedAt: moment().format()}});
  },
  'upsertVendor': function (name) {
    Vendors.upsert({name: name, userId: userId},
      {
        name: vendor,
        userId: userId
      },
      {multi: false}
    );
  },
  'upsertCategory': function (name) {
    Categories.upsert({name: name},
      {
        name: vendor,
        userId: userId
      },
      {multi: false}
    );
  }
});

Meteor.startup(function () {
  // code to run on server at startup
});