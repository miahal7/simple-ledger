Meteor.publish("transactions", function () {
    return Transactions.find({userId: this.userId});
});

Meteor.publish("vendors", function () {
  return Vendors.find({userId: this.userId});
});

Meteor.publish("categories", function () {
  return Categories.find({userId: this.userId});
});
