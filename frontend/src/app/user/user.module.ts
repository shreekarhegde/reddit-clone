import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserRegisterComponent } from "./user-register/user-register.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { UserRoutingModule } from "./user-routing.module";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [UserRegisterComponent, UserLoginComponent],
  imports: [CommonModule, UserRoutingModule, FormsModule],
  exports: [UserLoginComponent, UserRegisterComponent]
})
export class UserModule {}
