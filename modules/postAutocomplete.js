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
    let elasticSearchUrl = elasticSearchConfig.url + 'posts/post/' + '_search';

    //Generating url based on search prefix given
    let elasticsearchBody = {
	       "suggest":{
		             "tags suggestion":{
			                      "prefix":req.body.prefix,
			                      "completion":{
				                               "field":"tags",
				                               "fuzzy":{
				                                      "fuzziness":0
				                               }
		                          }
		              },
		              "postCategory suggestion":{
			                       "prefix":req.body.prefix,
			                       "completion":{
				                                "field":"postCategory",
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

    //Parse suggestion to extract useful piece
    const parseSuggestion = (response) => {
        let set = new Set();
        let temp = response.suggest["tags suggestion"][0].options;
        for (i in temp){
            set.add(temp[i].text);
        }
        temp = response.suggest["postCategory suggestion"][0].options;
        for (i in temp){
            set.add(temp[i].text);
        }
        let tags = Array.from(set);
        return tags;
    }

    return request(elasticSearchRequest)
        .then(response =>{
            return res.status(200).send({
                tags:parseSuggestion(response)
            });
        })
        .catch(error => {
            console.log("Error in elasticsearch: ",error);
            return res.status(500).send({
               error:error
            });
        });
};
