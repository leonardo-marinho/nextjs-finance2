import { FinanceTrackerController } from '@/lib/api/controllers/FinanceTracker.controller';
import { ApiUtils } from '@/lib/api/utils/Api.utils';

export const POST = ApiUtils.handleMethod(
  FinanceTrackerController.createTransaction,
);
