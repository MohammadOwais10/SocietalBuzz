// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments {
  // constructor is used to initialize the instance of the class whenever a new instance is created
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);

    this.createComment(postId);

    let self = this;
    // call for all the existing comments
    $(' .delete-comment-button', this.postContainer).each(function () {
      self.deleteComment($(this));
    });
  }

  createComment(postId) {
    let pSelf = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      let self = this;

      $.ajax({
        type: 'post',
        url: '/comments/create',
        data: $(self).serialize(),
        success: function (data) {
          let newComment = pSelf.newCommentDom(data.data.comment);
          $(`#post-comments-${postId}`).prepend(newComment);
          pSelf.deleteComment($(' .delete-comment-button', newComment));

          // enable the functionality of the toggle like button on the new comment
          new ToggleLike($(' .toggle-like-button', newComment));
          new Noty({
            theme: 'relax',
            text: 'Comment published!',
            type: 'success',
            layout: 'topRight',
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }

  newCommentDom(comment) {
    // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
    // show the count of zero likes on this comment

    return $(`
        <li id="comment-${comment._id}">
        <div class="media m-2 border-bottom">

            <h3 class="profile-pic-holder" style="width: 35px; height: 35px; margin: 0px 5px;">
                ${
                  comment.user.avatar
                    ? `<img src="${comment.user.avatar}" alt="image"  style = "width: 100%;height: 100%; border-radius: 50px;">`
                    : `<img src="http://localhost:8000/images/DefaultUser.png" style = "width: 100%;height: 100%; border-radius: 50px;" alt="image">`
                }              
            </h3>
    
            <div class="media-body">
                <div class="d-flex flex-row justify-content-between" style="height: 22px; width: 150px;">
                    <div class="comment-user-name">
                        <h5 class="mt-0" style = " font-size: medium;text-transform: capitalize;">${
                          comment.user.name
                        }</h5>
                    </div>
                    <div>                       
                            <p>
                                <a class="delete-comment-button" href="/comments/destroy/${
                                  comment._id
                                }">
                                 <i class="fa-solid fa-delete-left"></i>
                                </a>
                            </p>    
                        
                    </div>
                </div>
    
               <div class="comment-content" style="font-size: small; width: 260px;">
                ${comment.content}
               </div>
                <small>
         
                  <a class = "toggle-like-button" data-likes =  "${
                    comment.likes.length
                  }" 
                  href="/likes/toggle/?id=${comment._id}
                  &type=Comment" style="text-decoration: none;">
                   ${comment.likes.length} 
                   <i class="far fa-thumbs-up"></i>
                  </a>   
                   
                </small>
            </div>
        </div>  
    </li>
        `);
  }

  deleteComment(deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: 'get',
        url: $(deleteLink).prop('href'),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();

          new Noty({
            theme: 'relax',
            text: 'Comment Deleted',
            type: 'success',
            layout: 'topRight',
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }
}
