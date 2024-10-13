import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class ManageMenuComponent implements OnInit {
  menuList: any[] = [];
  menuForm: FormGroup;
  selectedFile: File = null;
  isEditMode: boolean = false;
  editingMenuId: number | null = null;

  constructor(
    private menuService: MenuService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getAllMenu();
    this.menuForm = this.fb.group({
      name: [''],
      description: [''],
      price: [''],
      category: [''],
    });
  }

  // ฟังก์ชันการดึงข้อมูลเมนูทั้งหมด
  getAllMenu() {
    this.menuService.getAllMenu().subscribe((data: any) => {
      this.menuList = data.data;
      console.log(this.menuList);
    });
  }

  // ฟังก์ชันสำหรับการเพิ่มเมนูใหม่
  addMenu() {
    const formData = new FormData();
    formData.append('name', this.menuForm.get('name').value);
    formData.append('description', this.menuForm.get('description').value);
    formData.append('price', this.menuForm.get('price').value);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.menuService.addMenu(formData).subscribe(
      (response) => {
        console.log('Menu added successfully', response);
        this.getAllMenu();
        this.menuForm.reset();
      },
      (error) => {
        console.error('Error adding menu', error);
      }
    );
  }

  // ฟังก์ชันสำหรับการแก้ไขเมนู
  updateMenu() {
    if (this.editingMenuId !== null) {
      const formData = new FormData();
      formData.append('name', this.menuForm.get('name').value);
      formData.append('description', this.menuForm.get('description').value);
      formData.append('price', this.menuForm.get('price').value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.menuService.updateMenu(this.editingMenuId, formData).subscribe(
        (response) => {
          console.log('Menu updated successfully', response);
          this.getAllMenu();
          this.menuForm.reset();
          this.isEditMode = false;
          this.editingMenuId = null;
        },
        (error) => {
          console.error('Error updating menu', error);
        }
      );
    }
  }

  // ฟังก์ชันสำหรับลบเมนู
  deleteMenu(id: number) {
    this.menuService.deleteMenu(id).subscribe(
      (response) => {
        console.log('Menu deleted successfully', response);
        this.getAllMenu(); // โหลดข้อมูลใหม่หลังจากลบเมนูสำเร็จ
      },
      (error) => {
        console.error('Error deleting menu', error);
      }
    );
  }

  // ฟังก์ชันสำหรับเลือกภาพเมนู
  onFileSelected(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files[0];
  }

  // ฟังก์ชันสำหรับจัดการการบันทึกหรือแก้ไขเมนู
  onSubmitMenu() {
    if (this.isEditMode) {
      this.updateMenu();
    } else {
      this.addMenu();
    }
  }

  // ฟังก์ชันสำหรับตั้งค่าเมนูที่จะแก้ไข
  editMenu(menu: any) {
    this.isEditMode = true;
    this.editingMenuId = menu.id;
    this.menuForm.patchValue({
      name: menu.name,
      description: menu.description,
      price: menu.price,
      category: menu.category
    });
  }
}
