Template.body.onRendered(function () {
  console.log("Body Rendered");
  Meteor.call('deleteFlaggedTransactions', false)

});

Template.vendor.onRendered(function () {
  Meteor.typeahead.inject($(this.find('.typeahead')));
});

Template.category.onRendered(function () {
  Meteor.typeahead.inject($(this.find('.typeahead')));
});

Template.date.onRendered(function () {
  $(".datepicker").datepicker();
});