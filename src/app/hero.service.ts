import { Hero } from "./hero";
import { Heroes } from "./mock-heroes";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { MessageService } from "./message.service";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class HeroService {

    private heroesUrl = 'api/heroes';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }

    constructor(
        private httpClient: HttpClient,
        private messageService: MessageService
    ) { }

    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.httpClient.get<Hero>(url).pipe(
            tap(() => this.log(`fetched hero id=${id}`)),
            catchError(this.handleError<Hero>(`${this.getHero.name} id=${id}`))
        );
    }

    getHeroes(): Observable<Hero[]> {
        return this.httpClient.get<Hero[]>(this.heroesUrl).pipe(
            tap(() => this.log('fetched heroes')),
            catchError(this.handleError<Hero[]>(this.getHeroes.name, []))
        );
    }

    updateHero(hero: Hero): Observable<any> {
        return this.httpClient.put(this.heroesUrl, hero, this.httpOptions).pipe(
            tap(() => this.log(`updated hero id=${hero.id}`)),
            catchError(this.handleError<any>(this.updateHero.name))
        );
    }

    addHero(hero: Hero): Observable<Hero> {
        return this.httpClient.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
            tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
            catchError(this.handleError<Hero>(this.addHero.name))
        )
    }

    deleteHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.httpClient.delete<Hero>(url, this.httpOptions).pipe(
            tap(() => this.log(`deleted hero id=${id}`)),
            catchError(this.handleError<Hero>(this.deleteHero.name))
        )
    }

    searchHeroes(term: string): Observable<Hero[]> {
        if (!term.trim()) {
            return of([]);
        }

        return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
            tap(x => x.length
                ? this.log(`found heroes matching ${JSON.stringify(term)}`)
                : this.log(`no heroes found matching ${JSON.stringify(term)}`)
            ),
            catchError(this.handleError<Hero[]>(this.searchHeroes.name, []))
        );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);

            this.log(`${operation} failed: ${error.message}`);

            return of(result as T);
        };
    }

    private log(message: string) {
        this.messageService.add(`${HeroService.name}: ${message}`);
    }

}