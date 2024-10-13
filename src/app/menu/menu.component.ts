import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  adminIsLoggedIn: boolean = false;
  menuList: any[] = [];

  constructor(private router: Router, private userService: UsersService, private menuService: MenuService) {}

  ngOnInit() {
    this.checkAdminStatus();
    this.getMenuList();
  }

  checkAdminStatus() {
    if (this.userService.isUserLoggedIn()) {
      this.adminIsLoggedIn = true;
    } else {
      this.adminIsLoggedIn = false;
    }
  }

  getMenuList() {
    this.menuService.getAllMenu().subscribe(
      (response: any) => {
        this.menuList = response.data;
      },
      (error) => {
        console.error('Error fetching menu list:', error);
      }
    );
  }

  manageMenu() {
    this.router.navigate(['/admin/menu']);
  }
}
