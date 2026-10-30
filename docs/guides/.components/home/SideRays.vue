<script setup lang="ts">
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

type SideRaysOrigin = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
type Rgb = [number, number, number]

interface WebGLUniforms {
  iTime: { value: number }
  iResolution: { value: [number, number] }
  iSpeed: { value: number }
  iRayColor1: { value: Rgb }
  iRayColor2: { value: Rgb }
  iIntensity: { value: number }
  iSpread: { value: number }
  iFlipX: { value: number }
  iFlipY: { value: number }
  iTilt: { value: number }
  iSaturation: { value: number }
  iBlend: { value: number }
  iFalloff: { value: number }
  iOpacity: { value: number }
}

const props = withDefaults(defineProps<{
  speed?: number
  rayColor1?: string
  rayColor2?: string
  intensity?: number
  spread?: number
  origin?: SideRaysOrigin
  tilt?: number
  saturation?: number
  blend?: number
  falloff?: number
  opacity?: number
  className?: string
}>(), {
  speed: 2.5,
  rayColor1: 'var(--vp-c-brand-1)',
  rayColor2: 'var(--vp-c-brand-2)',
  intensity: 2,
  spread: 2,
  origin: 'top-right',
  tilt: 0,
  saturation: 1.5,
  blend: 0.75,
  falloff: 1.6,
  opacity: 0.48,
  className: '',
})

const containerRef = ref<HTMLDivElement | null>(null)
const uniformsRef = shallowRef<WebGLUniforms | null>(null)
const rendererRef = shallowRef<Renderer | null>(null)
const meshRef = shallowRef<Mesh | null>(null)
const animationFrame = ref<number | null>(null)
const isVisible = ref(false)
const rayColor1 = ref<Rgb>([1, 1, 1])
const rayColor2 = ref<Rgb>([1, 1, 1])
let intersectionObserver: IntersectionObserver | undefined
let themeObserver: MutationObserver | undefined
let motionPreference: MediaQueryList | undefined
let resizeObserver: ResizeObserver | undefined
let motionPreferenceChange: (() => void) | undefined
let isUnmounted = false

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`

const fragmentShader = `precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);
  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);
  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`

function resolveCssColor(color: string): Rgb {
  if (typeof document === 'undefined') return [1, 1, 1]
  const probe = document.createElement('span')
  probe.style.color = color
  probe.setAttribute('aria-hidden', 'true')
  probe.style.position = 'fixed'
  probe.style.visibility = 'hidden'
  document.body.append(probe)
  const resolvedColor = getComputedStyle(probe).color
  probe.remove()

  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return [1, 1, 1]
  context.fillStyle = '#ffffff'
  context.fillStyle = resolvedColor
  context.fillRect(0, 0, 1, 1)
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data
  return [red / 255, green / 255, blue / 255]
}

function updateThemeColors(): void {
  rayColor1.value = resolveCssColor(props.rayColor1)
  rayColor2.value = resolveCssColor(props.rayColor2)
  if (uniformsRef.value) {
    uniformsRef.value.iRayColor1.value = rayColor1.value
    uniformsRef.value.iRayColor2.value = rayColor2.value
  }
}

function originFlip(origin: SideRaysOrigin): [number, number] {
  switch (origin) {
    case 'top-left': return [1, 0]
    case 'bottom-right': return [0, 1]
    case 'bottom-left': return [1, 1]
    default: return [0, 0]
  }
}

function updateSize(): void {
  const renderer = rendererRef.value
  const container = containerRef.value
  const uniforms = uniformsRef.value
  if (!renderer || !container || !uniforms) return
  renderer.dpr = Math.min(window.devicePixelRatio || 1, 2)
  renderer.setSize(container.clientWidth, container.clientHeight)
  uniforms.iResolution.value = [container.clientWidth * renderer.dpr, container.clientHeight * renderer.dpr]
}

function renderFrame(time: number): void {
  const renderer = rendererRef.value
  const mesh = meshRef.value
  const uniforms = uniformsRef.value
  if (!renderer || !mesh || !uniforms || !isVisible.value || isUnmounted) return
  uniforms.iTime.value = time * 0.001
  renderer.render({ scene: mesh })
  if (!motionPreference?.matches) animationFrame.value = requestAnimationFrame(renderFrame)
}

function stopAnimation(): void {
  if (animationFrame.value !== null) cancelAnimationFrame(animationFrame.value)
  animationFrame.value = null
}

function initializeWebGL(): void {
  const container = containerRef.value
  if (!container || rendererRef.value || isUnmounted) return
  try {
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true })
    rendererRef.value = renderer
    const canvas = renderer.gl.canvas
    canvas.style.position = 'absolute'
    canvas.style.inset = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    container.replaceChildren(canvas)

    const [flipX, flipY] = originFlip(props.origin)
    const uniforms: WebGLUniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      iSpeed: { value: props.speed },
      iRayColor1: { value: rayColor1.value },
      iRayColor2: { value: rayColor2.value },
      iIntensity: { value: props.intensity },
      iSpread: { value: props.spread },
      iFlipX: { value: flipX },
      iFlipY: { value: flipY },
      iTilt: { value: props.tilt },
      iSaturation: { value: props.saturation },
      iBlend: { value: props.blend },
      iFalloff: { value: props.falloff },
      iOpacity: { value: props.opacity },
    }
    uniformsRef.value = uniforms
    const mesh = new Mesh(renderer.gl, {
      geometry: new Triangle(renderer.gl),
      program: new Program(renderer.gl, { vertex: vertexShader, fragment: fragmentShader, uniforms }),
    })
    meshRef.value = mesh
    updateSize()
    resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(container)
    renderFrame(0)
  } catch (error) {
    console.error('Failed to initialize the SideRays effect:', error)
    rendererRef.value?.gl.getExtension('WEBGL_lose_context')?.loseContext()
    rendererRef.value = null
    container.replaceChildren()
  }
}

watch(isVisible, (visible) => {
  if (!visible) {
    stopAnimation()
    return
  }
  if (!rendererRef.value) initializeWebGL()
  else if (!motionPreference?.matches) renderFrame(performance.now())
})

watch(() => [props.speed, props.intensity, props.spread, props.origin, props.tilt, props.saturation, props.blend, props.falloff, props.opacity], () => {
  const uniforms = uniformsRef.value
  if (!uniforms) return
  uniforms.iSpeed.value = props.speed
  uniforms.iIntensity.value = props.intensity
  uniforms.iSpread.value = props.spread
  ;[uniforms.iFlipX.value, uniforms.iFlipY.value] = originFlip(props.origin)
  uniforms.iTilt.value = props.tilt
  uniforms.iSaturation.value = props.saturation
  uniforms.iBlend.value = props.blend
  uniforms.iFalloff.value = props.falloff
  uniforms.iOpacity.value = props.opacity
})

watch(() => [props.rayColor1, props.rayColor2], updateThemeColors)

onMounted(() => {
  updateThemeColors()
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionPreferenceChange = () => {
    stopAnimation()
    if (isVisible.value && !motionPreference?.matches) renderFrame(performance.now())
  }
  motionPreference.addEventListener('change', motionPreferenceChange)
  themeObserver = new MutationObserver(updateThemeColors)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
  intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible.value = entry.isIntersecting
  }, { threshold: 0.1, rootMargin: '50px' })
  if (containerRef.value) intersectionObserver.observe(containerRef.value)
})

onBeforeUnmount(() => {
  isUnmounted = true
  stopAnimation()
  intersectionObserver?.disconnect()
  themeObserver?.disconnect()
  resizeObserver?.disconnect()
  if (motionPreferenceChange) motionPreference?.removeEventListener('change', motionPreferenceChange)
  rendererRef.value?.gl.getExtension('WEBGL_lose_context')?.loseContext()
  rendererRef.value = null
  uniformsRef.value = null
  meshRef.value = null
})
</script>

<template>
  <div
    ref="containerRef"
    :class="['relative h-full w-full overflow-hidden pointer-events-none', className]"
    aria-hidden="true"
  />
</template>
