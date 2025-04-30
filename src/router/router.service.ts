import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RouterService {
  private routesBasePath = path.resolve(__dirname, '../../routes');

  getRouteFolders(): string[] {
    console.log(`[RouterService] Looking for route folders in: ${this.routesBasePath}`);
    if (!fs.existsSync(this.routesBasePath)) {
      console.warn(`[RouterService] Routes folder not found at: ${this.routesBasePath}`);
      return [];
    }
    const folders = fs.readdirSync(this.routesBasePath).filter((folder) => {
      const fullPath = path.join(this.routesBasePath, folder);
      return fs.lstatSync(fullPath).isDirectory();
    });
    console.log(`[RouterService] Found route folders: ${folders}`);
    return folders;
  }

  getRouteConfig(folder: string): any | null {
    const configPath = path.join(this.routesBasePath, folder, 'route-config.json');
    console.log(`[RouterService] Looking for route config in: ${configPath}`);
    if (fs.existsSync(configPath)) {
      const config = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(config);
    }
    console.warn(`[RouterService] Route config not found for folder: ${folder}`);
    return null;
  }
}