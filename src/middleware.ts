'use service';

import { NextJsMiddlewareService } from '@/lib/ui/services/NextJsMiddleware.service';

export const middleware = NextJsMiddlewareService.handle;

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
