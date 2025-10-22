export * from './articles.service';
import { ArticlesService } from './articles.service';
export * from './blogs.service';
import { BlogsService } from './blogs.service';
export * from './info.service';
import { InfoService } from './info.service';
export * from './reports.service';
import { ReportsService } from './reports.service';
export const APIS = [ArticlesService, BlogsService, InfoService, ReportsService];
