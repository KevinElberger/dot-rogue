export default class Pulser {
  x;
  y;
  f;

  constructor(x, y, f) {
    this.x = x;
    this.y = y;
    this.f = y;
  }

  nextColor(t) {
    const brightness = 0xFF & Math.max(0, (255 * (Math.sin(this.f * t / 1000))));
    console.log(brightness, t);
    console.log((brightness << 16) | (brightness << 8) | brightness);
    return (brightness << 16) | (brightness << 8) | brightness;
  }
}
