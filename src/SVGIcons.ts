declare function require(svgPath: string): string;

export class SVGIcons {
  public static icons = {
    video: require(`./stylesheets/video.svg`)
  };
}
