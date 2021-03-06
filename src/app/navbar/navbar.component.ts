import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() showSidebarButton: boolean;

  @Output() openSidebar: EventEmitter<any> = new EventEmitter();

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  openSideBar() {
    this.openSidebar.emit();
  }

}
