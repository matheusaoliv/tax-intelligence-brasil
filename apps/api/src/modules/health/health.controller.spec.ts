import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns the API health status and an ISO timestamp', () => {
    const controller = new HealthController();
    const result = controller.getHealth();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('tax-intelligence-api');
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });
});
