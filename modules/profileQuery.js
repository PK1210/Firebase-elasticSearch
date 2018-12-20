const request = require('request-promise');

exports.handler = (req,res) => {

    if(req.method !== 'POST'){
        return res.status(403).send('Forbidden')
    }
    if(!req.body.query){
        return res.status(400).send('query field should not be empty')
    }

    //Parameters based on server
    let elasticSearchConfig = {
        url:"http://35.238.50.217//elasticsearch/",
        username:"user",
        password:"pYTXEGFh11rr"
    }

    //Generating url based on properties
    let elasticSearchUrl = elasticSearchConfig.url + 'profiles/profile/' + '_search';

    //Generating url based on search query given
    let elasticsearchBody = {
        "query":{
            "multi_match":{
                "query":req.body.query,
                "fields":["primary_skill", "alternate_skills", "user_genres",
                        "instruments_played", "performer_types", "user_bio"]
            }
        },
        "sort":[{"followerCount":"desc"}]
    };

    //Creating url
    let elasticSearchRequest = {
        method: 'GET',
        url: elasticSearchUrl,
        auth:{
            username: elasticSearchConfig.username,
            password: elasticSearchConfig.password
        },
        body: elasticsearchBody,
        json: true
    };

    // Parse profile to return required fields
    const parseProfile = (profile) => {
        return parsed = {
            id: profile.user_id,
            name:profile.user_name,
            handle:profile.user_handle,
            profilePic:profile.profile_pic,
        }
    }

    //Parse suggestion to extract useful piece
    const parseSuggestion = (response) => {
        let profiles = [];
        let temp = response.hits.hits;
        for (i in temp){
            profiles.push(parseProfile(temp[i]._source))
        }
        return profiles;
    }

    return request(elasticSearchRequest)
        .then(response =>{
            return res.status(200).send({
                total:response.hits.total,
                profiles:parseSuggestion(response)
            });
        })
        .catch(error => {
            console.log("Error in elasticsearch: ",error);
            return res.status(500).send({
               error:error
            });
        });
};
