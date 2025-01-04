import { FinanceTrackerController } from '@/lib/api/controllers/FinanceTracker.controller';
import { ApiUtils } from '@/lib/api/utils/Api.utils';

export const GET = ApiUtils.handleMethod(FinanceTrackerController.getOptions);
