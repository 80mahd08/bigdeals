import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { MENU, SELLER_MENU } from './menu';
import { MenuItem } from './menu.model';
import { AuthenticationService } from '../../core/services/auth.service';

@Component({
    selector: 'app-admin-sidebar',
    templateUrl: './admin-sidebar.component.html',
    styles: [`
        .navbar-menu { border-right: 1px solid var(--vz-border-color); }
        .sidebar-menu-scroll { height: 100%; }
        .sidebar-logo-small { display: none !important; }
        .sidebar-logo-large { display: block !important; }
        
        [data-sidebar-size="sm"] .sidebar-logo-small { display: block !important; }
        [data-sidebar-size="sm"] .sidebar-logo-large { display: none !important; }
        
        /* When hovering a shrunk sidebar */
        .vertical-sidebar-enable .navbar-menu:hover .sidebar-logo-small,
        [data-sidebar-size="sm"] .navbar-menu:hover .sidebar-logo-small { display: none !important; }
        
        .vertical-sidebar-enable .navbar-menu:hover .sidebar-logo-large,
        [data-sidebar-size="sm"] .navbar-menu:hover .sidebar-logo-large { display: block !important; }
    `],
    standalone: false
})
export class AdminSidebarComponent implements OnInit, AfterViewInit {

  menuItems: MenuItem[] = [];
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(
    private router: Router, 
    public translate: TranslateService,
    private authService: AuthenticationService
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    // Initialize Menu Items
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role === 'ANNOUNCER') {
      this.menuItems = SELLER_MENU;
    } else {
      this.menuItems = MENU;
    }
    
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.initActiveMenu();
        }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initActiveMenu();
    }, 0);
  }

  removeActivation(items: any) {
    items.forEach((item: any) => {
      item.classList.remove("active");
    });
  }

  toggleItem(item: any) {
    this.menuItems.forEach((menuItem: any) => {
      if (menuItem === item) {
        menuItem.isCollapsed = !menuItem.isCollapsed;
      } else {
        // Only collapse others if they aren't the parent of the clicked item
        if (!menuItem.subItems || !menuItem.subItems.includes(item)) {
          menuItem.isCollapsed = true;
        }
      }
      
      if (menuItem.subItems) {
        menuItem.subItems.forEach((subItem: any) => {
          if (subItem === item) {
            menuItem.isCollapsed = false; // Keep parent open
            subItem.isCollapsed = !subItem.isCollapsed;
          }
        });
      }
    });
  }

  activateParentDropdown(item: any) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      if (parentCollapseDiv.parentElement && parentCollapseDiv.parentElement.children[0]) {
        parentCollapseDiv.parentElement.children[0].classList.add("active");
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  initActiveMenu() {
    const pathName = window.location.pathname;
    const active = this.findMenuItem(pathName, this.menuItems);
    if (active) {
      this.toggleItem(active);
    }
    
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) => x.classList.contains("active"));
      this.removeActivation(activeItems);

      let matchingMenuItem = items.find((x: any) => {
          return (x as any).pathname === pathName;
      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  private findMenuItem(pathname: string, menuItems: any[]): any {
    for (const menuItem of menuItems) {
      if (menuItem.link && menuItem.link === pathname) {
        return menuItem;
      }

      if (menuItem.subItems) {
        const foundItem = this.findMenuItem(pathname, menuItem.subItems);
        if (foundItem) {
          return foundItem;
        }
      }
    }
    return null;
  }

  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  SidebarHide() {
    document.body.classList.remove('vertical-sidebar-enable');
  }
}
