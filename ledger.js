Transactions = new Mongo.Collection('transactions');

if (Meteor.isClient) {

  Template.ledger.helpers({
    trans: function () {
      var t = Transactions.find().fetch();

      console.log("t -> ", t);


      return t;
    }
  });

  Template.body.events({
    'click #addTransaction': function (ev) {
      Transactions.insert(
        {
          'vendor': 'test vendor',
          'category': '',
          'amount': '1.23',
          'trans_date': "10/03/2015",
          'cleared': false,
          'deposit': false,
          'recurring': false,
          'deleted': false,
          'memo': "check number 1231",
          'month': '10/15',
          'user_id': 'jlucio'
        }
      );
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
