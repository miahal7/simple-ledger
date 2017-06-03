Template.body.events({
  'click #addTransaction': function (event) {
    Meteor.call('insertTransaction', month(), function () {
      setTimeout(function () {
        var target = $("tr:last").find('.vendor');

        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
          target.focus().select();
      }, 0);
    });
  },
  'click .previous': function (event) {
    Session.set('month', moment(month(), 'MM/YY').subtract(1, 'month').format('MM/YY'));
  },
  'click .next': function (event) {
    Session.set('month', moment(month(), 'MM/YY').add(1, 'month').format('MM/YY'));
  },
  'keyup #search': function (event) {
    Session.set('query', $(event.currentTarget).val());
  }
});

Template.deleteRow.events({
  "click .delete": function (event, template) {
    var transId = $(event.currentTarget).data('trans-id');
    var undo = template.find('.undo-overlay');
    var trWidth = $(event.currentTarget).closest('tr').width();

    $(event.currentTarget).attr("disabled","disabled");

    $(undo).addClass('show-overlay').width(trWidth);
    $(undo).find("div").show('fast');

    Meteor.call('tempDeleteTransaction', transId);
    var timerWidth = 0;
    $(undo).find(".undo-timer").addClass("undo-timer-end");

    setTimeout(function () {
      Meteor.call('deleteFlaggedTransactions', transId, function(err, res){
        if(res === 'true') {
            console.log("Permanently deleted " + transId);
        } else {
          console.log("Not deleted, undo pressed");
        }
      });
    },6000);
  },
  "click .undo": function (event, template) {
    var transId = $(event.currentTarget).data('trans-id');
    var undo = template.find('.undo-overlay');
    var deleteBtn = template.find('.delete');
    $(deleteBtn).attr("disabled",false);

    $(undo).removeClass('show-overlay').width('0');
    $(undo).find(".undo-timer").removeClass("undo-timer-end");
    $(undo).find("div").hide();

    Meteor.call('updateTransaction', transId, {deleted: false, updatedAt: moment().format()});
  }
});

Template.ledger.events({
  'click .vendor, click .category, click .amount': function (event) {
    try {
      $(event.target).get(0).setSelectionRange(0,9999);
    }
    catch(e) {
      $(event.target).select();
    }
  },
  'change input.trans-form, click button.trans-form': function (event) {
    var formEl = $(event.currentTarget);
    var transId = formEl.data('trans-id');
    var field = formEl.data('field');
    var value = (event.type === 'click')? !formEl.hasClass("active") : formEl.val();
    var transUpdate = {updatedAt: moment().format()};

    transUpdate[field] = value;

    Meteor.call('updateTransaction', transId, transUpdate);
  },
  'change .vendor, typeahead:selected .vendor, typeahead:autocompleted .vendor': function (event){
    var tr = $(event.currentTarget).closest('tr');
    var categoryField = tr.find('.category');
    var vendor = $(event.target).typeahead('val').trim();
    var formEl = $(event.target);
    var transUpdate = {vendor: vendor, updatedAt: moment().format()};
    var transId = formEl.data('trans-id');

    if(vendor !== "" && vendor.length >= 2){
      console.log("Updating user's vendor collection", vendor);
      Meteor.call('updateTransaction', transId, transUpdate);
      Meteor.call('upsertVendor', vendor);
    }
  },
  'change .category, typeahead:selected .category, typeahead:autocompleted .category': function (event) {
    var tr = $(event.currentTarget).closest('tr');
    var vendorField = tr.find('.vendor');
    var category = $(event.target).typeahead('val').trim();
    var formEl = $(event.target);
    var transUpdate = {category: category, updatedAt: moment().format()};
    var transId = formEl.data('trans-id');

    if(category !== "" && category.length >= 2){
      console.log("Updating user's category collection", category);
      Meteor.call('updateTransaction', transId, transUpdate);
      Meteor.call('upsertCategory', category);
    }
  },
  'click .copy-recurring': function (event) {
    if (confirm('Copy recurring from previous month?')) {
      Meteor.call('copyRecurring', Meteor.userId());
    }
  }
});

window.onresize = function(event) {
  var width = $(window).width() - 50;

  $('.show-overlay').width(width);
};
