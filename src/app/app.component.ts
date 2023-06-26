import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NewsService } from './service/news.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'News';
  public sources: any = [] 
  public articles: any = []
  public selectedNewsChannel: string = "Top 10 Trending News"
  public chips = [
    { name: 'Latest', selected: true}, 
    { name: 'Alphabetical', selected: false}
  ]
  @ViewChild(MatSidenav) sideNav!: MatSidenav;

  constructor(private observer: BreakpointObserver, private cdr: ChangeDetectorRef, private newsApi: NewsService) {

  }

  ngOnInit(): void {
    this.newsApi.initArticles()
    .subscribe((res:any) => {
      this.articles = res.articles;
    })
    this.newsApi.initSources()
    .subscribe((res:any) => {
      this.sources = res.sources;
    })
  }

  ngAfterViewInit(): void {
    this.sideNav.opened = true;
    this.observer.observe(['(max-width:800px)'])
    .subscribe((res)=>{
      if(res?.matches){
        this.sideNav.mode="over";
        this.sideNav.close();
      }else{
        this.sideNav.mode = 'side';
        this.sideNav.open();
      }
    })
    this.cdr.detectChanges();
  }

  searchSource(source: any) {
    this.newsApi.getArticles(source.id).subscribe((res:any) => {
      this.articles = res.articles;
      this.selectedNewsChannel = source.name
    })
  }

  filter(chip: string) {
    if (chip == 'Alphabetical') {
        this.articles.sort((a: any,b: any) => {
             let x = a.title.toLowerCase();
            let y = b.title.toLowerCase();
            if (x < y) {return -1}
            if (x > y) {return 1}
            return 0;
        })
    } else if (chip == 'Latest') {
      console.log(typeof this.articles[0].publishedAt)
      this.articles.sort((a: any,b: any) => {
        let x = new Date(a.publishedAt)
        let y = new Date(b.publishedAt)
        if (x < y) {return 1}
        if (x > y) {return -1}
        return 0;
      })
    }
  }
}
