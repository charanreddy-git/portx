import os from "node:os";
import fs from "node:fs/promises";
import path from "node:path";
import { JSONFilePreset } from "lowdb/node";
import type { RestartMetadata, RestartStore } from "../types/index.js";

const defaultStore: RestartStore = {};

export class StorageService {
  private readonly filePath: string;

  public constructor(filePath = path.join(process.env.PORTX_HOME ?? path.join(os.homedir(), ".portx"), "store.json")) {
    this.filePath = filePath;
  }

  public async get(port: number): Promise<RestartMetadata | null> {
    const db = await this.open();
    return db.data[String(port)] ?? null;
  }

  public async set(port: number, metadata: RestartMetadata): Promise<void> {
    const db = await this.open();
    db.data[String(port)] = metadata;
    await db.write();
  }

  public async delete(port: number): Promise<void> {
    const db = await this.open();
    delete db.data[String(port)];
    await db.write();
  }

  public getPath(): string {
    return this.filePath;
  }

  private async open() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    return JSONFilePreset<RestartStore>(this.filePath, defaultStore);
  }
}
