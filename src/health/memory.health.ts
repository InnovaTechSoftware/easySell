import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class MemoryHealthIndicator extends HealthIndicator {
  private readonly MEMORY_LIMIT_MB = 80;  

  async checkHealth(key: string): Promise<HealthIndicatorResult> {
    const memory = process.memoryUsage();
    const memoryUsageInMB = Math.round(memory.rss / 1024 / 1024);

    const isHealthy = memoryUsageInMB <= this.MEMORY_LIMIT_MB;

    const formatMemory = {
      memory: `${memoryUsageInMB} MB`,
    };

    if (!isHealthy) {
      return this.getStatus(key, false, {
        ...formatMemory,
        message: `Memoria excede el límite de ${this.MEMORY_LIMIT_MB} MB`,
      });
    }

    return this.getStatus(key, true, formatMemory);
  }
}
