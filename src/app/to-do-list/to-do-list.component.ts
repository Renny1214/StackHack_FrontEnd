import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {

  priority;

  showLoading = false;

  data = {
    category: null,
    task: null,
    priority: null,
    completed: false,
    date: {
      current: null,
      due: null
    }
  };

  constructor(private httpCLient: HttpClient) { }

  ngOnInit() {}

  enterCategory(event) {
    this.data.category = event.target.value;
  }
  enterEvent(event) {
    this.data.task = event.target.value;
  }
  enterDate(event) {
    this.data.date.due = Date.parse(event.target.value);
    this.data.date.current = Date.now();

    console.log(this.data);
  }
  enterPriority(event) {
    this.priority = event.target.value;
  }

  add() {
    this.showLoading = true;
    const arr = ['high', 'medium', 'low'];
    const index = arr.indexOf(this.priority);

    const url = 'https://stackhack-node.herokuapp.com/add';

    if(index !== -1) {
      this.data.priority = index + 1;
      
      this.httpCLient.post(url, this.data).subscribe((res) => {
        this.showLoading = false;
        console.log(res);
        alert('Task Added');
      },
      error => {
        this.showLoading = false;
        alert('Error in adding task');
      })
    }
    else {
      this.showLoading = false;
      alert('Enter correct priority');
    }
  }
}
