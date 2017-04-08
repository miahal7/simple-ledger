import { Mongo } from 'meteor/mongo';

class VendorsCollection extends Mongo.Collection {

}

export const Vendors = new VendorsCollection('vendors');

// Deny all client-side updates since we will be using methods to manage this collection
Vendors.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
