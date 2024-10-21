$(document).ready(function() {
    function showLoader() {
        $('#loader').show();
    }

    function hideLoader() {
        $('#loader').hide();
    }

    function loadPosts() {
        showLoader();
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'GET',
            success: function(posts) {
                posts.forEach(post => {
                    $('#posts-container').append(`
                        <div class="post" id="post-${post.id}">
                            <h2>${post.title}</h2>
                            <p>${post.body}</p>
                            <p><strong>Post ID:</strong> ${post.id}</p>
                            <p><strong>User ID:</strong> ${post.userId}</p>
                            <button class="load-comments" data-post-id="${post.id}">Carregar Comentários</button>
                            <div class="comments" id="comments-${post.id}" style="display:none;"></div>
                        </div>
                    `);
                });
                hideLoader();
            },
            error: function() {
                alert("Erro ao carregar os posts");
                hideLoader();
            }
        });
    }

    function loadComments(postId) {
        const commentsContainer = $(`#comments-${postId}`);
        showLoader();
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
            .then(response => response.json())
            .then(comments => {
                commentsContainer.empty();
                comments.forEach(comment => {
                    commentsContainer.append(`
                        <div class="comment">
                            <p><strong>${comment.name}</strong> (${comment.email})</p>
                            <p>${comment.body}</p>
                        </div>
                    `);
                });
                commentsContainer.show();
                hideLoader();
            })
            .catch(error => {
                alert("Erro ao carregar os comentários");
                hideLoader();
            });
    }

    function loadAllComments() {
        showLoader();
        fetch('https://jsonplaceholder.typicode.com/comments')
            .then(response => response.json())
            .then(comments => {
                comments.forEach(comment => {
                    const commentsContainer = $(`#comments-${comment.postId}`);
                    if (commentsContainer.length) {
                        commentsContainer.append(`
                            <div class="comment">
                                <p><strong>${comment.name}</strong> (${comment.email})</p>
                                <p>${comment.body}</p>
                            </div>
                        `);
                        commentsContainer.show();
                    }
                });
                hideLoader();
            })
            .catch(error => {
                alert("Erro ao carregar todos os comentários");
                hideLoader();
            });
    }

    loadPosts();

    $(document).on('click', '.load-comments', function() {
        const postId = $(this).data('post-id');
        loadComments(postId);
    });

    $('#load-all-comments').on('click', function() {
        loadAllComments();
    });
});
