import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
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
  form: FormGroup;
  imagePreview: string;
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, { validators: [Validators.required]}),
      'image': new FormControl(null, { validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramaMap: ParamMap) => {
      if (paramaMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramaMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
            this.isLoading = false;
            this.post = {id: postData.post._id, title: postData.post.title, content: postData.post.content};
            this.form.setValue({'title': this.post.title, 'content': this.post.content });
        });
      } else {
        this.mode = 'create';
      }
    });
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  // onSavePost(form: NgForm): void {
  onSavePost(): void {

    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
  //  form.resetForm();
   this.form.reset();
  }
}
