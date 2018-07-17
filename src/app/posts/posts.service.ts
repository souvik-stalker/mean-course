import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}
  getPosts() {
    this.http.get<{message: string, posts: any}>(
      'http://localhost:3000/api/posts'
    )
    .pipe(map((postData) => {
      return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{post: any}>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string) {
      const post: Post = {id: null, title: title, content: content};
      this.http.post<{ message: string, post: any }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        post.id = responseData.post._id;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string , title: string, content: string) {
    const post: Post = {id: id , title: title , content: content };
    this.http.put('http://localhost:3000/api/posts/' + id , post)
    .subscribe((response) =>  {
      const updatedPost = [...this.posts];
      const oldPostIndex = updatedPost.findIndex(p => p.id === post.id);
      updatedPost[oldPostIndex] = post;
      this.posts = updatedPost;
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postID: string) {
    this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postID)
      .subscribe((responseData) => {
        console.dir(responseData);
        const updatePosts = this.posts.filter(post => {
            return post.id !== postID;
        });
        this.posts = updatePosts;
        this.postUpdated.next([...this.posts]);
      });
  }
}
