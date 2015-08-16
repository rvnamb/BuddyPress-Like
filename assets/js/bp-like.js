/* jshint undef: false, unused:false */
// AJAX Functions
var jq = jQuery;

var bp_like_ajax_request = null;                                // TODO implement this. Global variable to prevent multiple AJAX requests


jq(document).ready(function() {
    "use strict";
    jq('.like, .unlike').live('click', function() {
        
        var id = jq(this).attr('id');                           // Used to get the id of the entity liked or unliked

        var type = jq(this).attr('class')                       // 
            .replace('bp-primary-action ','')                   // end space needed to avoid double space in var type
            .replace('button', 'activity_update')               // clearer variable naming
            .trim();
        
        jq(this).addClass('loading');

        jq.post(ajaxurl, {
            action: 'activity_like',                            // TODO this could be named clearer
            'cookie': encodeURIComponent(document.cookie),      // TODO could remove this? What size are these cookies?
            'type': type,
            'id': id
        },
            function(data) {
                console.log('type: ' + type);
                console.log('data: ' + data);
                jq('#' + id).fadeOut(100, function() {
                    jq(this).html(data).removeClass('loading').fadeIn(100);
                });

                // may only need one if and else if
                // if (like) {} else if (unlike) {} else {oops()}
                // leave for now as may need something for messages
                if (type == 'activity_update like') {

                    jq('#' + id).removeClass('like')
                        .addClass('unlike')
                        .attr('title', bplikeTerms.unlike_message)
                        .attr('id', id.replace("like", "unlike") );
                
                } else if (type == 'activity_update unlike') {

                    jq('#' + id).removeClass('unlike')
                        .addClass('like')
                        .attr('title', bplikeTerms.like_message)
                        .attr('id', id.replace("unlike", "like"));

                }
                 else if (type == 'activity_comment like') {

                    jq('#' + id).removeClass('like')
                        .addClass('unlike')
                        .attr('title', bplikeTerms.unlike_message)      // may want different (smaller) message for comments
                        .attr('id', id.replace("like", "unlike") );

                }else if (type == 'activity_comment unlike') {

                    jq('#' + id).removeClass('unlike')
                        .addClass('like')
                        .attr('title', bplikeTerms.like_message)
                        .attr('id', id.replace("unlike", "like") );
                
                } else {
                    console.log('Something went wrong');
                    console.log('type: ' + type );
                    console.log('id: ' + id );
                }

                var pureID;
                // Nobody else liked this, so remove the 'View Likes'
                if (data == 'Like ') {
                    console.log('But you were the only one to like this!');
                    pureID = id.replace("unlike-activity-", "");
                    jq('#users-who-like-' + pureID ).remove();
                }

                // Show the 'View Likes' if user is first to like
                if (data == 'Unlike <span>1</span>') {
                    console.log('You\'re the first person to like this!');
                    pureID = id.replace("like-activity-", "");
                    jq('li#activity-' + pureID + ' .activity-meta').append('<p class="users-who-like" id="users-who-like-' + pureID + '">You like this.</p>');
                }

            });

        return false;
    });
        // if the option is set to remove favorites, remove all favorite classes
        // TODO check if this code is still needed
        if ( 1 == bplikeTerms.fav_remove ) {
            jq(".fav").remove();
            jq(".unfav").remove();
    }
});