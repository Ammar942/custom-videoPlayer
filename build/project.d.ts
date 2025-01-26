declare let cont: HTMLElement;
interface VideoInter {
    container: string;
    source: string;
    theme?: string;
    skip?: number;
    muted?: boolean;
    autoplaying?: boolean;
}
declare let style: HTMLStyleElement;
declare class VideoPlayer implements VideoInter {
    container: string;
    source: string;
    theme?: string | undefined;
    skip?: number | undefined;
    muted?: boolean;
    autoplaying?: boolean;
    constructor(container: string, source: string, theme?: string, skip?: number, muted?: boolean, autoplaying?: boolean);
}
declare let vp: VideoPlayer;
declare let vp2: VideoPlayer;
declare let vp3: VideoPlayer;
