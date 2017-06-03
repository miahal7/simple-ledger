Meteor.methods({
  'bankTotal': function () {
    return aggregateTotal({ cleared: true });
  },
  'userTotal': function () {
    return aggregateTotal({});
  },
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
        userId: Meteor.userId(),
        createdAt: moment().format(),
        updatedAt: moment().format()
      }
    );
  },
  'updateTransaction': function (_id, changed) {
    if(_.contains(_.keys(changed), "amount")) {
        changed.amount = parseFloat(parseFloat(changed.amount).toFixed(2));
    }

    Transactions.update(_id, {$set: changed});
  },
  'tempDeleteTransaction': function (_id) {
    Transactions.update(_id, {$set: {deleted: true, updatedAt: moment().format()}});
  },
  'deleteFlaggedTransactions': function (_id) {
    var deleted = false;
    if(_id){
      Transactions.remove({_id: _id, deleted: true, userId: Meteor.userId()});
      deleted = true;
      console.log("Flagged Transaction deleted");
    } else {
      Transactions.remove({userId: Meteor.userId(), deleted: true});
      deleted = true;
      console.log("Flagged Transaction(s) deleted");
    }

    return deleted;
  },
  'upsertVendor': function (name) {
    Vendors.upsert({name: name, userId: Meteor.userId()},
      {
        name: name,
        userId: Meteor.userId()
      },
      {multi: false}
    );
  },
  'upsertCategory': function (name) {
    Categories.upsert({name: name},
      {
        name: name,
        userId: Meteor.userId()
      },
      {multi: false}
    );
  },
  'copyRecurring': function (userId, month) {
    if (!month) {
      month = moment().subtract(1, 'month').format('MM/YY');
    }

    var recurring = Transactions.find({ userId: userId, month: month, recurring: true, deleted: false }).fetch();

    _.each(recurring, function (r) {
      delete r._id;
      r.month = moment().format('MM/YY');
      r.date = moment(r.date, "MM/DD/YYYY").add(1, 'month').format('MM/DD/YYYY');
      r.cleared = false;
      r.createdAt = moment().format(),
      r.updatedAt = moment().format()

      Transactions.insert(r);
    });
  }
});

Meteor.startup(function () {
  // code to run on server at startup
});

var pipeline = function (query) {
    var mergedQuery = _.extend({ userId: Meteor.userId(), deleted: false }, query);
    return [
      {
        $match: mergedQuery
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ];
};

var parseResults = function (result) {
    var total = 0;

    if(!_.isEmpty(result)) {
        if(!!result[0].total) {
            total = result[0].total;
        }
    }

    return total;
};

var aggregateTotal = function (query) {
    // query = {cleared: true} for bankTotal and {} for userTotal
    var creditPipeline = pipeline(_.extend({ deposit: true }, query));
    var debitPipeline = pipeline(_.extend({ deposit: false }, query));
    var credits = Transactions.aggregate(creditPipeline);
    var debits = Transactions.aggregate(debitPipeline);
    var total = 0;

    credits = parseResults(credits);
    debits = parseResults(debits);
    total = credits - debits;

    return total;
};
