{
  // method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $('#new-post-form');

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: 'post',
        url: '/posts/create',
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $('#post-list-container>div').prepend(newPost);
          deletePost($(' .delete-post-button', newPost));

          // call the create comment class
          new PostComments(data.data.post._id);

          // enable the functionality of the toggle like button on the new post
          new ToggleLike($(' .toggle-like-button', newPost));

          new Noty({
            theme: 'relax',
            text: 'Post published!',
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
  };

  // method to create a post in DOM
  let newPostDom = function (post) {
    // show the count of zero likes on this post
    return $(`
      <div class="card m-4" id="post-${post._id}">
      <div class="card-header"  id="post-header" style="padding:0.5rem 1rem ; height:60px">
          <div class="d-flex flex-row justify-content-between">

              <div class="d-flex flex-row profile-info">
                  <h3 class="profile-pic-holder" style="width: 45px; height: 45px; margin: 0px 5px;">
                  ${
                    post.user.avatar
                      ? `<img src="${post.user.avatar}" alt="image" style = "width: 100%;height: 100%; border-radius: 50px;"alt="image">`
                      : `<img src="http:/images/DefaultUser.png" style = "width: 100%;height: 100%; border-radius: 50px;" alt="image">`
                  }                                           
                  </h3>
                  <h4 class="text-capitalize profile-name-holder">
                      ${post.user.name}
                  </h4>
              </div>
              
              <div class="dropdown dropleft">
                  <a class="dropdown-toggle" type="button" id="dropdownMenuButton-${
                    post._id
                  }"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i class="fas fa-ellipsis-v"></i>
                  </a>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton-${
                    post._id
                  }">     
                  <a class="delete-post-button dropdown-item" href="/posts/destroy/${
                    post._id
                  }">Delete</a>   
                  </div>
              </div>

          </div>
      </div>

      <div class="card-body">
              ${
                post.postImage
                  ? `
                <div class="posted-image">
                     <img src="${post.postImage}" alt="post">  
                </div>
              `
                  : `
              <p>
                <small>
                     ${post.content}
                </small>
                <br>
             </p>   
              `
              }
      </div>
     
      <div class="card-footer text-muted d-flex flex-row">
            <div class="mx-2">
              <a class = "toggle-like-button" data-likes = "${
                post.likes.length
              }" href="/likes/toggle/?id=${
      post._id
    }&type=Post" style="text-decoration: none;">${
      post.likes.length
    } <i class="far fa-thumbs-up"></i>
            </a>  
    </div>

          <div class="mx-2">
                  <button class="btn btn-link btn-block" type="button" data-toggle="collapse" 
              data-target="#post-${
                post._id
              }-collapse" aria-expanded="true" aria-controls="collapseOne" style="width:140px; text-decoration: none; padding-top: 2px;">
                  <h4 style="font-size: 1rem; margin-left: -20px;">
                    <i class="fas fa-comment"></i>
                     Comments
                  </h4>
                  </button>
              </div>    
          </div>

              <div id="post-${
                post._id
              }-collapse" class="collapse card-footer" aria-labelledby="headingOne">
                  <div class="card-body">

                      <div>
                        <form action="/comments/create" method="POST" id="post-${
                          post._id
                        }-comments-form">
                         <input type="text" name="content" placeholder="Type here to comment">
                          <input type="hidden" name="post" value="${post._id}">
                             <input type="submit" value="Add">
                          </form>
                      </div> 
                                           
                      <div class="post-comments-list">
                          <ul id="post-comments-${
                            post._id
                          }" style="list-style-type: none; padding: 0px;">                 
                          </ul>
                      </div>

                  </div>
              </div>
    </div>
      `);
  };

  // method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: 'get',
        url: $(deleteLink).prop('href'),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: 'relax',
            text: 'Post Deleted',
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
  };

  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function () {
    $('#post-list-container>div>div').each(function () {
      let self = $(this);
      let deleteButton = $(' .delete-post-button', self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop('id').split('-')[1];
      new PostComments(postId);
    });
  };

  createPost();
  convertPostsToAjax();
}
