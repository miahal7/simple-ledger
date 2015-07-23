var userId = 'jlucio';

Meteor.publish("transactions", function () {
    return Transactions.find({userId: userId}, {sort: {recurring: -1, createdAt: 1}});
});

Meteor.publish("vendors", function () {
  return Vendors.find({userId: userId});
});

Meteor.publish("categories", function () {
  return Categories.find({userId: userId});
});
