const request = require('request-promise')

exports.handler = (req,res) => {

    if(req.method !== 'POST'){
        return res.status(403).send('Forbidden')
    }
    if(!req.body.query){
        return res.status(400).send('query field should not be empty')
    }

    let sortKey = [{"isPinned":"desc"},{"timestamp":"asc"}];
    //Check if sortKey is passed
    if(req.body.sortKey){
        sortKey.push(...req.body.sortKey);
    }

    //Parameters based on server
    let elasticSearchConfig = {
        url:"http://35.238.50.217//elasticsearch/",
        username:"user",
        password:"pYTXEGFh11rr"
    }

    //Generating url based on properties
    let elasticSearchUrl = elasticSearchConfig.url + 'posts/post/' + '_search';

    //Generating url based on search query given
    let elasticsearchBody = {
        "query":{
            "multi_match":{
                "query":req.body.query,
                "fields":["postCategory","tags","postText","postCaption"]
            }
        },
        "sort":sortKey
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

    // Parse post to return required fields
    const parsePost = (post) => {
        return parsed = {
            id: post.id,
            text:post.postText,
            caption:post.postCaption,
            category:post.postCategory,
            tags:post.tags,
            timestamp:post.timestamp,
            userInfo:post.userInfo,
            imageURI:post.resInfo.imageURI,
            videoURI:post.resInfo.videoURI,
            likeCount:post.likeCount,
            commentCount:post.commentCount,
            isPinned:post.isPinned
        }
    }

    //Parse suggestion to extract useful piece
    const parseSuggestion = (response) => {
        let posts = [];
        let temp = response.hits.hits;
        for (i in temp){
            posts.push(parsePost(temp[i]._source))
        }
        return posts;
    }

    return request(elasticSearchRequest)
        .then(response =>{
            return res.status(200).send({
                total:response.hits.total,
                posts:parseSuggestion(response)
            });
        })
        .catch(error => {
            console.log("Error in elasticsearch: ",error);
            return res.status(500).send({
               error:error
            });
        });
};
