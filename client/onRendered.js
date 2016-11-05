Template.body.onRendered(function () {
  this.bankTotal = new ReactiveVar(0);
  this.userTotal = new ReactiveVar(0);
  var _this = this;

  Meteor.call('deleteFlaggedTransactions', false);
  if(Meteor.Device.isPhone() || Meteor.Device.isTablet()){
    $("#page-header").headroom({
      "offset": 0,
      "tolerance": 25
    });
  }

  this.autorun(function () {
    //   Transactions.find({});
      Session.get('changed');
      
      Meteor.call('bankTotal', function (error, result) {
            _this.bankTotal.set(result);
      });
      Meteor.call('userTotal', function (error, result) {
            _this.userTotal.set(result);
      });
  });
});

Template.vendor.onRendered(function () {
  Meteor.typeahead.inject($(this.find('.typeahead')));
});

Template.category.onRendered(function () {
  Meteor.typeahead.inject($(this.find('.typeahead')));
});

Template.date.onRendered(function () {
  $(".datepicker").datepicker(
    {
    autoclose: true,
    clearBtn: true,
    enableOnReadonly: true,
    orientation: "left auto",
    container: 'body'
  });

});

Template.body.helpers({
  bankTotal: function () {
    return accounting.formatMoney(Template.instance().bankTotal.get());
  },
  userTotal: function () {
    return accounting.formatMoney(Template.instance().userTotal.get());
  }
});
