import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import '/imports/utils/window-resize-handler.js';
import './delete-row-btn.html';

Template.deleteRowBtn.events({
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
