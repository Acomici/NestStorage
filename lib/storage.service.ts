import { Injectable, Inject } from '@nestjs/common';
import { StorageOptions } from './interfaces';
import { StorageDriver } from './interfaces';
import { DriverManager } from './driverManager';
import { map } from './provider.map';

@Injectable()
export class StorageService {
  private static diskDrivers: { [key: string]: any };
  private static options: StorageOptions;
  private static driverManager: DriverManager;

  constructor(@Inject(map.STORAGE_OPTIONS) options: StorageOptions) {
    StorageService.options = options;
    StorageService.diskDrivers = {};
    StorageService.driverManager = new DriverManager();
  }

  static getDriver(disk?: string): StorageDriver {
    const selectedDisk = disk || this.options.default;

    if(!selectedDisk) {
      throw new Error('Please set option default for disk name');
    }

    if (StorageService.diskDrivers[selectedDisk]) {
      return StorageService.diskDrivers[selectedDisk];
    }

    const driver = StorageService.newDriver(selectedDisk);
    StorageService.diskDrivers[selectedDisk] = driver;
    return driver;
  }

  static newDriver(disk: string): StorageDriver {
    return StorageService.driverManager.getDriver(
      disk,
      StorageService.options.disks[disk],
    );
  }
}
