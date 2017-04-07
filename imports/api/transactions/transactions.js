import { Mongo } from 'meteor/mongo';
// TODO Implement SimpleSchema
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class TransactionsCollection extends Mongo.Collection {
    // Override built in methods here
    // insert(list, callback, language = 'en') {
    //     return super.insert(ourList, callback);
    // }
}

export const Transactions = new TransactionsCollection('transactions', {
    // Transform return here
    // transform: (doc) => {},
});

// Deny all client-side updates since we will be using methods to manage this collection
Transactions.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
