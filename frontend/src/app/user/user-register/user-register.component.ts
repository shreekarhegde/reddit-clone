import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-register",
  templateUrl: "./user-register.component.html",
  styleUrls: ["./user-register.component.css"]
})
export class UserRegisterComponent implements OnInit {
  constructor(private router: Router) {}
  public isNextButtonClicked = false;
  ngOnInit() {}

  getUserEmail(f: NgForm): void {
    this.isNextButtonClicked = true;
    console.log("here");
  }
  backToEmail() {
    this.isNextButtonClicked = false;
  }
}
