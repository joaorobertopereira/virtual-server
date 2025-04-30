import { Controller, Req, Res, OnModuleInit } from '@nestjs/common';
import { Request, Response } from 'express';
import { RouterService } from './router.service';
import { ModuleRef } from '@nestjs/core';

@Controller()
export class RouterController implements OnModuleInit {
  constructor(private readonly routerService: RouterService, private moduleRef: ModuleRef) {}

  private dynamicRoutes = new Map<string, any>();

  // Inicializa as rotas dinâmicas ao subir o servidor
  onModuleInit() {
    const folders = this.routerService.getRouteFolders();

    folders.forEach((folder) => {
      const [method, ...routeParts] = folder.split('-');
      const routePath = '/' + routeParts.join('/'); // Constrói o path da rota
      const config = this.routerService.getRouteConfig(folder);

      if (config) {
        this.dynamicRoutes.set(`${method}:${routePath}`, config);
      }
    });
  }

  // Gerencia todas as requisições dinâmicas
  async handleRequest(@Req() req: Request, @Res() res: Response) {
    const key = `${req.method}:${req.path}`;
    const routeConfig = this.dynamicRoutes.get(key);

    if (!routeConfig) {
      return res.status(404).send({ message: 'Route not found' });
    }

    const { response } = routeConfig;
    res.set(response.header || {});
    return res.status(200).send(response.body || {});
  }
}