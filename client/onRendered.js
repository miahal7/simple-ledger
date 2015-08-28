Template.body.onRendered(function () {
  console.log("Body Rendered");
  Meteor.call('deleteFlaggedTransactions', false);
  if(Meteor.Device.isPhone() || Meteor.Device.isTablet()){
    $("#page-header").headroom({
      "offset": 0,
      "tolerance": 25
    });
  }
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
