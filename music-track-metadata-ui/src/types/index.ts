export enum ResultType {
    INFO,
    SUCCESS,
    WARNING,
    ERROR,
    SEVERE,
    NOT_AUTHORIZED,
}

export type ResponseObject<T> = {
    data?: T,
    message?: string,
    resultType?: ResultType | string,
}

export type MusicTrack = {
    isrc: string,
    name: string,
    artistName: string,
    albumName: string,
    albumId: string,
    isExplicit: boolean,
    playbackSeconds: number,
}

export enum PermissionType {
    ALL = "ALL",
    READ = "READ",
    WRITE = "WRITE"
}

export type AuthCredentials = {
    username: string,
    password: string,
}

export type User = {
    name?: string,
    username?: string,
    password?: string,
    email?: string,
    permission?: PermissionType,
}

export enum Status {
    IDLE,
    LOADING,
}