import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-rating-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-feedback.html',
  styleUrl: './rating-feedback.css',
})
export class RatingFeedback implements OnInit {
    private cdr = inject(ChangeDetectorRef);
  sidebarService = inject(SidebarService);
  private coreService = inject(CoreService);

  imgStar = '/assets/17c3bfa3481f16d2c6ffd8c73a883c67bdb68635.svg';
  imgReviews = '/assets/1da71bf95465b4d58e5dc91618fbe2c6ad258fc0.svg';
  imgSatisfaction = '/assets/7548c0ab9f021aff37480c5678c8da2b95582612.svg';

  isLoading = true;
  serviceRatings: any[] = [];
  userFeedback: any[] = [];

  ngOnInit() {
    this.loadRatings();
  }

  loadRatings() {
    this.isLoading = true;
    this.coreService.searchServices().subscribe({
      next: (res) => {
        if (res.rs === 'S' && res.pd) {
          const services = Array.isArray(res.pd) ? res.pd : [res.pd];
          const topServices = services.slice(0, 10);

          this.serviceRatings = topServices.map((s: any) => ({
            name: s.serviceName || s.sname || s.categoryName || '',
            reviews: 0,
            rating: parseFloat(s.avgrating) || 0,
            change: '+0.0',
            changeType: 'up',
            srid: s.serviceId || s.srid || ''
          }));

          // Load detailed ratings for each service
          topServices.forEach((s: any, i: number) => {
            const srid = s.serviceId || s.srid;
            if (srid) {
              this.coreService.getServiceRating(Number(srid)).subscribe({
                next: (ratingRes) => {
                  if (ratingRes.success && ratingRes.data) {
                    this.serviceRatings[i].reviews = ratingRes.data.totalRatings || 0;
                    this.serviceRatings[i].rating = ratingRes.data.avg || 0;
                  }
                      this.cdr.detectChanges();
                }
              });

              // Load comments for user feedback
              if (i < 5) {
                this.coreService.getRatingComments(Number(srid), 0, 5).subscribe({
                  next: (commentsRes) => {
                    if (commentsRes.success && commentsRes.data?.comments) {
                      commentsRes.data.comments.forEach((c: any) => {
                        this.userFeedback.push({
                          name: `User #${c.uid}`,
                          service: this.serviceRatings[i]?.name || '',
                          rating: c.currentRating || 0,
                          comment: c.comments || 'No comment',
                          time: c.createdDate || ''
                        });
                      });
                    }
                        this.cdr.detectChanges();
                  }
                });
              }
            }
          });
        }
        this.isLoading = false;
            this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
          this.cdr.detectChanges();
      }
    });
  }

  get avgRating(): number {
    if (!this.serviceRatings.length) return 0;
    const sum = this.serviceRatings.reduce((s, r) => s + (r.rating || 0), 0);
    return Math.round((sum / this.serviceRatings.length) * 10) / 10;
  }

  get totalReviews(): number {
    return this.serviceRatings.reduce((s, r) => s + (r.reviews || 0), 0);
  }

  getStarsArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}
