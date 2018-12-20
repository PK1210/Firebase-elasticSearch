const functions = require('firebase-functions');
const admin = require('firebase-admin');

const postQueryModule = require('./modules/postQuery');
const profileQueryModule = require('./modules/profileQuery');
const profileAutocompleteModule = require('./modules/profileAutocomplete');
const postAutocompleteModule = require('./modules/postAutocomplete');

admin.initializeApp(functions.config().firebase);


//Function to handle postQuery
exports.postQuery = functions.https.onRequest(postQueryModule.handler);

//Function to handle profileQuery
exports.profileQuery = functions.https.onRequest(profileQueryModule.handler);

//Function to handle profile autocomplete based on user_name and user_handle
exports.profileAutocomplete = functions.https.onRequest(profileAutocompleteModule.handler);

//Function to handle profile autocomplete based on user_name and user_handle
exports.postAutocomplete = functions.https.onRequest(postAutocompleteModule.handler);
