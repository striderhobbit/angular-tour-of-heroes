import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, Input } from '@angular/core';
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { Location } from "@angular/common";

@Component({
    selector: 'app-hero-detail',
    templateUrl: './hero-detail.component.html',
    styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private heroService: HeroService,
        private location: Location,
    ) { }

    ngOnInit(): void {
        this.getHero();
    }

    getHero(): void {
        const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.heroService.getHero(id)
            .subscribe(hero => this.hero = hero);
    }

    goBack(): void {
        this.location.back();
    }

    save(): void {
        if (this.hero) {
            this.heroService.updateHero(this.hero)
                .subscribe(() => this.goBack());
        }
    }

    @Input() hero?: Hero;

}