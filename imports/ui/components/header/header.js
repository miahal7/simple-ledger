import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

import { parseMonthURI } from '/imports/ui/lib/ledger-month.js';
import { Transactions } from '/imports/api/transactions/transactions.js';

import './header.html';

Template.header.onRendered(function () {
    this.bankTotal = new ReactiveVar(0);
    this.userTotal = new ReactiveVar(0);
    const _this = Object.assign({}, this);

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

Template.header.helpers({
    bankTotal() {
        return accounting.formatMoney(Template.instance().bankTotal.get());
    },
    userTotal() {
        return accounting.formatMoney(Template.instance().userTotal.get());
    },
    month() {
        const month = moment(FlowRouter.getParam("month"), 'MMM_YYYY');
        let format = "MMM 'YY";

        if (Meteor.Device.isTablet()) {
            format = 'MMM YYYY';
        } else if (!Meteor.Device.isPhone()) {
            format = 'MMMM YYYY';
        }

        return month.format(format);
    },
    prevMonth() {
        const month = moment(FlowRouter.getParam("month"), 'MMM_YYYY').subtract(1, 'month');
        let format = "";

        if (Meteor.Device.isTablet()) {
            format = 'MMM';
        } else if (!Meteor.Device.isPhone()) {
            format = 'MMMM';
        }

        return month.format(format);
    },
    nextMonth() {
        const month = moment(FlowRouter.getParam("month"), 'MMM_YYYY').add(1, 'month');
        let format = "";

        if (Meteor.Device.isTablet()) {
            format = 'MMM';
        } else if (!Meteor.Device.isPhone()) {
            format = 'MMMM';
        }

        return month.format(format);
    },
});

Template.header.events({
    'click #addTransaction'() {
        const month = parseMonthURI(FlowRouter.getParam('month'));

        Meteor.call('insertTransaction', month, () => {
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
        const initialMonth = FlowRouter.getParam("month");
        const newMonth = moment(initialMonth, 'MMM_YYYY').subtract(1, 'month').format('MMM_YYYY');
        FlowRouter.go(`/transactions/${newMonth}`);
    },
    'click .next'() {
        const initialMonth = FlowRouter.getParam("month");
        const newMonth = moment(initialMonth, 'MMM_YYYY').add(1, 'month').format('MMM_YYYY');
        FlowRouter.go(`/transactions/${newMonth}`);
    },
    'keyup #search'(event) {
        Session.set('query', $(event.currentTarget).val());
    },
});
