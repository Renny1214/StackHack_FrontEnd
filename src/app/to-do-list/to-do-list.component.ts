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
  innerLoading = false;
  current = this.getAll;

  tasks = [];
  completed;
  allLength;

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

  personal = 0;
  work = 0;
  school = 0;
  shopping = 0;
  other = 0;

  constructor(private httpCLient: HttpClient) { }

  async ngOnInit() {
    this.getAll();
    this.completedCount()
  }

  enterCategory(event) {
    this.data.category = event.target.value.toLowerCase();
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

    if (index !== -1) {
      this.data.priority = index + 1;

      this.httpCLient.post(url, this.data).subscribe((res) => {
        this.showLoading = false;
        console.log(res);
        
        location.reload();
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

  getAll() {
    const url = 'https://stackhack-node.herokuapp.com/all';
    this.tasks.splice(0, this.tasks.length);
    this.innerLoading = true;

    this.httpCLient.get(url).subscribe((res: any) => {
      this.innerLoading = false;
      this.tasks = res;

      this.allLength = this.tasks.length;

      for(let i = 0; i < this.tasks.length; i++) {
        if(this.tasks[i].category.toLowerCase() === 'personal') {
          this.personal += 1;
        }
        else if(this.tasks[i].category.toLowerCase() === 'work') {
          this.work += 1;
        }
        else if(this.tasks[i].category.toLowerCase() === 'school') {
          this.school += 1;
        }
        else if(this.tasks[i].category.toLowerCase() === 'shopping') {
          this.shopping += 1;
        }
        else {
          this.other += 1;
        }
      }
    }, error => {
      this.innerLoading = false;
    });

    this.current = this.getAll;
  }
  getProgress() {
    const url = 'https://stackhack-node.herokuapp.com/getTask';
    this.tasks.splice(0, this.tasks.length);
    this.innerLoading = true;

    this.httpCLient.get(url).subscribe((res: any) => {
      this.innerLoading = false;
      this.tasks = res;
    }, error => {
      this.innerLoading = false;
    });

    this.current = this.getProgress;
  }
  getCompleted() {
    const url = 'https://stackhack-node.herokuapp.com/getCompleted';
    this.tasks.splice(0, this.tasks.length);
    this.innerLoading = true;

    this.httpCLient.get(url).subscribe((res: any) => {
      this.innerLoading = false;
      this.tasks = res;
    }, error => {
      this.innerLoading = false;
    })

    this.current = this.getCompleted;
  }
  getByPriority() {
    const url = 'https://stackhack-node.herokuapp.com/getTask';
    this.tasks.splice(0, this.tasks.length);
    this.innerLoading = true;

    this.httpCLient.get(url).subscribe((res: any) => {
      this.tasks = res;

      this.tasks.sort((a, b) => {
        if (a.priority < b.priority) {
          return -1;
        }
        else if (a.priority > b.priority) {
          return 1;
        }
        else {
          return 0;
        }
      });

      this.innerLoading = false;
    }, error => {
      this.innerLoading = false;
    });

    this.current = this.getByPriority;
  }

  getDate(date) {
    const obj = new Date(date);
    const str = obj.getDate() + '-' + obj.getMonth() + '-' + obj.getFullYear();

    return str;
  }

  markCompleted(i) {
    const url = 'https://stackhack-node.herokuapp.com/completed/' + this.tasks[i]._id;

    this.httpCLient.get(url).subscribe((res: any) => {
      alert('Task marked completed');
      this.current();
    });
  }

  getCurrentDate() {
    const date = new Date();
    const day = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + "  " + day[date.getDay() - 1];
  }

  completedCount() {
    const url = 'https://stackhack-node.herokuapp.com/getCompleted';
    let arr = [];

    this.httpCLient.get(url).subscribe((res: any) => {
      arr = res;
      this.completed = arr.length;
    });
  }

  filter(category) {
    const url = 'https://stackhack-node.herokuapp.com/category/' + category;
    this.tasks = [];
    this.innerLoading = true;

    this.httpCLient.get(url).subscribe((res: any) => {
      this.tasks = res;
      this.innerLoading = false;
    }, error => {
      this.innerLoading = false;
    })
  }
}
