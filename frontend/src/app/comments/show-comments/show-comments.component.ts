import { Component, OnInit, Input } from '@angular/core';
import { CommentsModule } from '../comments.module';

@Component({
  selector: 'app-show-comments',
  templateUrl: './show-comments.component.html',
  styleUrls: ['./show-comments.component.css']
})
export class ShowCommentsComponent implements OnInit {
  @Input() comments = [
    {
      title: 'title 1',
      children: [{ title: 'reply 1', children: [{ title: 'reply 1' }, { title: 'reply 2' }] }, { title: 'reply 2' }, { title: 'reply 3' }]
    },
    { title: 'title 2', children: [{ title: 'reply 1' }, { title: 'reply 2' }, { title: 'reply 3' }] }
  ];
  constructor() {}

  ngOnInit() {}
}
