import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-feedback',
  standalone: true,
  imports: [Sidebar, Navbar, CommonModule],
  templateUrl: './rating-feedback.html',
  styleUrl: './rating-feedback.css',
})
export class RatingFeedback {
  sidebarService = inject(SidebarService);

  // Icons used in cards and ratings
  // Note: These hashes are from the Figma design provided. 
  // If they are not found, we can use existing placeholders or Lucide icons.
  imgStar = '/assets/17c3bfa3481f16d2c6ffd8c73a883c67bdb68635.svg'; // Using a verified star icon
  imgReviews = '/assets/1da71bf95465b4d58e5dc91618fbe2c6ad258fc0.svg'; // Placeholder chat/message
  imgSatisfaction = '/assets/7548c0ab9f021aff37480c5678c8da2b95582612.svg'; // Placeholder trend

  serviceRatings = [
    { name: 'Vaccination Certificate', reviews: 2450, rating: 4.8, change: '+0.3', changeType: 'up' },
    { name: 'Tax Filing', reviews: 1890, rating: 4.6, change: '+0.2', changeType: 'up' },
    { name: 'Admit Card Download', reviews: 3200, rating: 4.9, change: '+0.1', changeType: 'up' },
    { name: 'Driving License', reviews: 980, rating: 4.2, change: '-0.1', changeType: 'down' },
    { name: 'Electricity Bill', reviews: 1560, rating: 4.5, change: '+0.4', changeType: 'up' },
  ];

  userFeedback = [
    { name: 'Rahul Sharma', service: 'Vaccination Certificate', rating: 5, comment: 'Excellent service! Very smooth process.', time: '2 hours ago' },
    { name: 'Priya Patel', service: 'Tax Filing', rating: 4, comment: 'Good experience, but could be faster.', time: '5 hours ago' },
    { name: 'Amit Kumar', service: 'Admit Card', rating: 5, comment: 'Perfect! Got my admit card instantly.', time: '1 day ago' },
    { name: 'Sneha Reddy', service: 'Driving License', rating: 3, comment: 'Process was confusing at times.', time: '1 day ago' },
    { name: 'Vikram Singh', service: 'Electricity Bill', rating: 5, comment: 'Very convenient and easy to use.', time: '2 days ago' },
  ];

  getStarsArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}
