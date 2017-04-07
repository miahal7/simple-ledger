import { Mongo } from 'meteor/mongo';

class CategoriesCollection extends Mongo.Collection {

}

export const Categories = new CategoriesCollection('categories');

// Deny all client-side updates since we will be using methods to manage this collection
Categories.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
