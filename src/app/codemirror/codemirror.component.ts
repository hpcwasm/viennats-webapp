import {HttpClient} from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-codemirror',
  templateUrl: './codemirror.component.html',
  styleUrls: ['./codemirror.component.sass']
})
export class CodemirrorComponent implements OnInit {

  editorcontent: String = undefined;
  editoroptions = {lineNumbers: true, theme: 'xq-light', mode: 'javascript'};

  @Input()
  set filepath(filepath: string) {
    if (filepath) {
      this.http.get(filepath, {responseType: 'text'}).subscribe(data => {
        console.log(data);
        // console.log(typeof data);
        this.editorcontent = data;
        console.log( this.editorcontent);
      });
    }
    else {
      var empty: string = '//empty file \n'; 
      this.editorcontent = empty;
      console.log("filepath is undefined, loading empty file");
    }
  }



  constructor(private http: HttpClient) {

    // Make the HTTP request:
    // this.http.get('/assets/parwasm.txt', {responseType: 'text'})
    //     .subscribe(data => {
    //       console.log(data);
    //       this.editorcontent = data;
    //     });
  }
  ngOnInit() {

  }
}
