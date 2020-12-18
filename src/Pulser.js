export default class Pulser {
  constructor(x, y, f) {}

  nextColor(t) {
    const brightness = 0xFF & Math.max(0, (255 * (Math.sin(this.f * t / 1000))));
    console.log(brightness, t);
    return (brightness << 16) | (brightness << 8) | brightness;
  }
}
