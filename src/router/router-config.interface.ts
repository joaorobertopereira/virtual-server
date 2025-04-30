export interface RouteConfig {
    request: {
      header: Record<string, string>;
      body: Record<string, any>;
    };
    response: {
      header: Record<string, string>;
      body: Record<string, any>;
    };
  }