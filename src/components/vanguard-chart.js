const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const cycleLength = 240;

function noise(index, salt = 0) {
  const value = Math.sin((index + salt * 101) * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function priceAt(index) {
  const phase = ((index % cycleLength) + cycleLength) % cycleLength;
  const angle = phase / cycleLength * Math.PI * 2;
  return 1.084 + Math.sin(angle) * .012 + Math.sin(angle * 3 + .8) * .006 + Math.sin(angle * 8 - .35) * .0022;
}

function candleAt(index) {
  const open = priceAt(index);
  const close = priceAt(index + 1);
  const spread = .0012 + noise(index, 1) * .0021;
  return {
    open,
    close,
    high: Math.max(open, close) + spread * (.45 + noise(index, 2) * .55),
    low: Math.min(open, close) - spread * (.45 + noise(index, 3) * .55)
  };
}

function averageAt(index, length) {
  let total = 0;
  for (let offset = 0; offset < length; offset += 1) total += priceAt(index - offset);
  return total / length;
}

function interpolatePrice(index) {
  const whole = Math.floor(index);
  const fraction = index - whole;
  return priceAt(whole) * (1 - fraction) + priceAt(whole + 1) * fraction;
}

function roundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function paletteForTheme() {
  const light = document.documentElement.dataset.theme === 'light';
  return light ? {
    background: '#f1f7f3',
    grid: 'rgba(16, 59, 37, .09)',
    text: '#486055',
    green: '#197849',
    mint: '#47b07b',
    neutral: '#6f8177',
    up: '#218a57',
    down: '#a94e56',
    zone: 'rgba(71, 176, 123, .13)',
    zoneBorder: 'rgba(25, 120, 73, .4)',
    price: '#155f3b',
    labelText: '#f5faf7'
  } : {
    background: '#050907',
    grid: 'rgba(245, 250, 247, .07)',
    text: '#84928a',
    green: '#47b07b',
    mint: '#8dd8af',
    neutral: '#8b9991',
    up: '#61c892',
    down: '#d96c76',
    zone: 'rgba(71, 176, 123, .1)',
    zoneBorder: 'rgba(141, 216, 175, .38)',
    price: '#8dd8af',
    labelText: '#03120a'
  };
}

function drawMarker(context, x, y, direction, colors, compact) {
  const size = compact ? 5 : 6;
  const fill = direction === 'up' ? colors.green : colors.neutral;
  context.save();
  context.fillStyle = fill;
  context.shadowColor = fill;
  context.shadowBlur = compact ? 3 : 7;
  context.beginPath();
  if (direction === 'up') {
    context.moveTo(x, y - size);
    context.lineTo(x - size, y + size);
    context.lineTo(x + size, y + size);
  } else {
    context.moveTo(x, y + size);
    context.lineTo(x - size, y - size);
    context.lineTo(x + size, y - size);
  }
  context.closePath();
  context.fill();
  context.restore();
}

export function initVanguardChart(frame) {
  const canvas = frame?.querySelector('[data-vanguard-chart-canvas]');
  const context = canvas?.getContext('2d');
  if (!frame || !canvas || !context) return () => {};

  let cssWidth = 1;
  let cssHeight = 1;
  let visible = true;
  let frameId = 0;
  let renderCount = 0;
  let animationTime = 32.35;
  let lastTimestamp = 0;
  let lastDraw = 0;
  let colors = paletteForTheme();

  const draw = (elapsed) => {
    const width = cssWidth;
    const height = cssHeight;
    const compact = width < 620;
    const top = compact ? 48 : 58;
    const bottom = compact ? 29 : 38;
    const rightGutter = compact ? 48 : 64;
    const plotWidth = Math.max(1, width - rightGutter);
    const plotHeight = Math.max(1, height - top - bottom);
    const step = compact ? 19 : 17;
    const bodyWidth = compact ? 7 : 8;
    const scrollCells = elapsed * (compact ? .72 : .84);
    const baseIndex = Math.floor(scrollCells);
    const fraction = scrollCells - baseIndex;
    const candleCount = Math.ceil(plotWidth / step) + 5;
    const firstIndex = baseIndex - candleCount + 3;
    const cameraPrice = interpolatePrice(scrollCells - candleCount * .28);
    const range = compact ? .039 : .036;
    const yFor = (price) => top + plotHeight * (.5 - (price - cameraPrice) / range);

    context.clearRect(0, 0, width, height);
    context.fillStyle = colors.background;
    context.fillRect(0, 0, width, height);

    context.save();
    context.strokeStyle = colors.grid;
    context.lineWidth = 1;
    const gridSize = compact ? 32 : 40;
    const gridOffset = (scrollCells * 4) % gridSize;
    for (let x = -gridSize; x <= width + gridSize; x += gridSize) {
      context.beginPath();
      context.moveTo(x - gridOffset, top);
      context.lineTo(x - gridOffset, height - bottom);
      context.stroke();
    }
    for (let y = top; y <= height - bottom; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    context.restore();

    const zoneStart = plotWidth * .48;
    const zoneEnd = plotWidth * .72;
    const zoneCenter = yFor(averageAt(baseIndex - Math.round(candleCount * .38), 14));
    const zoneHeight = Math.max(28, plotHeight * .2);
    context.fillStyle = colors.zone;
    context.strokeStyle = colors.zoneBorder;
    context.lineWidth = 1;
    roundedRect(context, zoneStart, zoneCenter - zoneHeight / 2, zoneEnd - zoneStart, zoneHeight, 8);
    context.fill();
    context.stroke();

    for (let item = 0; item < candleCount; item += 1) {
      const index = firstIndex + item;
      const candle = candleAt(index);
      const x = plotWidth - (candleCount - item - 2 + fraction) * step;
      if (x < -step || x > plotWidth + step) continue;
      const rising = candle.close >= candle.open;
      const color = rising ? colors.up : colors.down;
      const openY = yFor(candle.open);
      const closeY = yFor(candle.close);
      const highY = yFor(candle.high);
      const lowY = yFor(candle.low);
      context.strokeStyle = color;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(x, highY);
      context.lineTo(x, lowY);
      context.stroke();
      context.fillStyle = color;
      const bodyTop = Math.min(openY, closeY);
      context.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, Math.max(2, Math.abs(closeY - openY)));

      if (index % 43 === 7) drawMarker(context, x, lowY + 13, 'up', colors, compact);
      if (index % 59 === 21) drawMarker(context, x, highY - 13, 'down', colors, compact);
    }

    const drawIndicator = (length, color, lineWidth, glow) => {
      context.save();
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.shadowColor = color;
      context.shadowBlur = glow;
      context.beginPath();
      let started = false;
      for (let item = 0; item < candleCount; item += 1) {
        const index = firstIndex + item;
        const x = plotWidth - (candleCount - item - 2 + fraction) * step;
        if (x < -step || x > plotWidth + step) continue;
        const y = yFor(averageAt(index, length));
        if (!started) { context.moveTo(x, y); started = true; } else context.lineTo(x, y);
      }
      context.stroke();
      context.restore();
    };
    drawIndicator(8, colors.mint, compact ? 1.4 : 1.7, compact ? 2 : 5);
    drawIndicator(21, colors.neutral, compact ? 1 : 1.25, 0);

    const currentPrice = interpolatePrice(scrollCells + 1);
    const currentY = Math.max(top + 10, Math.min(height - bottom - 10, yFor(currentPrice)));
    context.save();
    context.strokeStyle = colors.price;
    context.lineWidth = 1;
    context.setLineDash([5, 5]);
    context.beginPath();
    context.moveTo(0, currentY);
    context.lineTo(width - 7, currentY);
    context.stroke();
    context.setLineDash([]);
    const labelWidth = compact ? 47 : 59;
    const labelHeight = compact ? 20 : 22;
    context.fillStyle = colors.price;
    roundedRect(context, width - labelWidth - 4, currentY - labelHeight / 2, labelWidth, labelHeight, 5);
    context.fill();
    context.fillStyle = colors.labelText;
    context.font = `${compact ? 9 : 10}px ui-monospace, SFMono-Regular, Consolas, monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(currentPrice.toFixed(4), width - labelWidth / 2 - 4, currentY + .5);
    context.restore();

    renderCount += 1;
    canvas.dataset.renderCount = String(renderCount);
  };

  const canAnimate = () => visible && !document.hidden && !reduceMotionQuery.matches;
  const tick = (timestamp) => {
    if (!canAnimate()) { frameId = 0; return; }
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = Math.min(50, timestamp - lastTimestamp);
    lastTimestamp = timestamp;
    animationTime += delta / 1000;
    if (timestamp - lastDraw >= 32) {
      draw(animationTime);
      lastDraw = timestamp;
    }
    frameId = requestAnimationFrame(tick);
  };
  const schedule = () => {
    if (!canAnimate()) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      lastTimestamp = 0;
      return;
    }
    if (!frameId) frameId = requestAnimationFrame(tick);
  };
  const resize = () => {
    const bounds = frame.getBoundingClientRect();
    cssWidth = Math.max(1, Math.round(bounds.width));
    cssHeight = Math.max(1, Math.round(bounds.height));
    const maxRatio = cssWidth < 620 ? 1.5 : 2;
    const ratio = Math.min(window.devicePixelRatio || 1, maxRatio);
    canvas.width = Math.round(cssWidth * ratio);
    canvas.height = Math.round(cssHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(animationTime);
  };
  const onVisibilityChange = () => schedule();
  const onMotionChange = () => {
    draw(animationTime);
    schedule();
  };

  const resizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }, { rootMargin: '80px 0px', threshold: 0 });
  const themeObserver = new MutationObserver(() => {
    colors = paletteForTheme();
    draw(animationTime);
  });
  resizeObserver.observe(frame);
  visibilityObserver.observe(frame);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('visibilitychange', onVisibilityChange);
  reduceMotionQuery.addEventListener('change', onMotionChange);
  resize();
  schedule();

  return () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    themeObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    reduceMotionQuery.removeEventListener('change', onMotionChange);
  };
}
