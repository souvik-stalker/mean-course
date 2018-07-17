import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle: string;
  enteredContent: string;
  public post: Post;
  private mode = 'create';
  private postId: string;
  isLoading = false;
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramaMap: ParamMap) => {
      if (paramaMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramaMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
            this.isLoading = false;
            this.post = {id: postData.post._id, title: postData.post.title, content: postData.post.content};
        });
      } else {
        this.mode = 'create';
      }
    });
  }
  onSavePost(form: NgForm): void {

    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }
    form.resetForm();
  }
}
