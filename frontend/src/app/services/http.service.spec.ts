import { TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
describe('HttpService', () => {
  let service: HttpService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    })
  );

  beforeEach(() => {
    service = TestBed.get(HttpService); //variables should be assingned inside beforeEach, otherwise error will be thrown because test is synchronous                                           and api call is async.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a collection of posts', () => {
    const postsResponse = [
      {
        _id: '1',
        text: 'text',
        comments: [],
        community: 'general',
        updatedAt: '2019-03-04T11:43:07.402Z',
        userID: {
          createdAt: '2019-03-04T11:42:16.063Z',
          password: '$2a$13$T3G7hAdbhyNfkVqxXuZDce4NyQTL6lmKlMb1ObAaJKKn99CFsRSVS',
          updatedAt: '2019-03-04T11:42:16.063Z',
          username: 'user1',
          _id: '5c7d0f18d3b03138d3dff22a'
        },
        votes: '10'
      }
    ];
    let response;
    spyOn(service, 'getRequest').and.returnValue(of(postsResponse));

    service.getRequest(null, null).subscribe(res => {
      console.log(res);
      response = res;
    });

    expect(response).toEqual(postsResponse);
  });
});
