import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { Transactions } from '../../api/transactions/transactions.js';
import { Categories } from '../../api/categories/categories.js';
import { Vendors } from '../../api/vendors/vendors.js';

import './app-body.html';

Template.App_body.onCreated(function () {
    this.subscribe('transactions');
    this.subscribe('vendors');
    this.subscribe('categories');
});

// ///////////////////////////////////////////////////////////////////////////
// ON RENDERED ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

Template.App_body.onRendered(function () {
    this.bankTotal = new ReactiveVar(0);
    this.userTotal = new ReactiveVar(0);
    const _this = Object.assign({}, this);

    Meteor.call('deleteFlaggedTransactions', false);
    if (Meteor.Device.isPhone() || Meteor.Device.isTablet()) {
        $("#page-header").headroom({ offset: 0, tolerance: 25 });
    }

    this.autorun(() => {
        Transactions.find({}).fetch();

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
    $(".datepicker").datepicker({
        autoclose: true,
        clearBtn: true,
        enableOnReadonly: true,
        orientation: "left auto",
        container: 'body',
    });
});

Template.App_body.helpers({
    bankTotal() {
        return accounting.formatMoney(Template.instance().bankTotal.get());
    },
    userTotal() {
        return accounting.formatMoney(Template.instance().userTotal.get());
    },
});

// ///////////////////////////////////////////////////////////////////////////
// HELPERS ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

Template.App_body.helpers({
    month() {
        let fmtdMonth = moment(month(), 'MM/YY').format("MMM 'YY"); // Phone is default

        if (Meteor.Device.isTablet()) {
            fmtdMonth = moment(month(), 'MM/YY').format('MMM YYYY');
        } else if (!Meteor.Device.isPhone()) {
            fmtdMonth = moment(month(), 'MM/YY').format('MMMM YYYY');
        }

        return fmtdMonth;
    },
    prevMonth() {
        let fmtdMonth = ""; // Phone is default

        if (Meteor.Device.isTablet()) {
            fmtdMonth = moment(month(), 'MM/YY').subtract(1, 'month').format('MMM');
        } else if (!Meteor.Device.isPhone()) {
            fmtdMonth = moment(month(), 'MM/YY').subtract(1, 'month').format('MMMM');
        }

        return fmtdMonth;
    },
    nextMonth() {
        let fmtdMonth = ""; // Phone is default

        if (Meteor.Device.isTablet()) {
            fmtdMonth = moment(month(), 'MM/YY').add(1, 'month').format('MMM');
        } else if (!Meteor.Device.isPhone()) {
            fmtdMonth = moment(month(), 'MM/YY').add(1, 'month').format('MMMM');
        }

        return fmtdMonth;
    },
    notPhone() {
        return !Meteor.Device.isPhone();
    },
});

Template.ledger.helpers({
    transactions() {
        const query = Session.get('query') || '';
        const regex = {
            $regex: new RegExp(query, 'ig'),
        };

        const t = Transactions.find({
            month: month(),
            $or: [
                {
                    vendor: regex,
                }, {
                    category: regex,
                }, {
                    $where: `/${query}/.test(this.amount)`,
                }, {
                    date: regex,
                },
            ],
        }, {
            sort: {
                createdAt: 1,
                recurring: -1,
            },
        }).fetch();

        console.log('Transactions', t);
        return t;
    },
    rowClass() {
        return (this.cleared) ? '' : 'yellow-text';
    },
});

Template.vendor.helpers({
    vendors() {
        return Vendors.find().fetch().map((vendor) => {
            return vendor.name;
        });
    },
});

Template.category.helpers({
    categories() {
        return Categories.find().fetch().map((category) => {
            return category.name;
        });
    },
});

Template.amount.helpers({
    formattedAmount() {
        return accounting.formatNumber(this.amount, 2);
    },
    credit() {
        return (this.deposit) ? '' : 'green-text';
    },
});

// ///////////////////////////////////////////////////////////////////////////
// EVENTS ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

Template.App_body.events({
    'click #addTransaction'() {
        Meteor.call('insertTransaction', month(), () => {
            setTimeout(() => {
                const target = $("tr:last").find('.vendor');

                $('html, body').animate({
                    scrollTop: target.offset().top,
                }, 1000);
                target.focus().select();
            }, 0);
        });
    },
    'click .previous'() {
        Session.set('month', moment(month(), 'MM/YY').subtract(1, 'month').format('MM/YY'));
    },
    'click .next'() {
        Session.set('month', moment(month(), 'MM/YY').add(1, 'month').format('MM/YY'));
    },
    'keyup #search'(event) {
        Session.set('query', $(event.currentTarget).val());
    },
});

Template.deleteRow.events({
    "click .delete"(event, template) {
        const transId = $(event.currentTarget).data('trans-id');
        const undo = template.find('.undo-overlay');
        const trWidth = $(event.currentTarget).closest('tr').width();

        $(event.currentTarget).attr("disabled", "disabled");

        $(undo).addClass('show-overlay').width(trWidth);
        $(undo).find("div").show('fast');

        Meteor.call('tempDeleteTransaction', transId);

        $(undo).find(".undo-timer").addClass("undo-timer-end");

        setTimeout(() => {
            Meteor.call('deleteFlaggedTransactions', transId, (err, res) => {
                if (res === 'true') {
                    console.warn(`Permanently deleted ${transId}`);
                } else {
                    console.warn("Not deleted, undo pressed");
                }
            });
        }, 6000);
    },
    "click .undo": function (event, template) {
        const transId = $(event.currentTarget).data('trans-id');
        const undo = template.find('.undo-overlay');
        const deleteBtn = template.find('.delete');
        $(deleteBtn).attr("disabled", false);

        $(undo).removeClass('show-overlay').width('0');
        $(undo).find(".undo-timer").removeClass("undo-timer-end");
        $(undo).find("div").hide();

        Meteor.call('updateTransaction', transId, {
            deleted: false,
            updatedAt: moment().format(),
        });
    },
});

Template.ledger.events({
    'click .vendor, click .category, click .amount'(event) {
        try {
            $(event.target).get(0).setSelectionRange(0, 9999);
        } catch (e) {
            $(event.target).select();
        }
    },
    'change input.trans-form, click button.trans-form'(event) {
        const formEl = $(event.currentTarget);
        const transId = formEl.data('trans-id');
        const field = formEl.data('field');
        const value = (event.type === 'click') ? !formEl.hasClass("active") : formEl.val();
        const transUpdate = {
            updatedAt: moment().format(),
        };

        transUpdate[field] = value;

        Meteor.call('updateTransaction', transId, transUpdate);
    },
    'change .vendor, typeahead:selected .vendor, typeahead:autocompleted .vendor'(event) {
        const vendor = $(event.target).typeahead('val').trim();
        const formEl = $(event.target);
        const transUpdate = {
            vendor: vendor,
            updatedAt: moment().format(),
        };
        const transId = formEl.data('trans-id');

        if (vendor !== "" && vendor.length >= 2) {
            Meteor.call('updateTransaction', transId, transUpdate);
            Meteor.call('upsertVendor', vendor);
        }
    },
    'change .category, typeahead:selected .category, typeahead:autocompleted .category'(event) {
        const category = $(event.target).typeahead('val').trim();
        const formEl = $(event.target);
        const transUpdate = {
            category: category,
            updatedAt: moment().format(),
        };
        const transId = formEl.data('trans-id');

        if (category !== "" && category.length >= 2) {
            Meteor.call('updateTransaction', transId, transUpdate);
            Meteor.call('upsertCategory', category);
        }
    },
});

window.onresize = () => {
    const width = $(window).width() - 50;

    $('.show-overlay').width(width);
};

const month = function () {
    return Session.get('month') || moment().format('MM/YY');
};
