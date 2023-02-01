export default class Loader {
  constructor(container, paths) {
    this.container = container;
    this.paths = paths;
    this.maxLength = 0;
    this.keyframe = [];
    this.timing = {
      duration: 3000,
      // linear easing is default
      iterations: Infinity,
      direction: 'alternate',
    };
    this.animations = [];
  }

  getMaxPathLength() {
    const lengths = Array.from(this.paths).map((path) => path.getTotalLength());
    this.maxLength = Math.floor(Math.max(...lengths));
    return this;
  }

  setStrokeArrayAndOffset() {
    this.paths.forEach((path) => {
      const svgPath = path;
      svgPath.style.stroke = 'var(--secondary-color)';
      // length of dash and gap between
      svgPath.style.strokeDasharray = Math.floor(this.maxLength / 2);
      // starting point
      svgPath.style.strokeDashoffset = 0;
    });
    return this;
  }

  createKeyFrame() {
    this.keyframe = [
      // from
      {
        strokeDashoffset: this.maxLength,
      },
      // to
      {
        strokeDashoffset: 0,
      },
    ];
    return this;
  }

  animatePaths() {
    this.animations = Array.from(this.paths).map((path) => {
      return path.animate(this.keyframe, this.timing);
    });
    this.pause();
    return this;
  }

  pause() {
    this.animations.forEach((animation) => animation.pause());
  }

  play() {
    this.animations.forEach((animation) => animation.play());
  }

  render() {
    this.play();
    this.container.style.display = 'grid';
  }

  hide() {
    this.container.style.display = 'none';
    this.pause();
  }

  init() {
    this.getMaxPathLength()
      .setStrokeArrayAndOffset()
      .createKeyFrame()
      .animatePaths()
      .render();
  }
}
