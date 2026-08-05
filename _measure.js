const fs = require('fs');
const zlib = require('zlib');

function decodePNG(path) {
  const buf = fs.readFileSync(path);
  let pos = 8;
  let width, height, colorType;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos); pos += 4;
    const type = buf.toString('ascii', pos, pos + 4); pos += 4;
    const data = buf.subarray(pos, pos + len); pos += len; pos += 4;
    if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); colorType = data[9]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 1;
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);
  let rp = 0;
  const paeth = (a, b, c) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++];
    for (let x = 0; x < stride; x++) {
      const v = raw[rp++];
      const a = x >= channels ? out[y * stride + x - channels] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = (x >= channels && y > 0) ? out[(y - 1) * stride + x - channels] : 0;
      let val;
      switch (filter) {
        case 0: val = v; break;
        case 1: val = v + a; break;
        case 2: val = v + b; break;
        case 3: val = v + ((a + b) >> 1); break;
        case 4: val = v + paeth(a, b, c); break;
        default: val = v;
      }
      out[y * stride + x] = val & 0xff;
    }
  }
  return { width, height, channels, data: out };
}

const dir = 'assets/diary/candle-frames-240';
const N = 240;
// strict alive-flame core
const isFlame = (r, g, b) => r > 215 && g > 110 && g < r && b < 140;

function analyze(idx) {
  const { width, height, channels, data } = decodePNG(`${dir}/${String(idx).padStart(3, '0')}.png`);
  let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1, cnt = 0;
  let cx = 0, cy = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * channels;
      const r = data[o], g = data[o + 1], b = data[o + 2];
      const a = channels === 4 ? data[o + 3] : 255;
      if (a < 120) continue;
      if (isFlame(r, g, b)) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
        cx += x; cy += y; cnt++;
      }
    }
  }
  if (!cnt) return { cnt: 0 };
  return {
    cnt,
    bx: +(x0 / width).toFixed(3),
    by: +(y0 / height).toFixed(3),
    bw: +((x1 - x0) / width).toFixed(3),
    bh: +((y1 - y0) / height).toFixed(3),
    cx: +(cx / cnt / width).toFixed(3),
    cy: +(cy / cnt / height).toFixed(3),
    base: +((y1) / height).toFixed(3),
  };
}

// ASCII map for frame 1
function ascii(idx) {
  const { width, height, channels, data } = decodePNG(`${dir}/${String(idx).padStart(3, '0')}.png`);
  // sample a coarse grid (every 18px) of the top 60% where flame lives
  const sx = 16, sy = 16;
  let out = `frame ${idx} (${width}x${height})\n`;
  const H = Math.floor(height * 0.62);
  for (let gy = 0; gy * sy < H; gy++) {
    let row = '';
    for (let gx = 0; gx * sx < width; gx++) {
      const x = gx * sx, y = gy * sy;
      const o = (y * width + x) * channels;
      const r = data[o], g = data[o + 1], b = data[o + 2];
      const a = channels === 4 ? data[o + 3] : 255;
      if (a < 120) { row += ' '; continue; }
      if (isFlame(r, g, b)) row += '#';
      else row += '.';
    }
    out += row + '\n';
  }
  return out;
}

const idx = parseInt(process.argv[2] || '1', 10);
console.log(JSON.stringify(analyze(idx)));
if (process.argv[3] === 'map') console.log(ascii(idx));
