import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Memory {
    caption: string;
    image: ExternalBlob;
}
export interface backendInterface {
    daysUntilNextBirthday(): Promise<bigint>;
    getBirthday(): Promise<[bigint, bigint]>;
    getBoyfriendName(): Promise<string>;
    getLetter(): Promise<Array<string>>;
    getMemories(): Promise<Array<Memory>>;
    isTodayBirthday(): Promise<boolean>;
    setBirthday(month: bigint, day: bigint): Promise<void>;
    setBoyfriendName(name: string): Promise<void>;
    setLetter(paragraphs: Array<string>): Promise<void>;
    setMemories(items: Array<Memory>): Promise<void>;
}
