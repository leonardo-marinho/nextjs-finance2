import { FinanceTrackerController } from '@/lib/api/controllers/FinanceTracker.controller';
import { ApiService } from '@/lib/api/services/Api.service';

export const POST = ApiService.createHandler(
  FinanceTrackerController.createTransaction,
);
