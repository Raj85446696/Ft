import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  imgLogo = "/assets/umang-logo.png";
  imgIcon15 = "/assets/1d5f81856a034e43390fa905445b462061af4d31.svg";
  imgVector21 = "/assets/1998396d40c1b6fb1a551468bf4274b19e6d335d.svg";
  imgVector22 = "/assets/7548c0ab9f021aff37480c5678c8da2b95582612.svg";
  imgIcon16 = "/assets/17c3bfa3481f16d2c6ffd8c73a883c67bdb68635.svg";
}
