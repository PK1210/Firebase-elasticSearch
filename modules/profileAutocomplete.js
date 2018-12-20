const request = require('request-promise');

exports.handler = (req,res) => {

    if(req.method !== 'POST'){
        return res.status(403).send('Forbidden')
    }
    if(!req.body.prefix){
        return res.status(400).send('prefix field should not be empty')
    }

    //Parameters based on server
    let elasticSearchConfig = {
        url:"http://35.238.50.217//elasticsearch/",
        username:"user",
        password:"pYTXEGFh11rr"
    }

    //Generating url based on properties
    let elasticSearchUrl = elasticSearchConfig.url + 'profiles/profile/' + '_search';

    //Generating url based on search prefix given
    let elasticsearchBody = {
	       "suggest":{
		             "user_name suggestion":{
			                      "prefix":req.body.prefix,
			                      "completion":{
				                               "field":"user_name",
				                               "fuzzy":{
				                                      "fuzziness":0
				                               }
		                          }
		              },
		              "user_handle suggestion":{
			                       "prefix":req.body.prefix,
			                       "completion":{
				                                "field":"user_handle",
			                                    "fuzzy":{
					                                   "fuzziness":0
				                                }
		                           }
		             }
	      }
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

    //Parse profiles for desired fields
    const parseProfile = (profile) => {
        parsedProfile = {
            text : profile.text,
            id : profile._id,
            userName : profile._source.user_name,
            userHandle : profile._source.user_handle,
            profilePicture : profile._source.profile_pic
        }
        return parsedProfile;
    }

    //Parse suggestion to extract useful piece
    const parseSuggestion = (response) => {
        let profiles = [];
        let set = new Set();
        let temp = response.suggest["user_name suggestion"][0].options;
        for (i in temp){
            set.add(temp[i]._id);
            profiles.push(parseProfile(temp[i]));
        }
        temp = response.suggest["user_handle suggestion"][0].options;
        for (i in temp){
            if(!set.has(temp[i]._id)){
                set.add(temp[i]._id);
                profiles.push(parseProfile(temp[i]));
            }
        }
        return profiles;
    }

    return request(elasticSearchRequest)
        .then(response =>{
            return res.status(200).send({
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
