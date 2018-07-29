import {AbstractCrawler} from "../AbstractCrawler";
import * as cheerio from 'cheerio';
import {TaskConfiguration} from "../../api/svandis/resources/dataModel/TaskConfiguration";
import {Observable} from "rxjs/internal/Observable";
import {Injectable} from "@nestjs/common";
import * as _ from "lodash";

@Injectable()
export class GeneralWebCrawler extends AbstractCrawler {

    public getLinks(task: TaskConfiguration): Observable<string[]> {
        const crawler = this.crawlForLinks(task);
        let results = [];

        return Observable.create((observer) => {
            crawler.on('discoverycomplete', (queItem, resource) => {
                results = _.concat(results, resource);
            });
            crawler.on('complete', () => {
                observer.next(results);
                observer.complete();
            });
            crawler.start();
        });
    }

    protected crawlForLinks(task: TaskConfiguration): any {
        const crawler = this.configureCrawler(task.config.url);
        crawler.discoverResources = (buffer) => {
            const $: CheerioStatic = cheerio.load(buffer.toString("utf8"));
            const selector: string = task.config.linkSelector;

            return !this.isInvalidSelector(selector) ?
                $(selector).map((index, element) => $(element).attr("href")).get() : null;
        };

        return crawler;
    }

    private isInvalidSelector(selector: string): boolean {
        return /class=/.test(selector);
    }
}
