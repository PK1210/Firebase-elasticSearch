const functions = require('firebase-functions');
const request = require('request-promise')

exports.indexPostsForSearching = functions.firestore.document('/posts/{postId}')
    .onWrite((change, context) => {

        let postData = change.after.data();
        let postId = context.params.postId;

        console.log("DEBUG:",postId,":",postData);

        //Parameters based on server
        let elasticSearchConfig = {
            url:"http://35.238.50.217//elasticsearch/",
            username:"user",
            password:"pYTXEGFh11rr"
        }

        let elasticSearchUrl = elasticSearchConfig.url+ 'posts/post/'+ postId;
        let elasticSearchMethod = postData ? 'POST' : 'DELETE';

        let elasticSearchRequest = {
            method: elasticSearchMethod,
            url: elasticSearchUrl,
            auth:{
                username: elasticSearchConfig.username,
                password: elasticSearchConfig.password
            },
            body: postData,
            json: true
        };

        return request(elasticSearchRequest)
            .then(response =>{
                console.log("Elastic Search Response:",response);
                return null;
            })
            .catch(error => {
                console.log("Error in elasticsearch: ",error);
            });
    });

exports.indexProfilesForSearching = functions.firestore.document('/profiles/{profileId}')
    .onWrite((change, context) => {
        let profileData = change.after.data();
        let profileId = context.params.profileId;

        console.log("DEBUG:",profileId,":",profileData);

        //let elasticSearchConfig = functions.config().elasticsearch;
        let elasticSearchConfig = {
            url:"http://35.238.50.217//elasticsearch/",
            username:"user",
            password:"pYTXEGFh11rr"
        }
        
        let elasticSearchUrl = elasticSearchConfig.url+ 'profiles/profile/'+ profileId;
        let elasticSearchMethod = profileData ? 'POST' : 'DELETE';

        let elasticSearchRequest = {
            method: elasticSearchMethod,
            url: elasticSearchUrl,
            auth:{
                username: elasticSearchConfig.username,
                password: elasticSearchConfig.password
            },
            body: profileData,
            json: true
        };

        return request(elasticSearchRequest)
            .then(response =>{
                console.log("Elastic Search Response:",response);
                return null;
            })
            .catch(error => {
                console.log("Error in elasticsearch: ",error);
            });
    });
