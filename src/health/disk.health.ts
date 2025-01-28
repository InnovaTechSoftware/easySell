import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import * as diskusage from 'diskusage';

@Injectable()
export class DiskHealthIndicator extends HealthIndicator {
  private readonly DISK_SPACE_THRESHOLD = 1024 * 1024 * 1024; // 1GB

  async checkHealth(key: string): Promise<HealthIndicatorResult> {
    try {
      const { available, total } = diskusage.checkSync('/');
      const avaliableMB = Math.round(available / 1024 / 1024);
      const totalMB = Math.round(total / 1024 / 1024);

      const isHealthy = available > this.DISK_SPACE_THRESHOLD;

      return this.getStatus(key, isHealthy, {
        available: `${avaliableMB} MB`,
        total: `${totalMB} MB`,
      });
    } catch (error) {
      return this.getStatus(key, false, {
        message: error.message,
      });
    }
  }
}
