/**
 * CSSUtils - CSS工具类
 * 复用Vue3.6的核心API，支持完整CSS属性和命名风格转换
 * 参考: @vue/shared
 */

// ==================== 类型检查工具 ====================
export const isArray = Array.isArray;
export const isString = (val) => typeof val === "string";
export const isNumber = (val) => typeof val === "number";
export const isObject = (val) => val !== null && typeof val === "object";
export const isPlainObject = (val) => Object.prototype.toString.call(val) === "[object Object]";

// ==================== 字符串缓存函数 ====================
const cacheStringFunction = (fn) => {
  const cache = Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};

// ==================== 命名风格转换 (来自Vue3.6) ====================

// kebab-case 转 camelCase: background-color -> backgroundColor
const camelizeRE = /-\w/g;
export const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
});

// camelCase 转 kebab-case: backgroundColor -> background-color
const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = cacheStringFunction((str) => {
  return str.replace(hyphenateRE, "-$1").toLowerCase();
});

// 首字母大写
export const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

// ==================== CSS样式解析和序列化 (来自Vue3.6) ====================

// 解析CSS字符串为对象
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;

export function parseStringStyle(cssText) {
  const ret = {};
  if (!cssText || !isString(cssText)) return ret;
  
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      if (tmp.length > 1) {
        const key = tmp[0].trim();
        const value = tmp[1].trim();
        ret[key] = value;
      }
    }
  });
  return ret;
}

// 标准化样式值（支持字符串、对象、数组）
export function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return parseStringStyle(value);
  } else if (isObject(value)) {
    return value;
  }
  return {};
}

// 将样式对象转换为CSS字符串（自动将camelCase转为kebab-case）
export function stringifyStyle(styles) {
  if (!styles) return "";
  if (isString(styles)) return styles;
  
  let ret = "";
  for (const key in styles) {
    const value = styles[key];
    if (value !== null && value !== undefined && value !== "") {
      // CSS变量(--开头)保持原样，其他转为kebab-case
      const normalizedKey = key.startsWith("--") ? key : hyphenate(key);
      ret += `${normalizedKey}:${value};`;
    }
  }
  return ret;
}

// ==================== CSS属性名标准化 ====================

/**
 * 标准化CSS属性名
 * 支持 camelCase 和 kebab-case
 * @param {string} propName - 属性名
 * @returns {string} kebab-case格式的属性名
 */
export function normalizeCSSPropName(propName) {
  if (!propName || !isString(propName)) return "";
  
  // CSS变量保持原样
  if (propName.startsWith("--")) return propName;
  
  // 已经是kebab-case
  if (propName.includes("-")) return propName;
  
  // camelCase转kebab-case
  return hyphenate(propName);
}

// ==================== 完整的CSS属性映射表 ====================

/**
 * 所有标准CSS属性列表
 * 包括：布局、定位、字体、颜色、边框、背景、动画、变换等
 */
export const CSS_PROPERTIES = {
  // 布局属性
  display: true,
  position: true,
  top: true,
  right: true,
  bottom: true,
  left: true,
  float: true,
  clear: true,
  
  // 盒模型
  width: true,
  height: true,
  minWidth: true,
  minHeight: true,
  maxWidth: true,
  maxHeight: true,
  margin: true,
  marginTop: true,
  marginRight: true,
  marginBottom: true,
  marginLeft: true,
  padding: true,
  paddingTop: true,
  paddingRight: true,
  paddingBottom: true,
  paddingLeft: true,
  boxSizing: true,
  
  // 边框
  border: true,
  borderWidth: true,
  borderStyle: true,
  borderColor: true,
  borderTop: true,
  borderTopWidth: true,
  borderTopStyle: true,
  borderTopColor: true,
  borderRight: true,
  borderRightWidth: true,
  borderRightStyle: true,
  borderRightColor: true,
  borderBottom: true,
  borderBottomWidth: true,
  borderBottomStyle: true,
  borderBottomColor: true,
  borderLeft: true,
  borderLeftWidth: true,
  borderLeftStyle: true,
  borderLeftColor: true,
  borderRadius: true,
  borderTopLeftRadius: true,
  borderTopRightRadius: true,
  borderBottomLeftRadius: true,
  borderBottomRightRadius: true,
  
  // 背景
  background: true,
  backgroundColor: true,
  backgroundImage: true,
  backgroundPosition: true,
  backgroundSize: true,
  backgroundRepeat: true,
  backgroundAttachment: true,
  backgroundClip: true,
  backgroundOrigin: true,
  
  // 字体和文本
  color: true,
  font: true,
  fontFamily: true,
  fontSize: true,
  fontWeight: true,
  fontStyle: true,
  fontVariant: true,
  lineHeight: true,
  letterSpacing: true,
  wordSpacing: true,
  textAlign: true,
  textDecoration: true,
  textDecorationLine: true,
  textDecorationColor: true,
  textDecorationStyle: true,
  textTransform: true,
  textIndent: true,
  textShadow: true,
  textOverflow: true,
  whiteSpace: true,
  wordBreak: true,
  wordWrap: true,
  overflowWrap: true,
  
  // Flexbox
  flex: true,
  flexDirection: true,
  flexWrap: true,
  flexFlow: true,
  flexGrow: true,
  flexShrink: true,
  flexBasis: true,
  justifyContent: true,
  alignItems: true,
  alignSelf: true,
  alignContent: true,
  order: true,
  gap: true,
  rowGap: true,
  columnGap: true,
  
  // Grid
  grid: true,
  gridTemplate: true,
  gridTemplateRows: true,
  gridTemplateColumns: true,
  gridTemplateAreas: true,
  gridAutoRows: true,
  gridAutoColumns: true,
  gridAutoFlow: true,
  gridRow: true,
  gridRowStart: true,
  gridRowEnd: true,
  gridColumn: true,
  gridColumnStart: true,
  gridColumnEnd: true,
  gridArea: true,
  
  // 溢出和裁剪
  overflow: true,
  overflowX: true,
  overflowY: true,
  clip: true,
  clipPath: true,
  
  // 可见性和透明度
  visibility: true,
  opacity: true,
  zIndex: true,
  
  // 变换
  transform: true,
  transformOrigin: true,
  transformStyle: true,
  perspective: true,
  perspectiveOrigin: true,
  backfaceVisibility: true,
  
  // 过渡和动画
  transition: true,
  transitionProperty: true,
  transitionDuration: true,
  transitionTimingFunction: true,
  transitionDelay: true,
  animation: true,
  animationName: true,
  animationDuration: true,
  animationTimingFunction: true,
  animationDelay: true,
  animationIterationCount: true,
  animationDirection: true,
  animationFillMode: true,
  animationPlayState: true,
  
  // 光标和交互
  cursor: true,
  pointerEvents: true,
  userSelect: true,
  
  // 滚动
  scrollBehavior: true,
  scrollSnapType: true,
  scrollSnapAlign: true,
  
  // 其他
  content: true,
  quotes: true,
  counterIncrement: true,
  counterReset: true,
  listStyle: true,
  listStyleType: true,
  listStylePosition: true,
  listStyleImage: true,
  outline: true,
  outlineWidth: true,
  outlineStyle: true,
  outlineColor: true,
  outlineOffset: true,
  boxShadow: true,
  filter: true,
  backdropFilter: true,
  mixBlendMode: true,
  isolation: true,
  objectFit: true,
  objectPosition: true,
  resize: true,
  verticalAlign: true,
  
  // CSS Grid 额外属性
  placeItems: true,
  placeContent: true,
  placeSelf: true,
  
  // 其他现代CSS属性
  aspectRatio: true,
  contain: true,
  willChange: true,
  writingMode: true,
  direction: true,
};

/**
 * 检查是否为有效的CSS属性
 * @param {string} propName - 属性名（支持camelCase或kebab-case）
 * @returns {boolean}
 */
export function isValidCSSProperty(propName) {
  if (!propName || !isString(propName)) return false;
  
  // CSS变量总是有效
  if (propName.startsWith("--")) return true;
  
  // 转换为camelCase进行检查
  const camelName = camelize(propName);
  return CSS_PROPERTIES[camelName] === true;
}

/**
 * 将Vue风格的style对象转换为标准CSS对象
 * 支持camelCase转kebab-case
 * @param {Object} vueStyleObject - Vue风格的样式对象
 * @returns {Object} 标准CSS对象
 */
export function convertVueStyleToCSS(vueStyleObject) {
  if (!vueStyleObject || !isObject(vueStyleObject)) return {};
  
  const result = {};
  for (const key in vueStyleObject) {
    const kebabKey = normalizeCSSPropName(key);
    result[kebabKey] = vueStyleObject[key];
  }
  return result;
}

/**
 * 合并多个样式对象
 * 后面的样式会覆盖前面的样式
 * @param {...Object} styles - 样式对象
 * @returns {Object} 合并后的样式对象
 */
export function mergeStyles(...styles) {
  const result = {};
  for (const style of styles) {
    if (style) {
      const normalized = normalizeStyle(style);
      Object.assign(result, normalized);
    }
  }
  return result;
}

// ==================== CSS值类型检测和解析 ====================

/**
 * 解析CSS尺寸值
 * @param {*} value - 值
 * @returns {Object} { value: number, unit: string, type: string }
 */
export function parseDimensionValue(value) {
  if (isNumber(value)) {
    return { value, unit: 'px', type: 'pixel' };
  }
  
  if (!isString(value)) {
    return { value: 0, unit: '', type: 'none' };
  }
  
  // 百分比
  if (value.endsWith('%')) {
    return {
      value: parseFloat(value),
      unit: '%',
      type: 'percentage'
    };
  }
  
  // 像素
  if (value.endsWith('px')) {
    return {
      value: parseFloat(value),
      unit: 'px',
      type: 'pixel'
    };
  }
  
  // 其他单位：em, rem, vh, vw, vmin, vmax等
  const unitMatch = value.match(/^([-\d.]+)([a-z%]+)$/i);
  if (unitMatch) {
    return {
      value: parseFloat(unitMatch[1]),
      unit: unitMatch[2],
      type: 'length'
    };
  }
  
  // 纯数字字符串
  const numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    return {
      value: numValue,
      unit: '',
      type: 'number'
    };
  }
  
  // 其他（如auto, inherit等）
  return {
    value: value,
    unit: '',
    type: 'string'
  };
}

/**
 * 检测颜色值
 * @param {*} value
 * @returns {boolean}
 */
export function isColorValue(value) {
  if (!isString(value)) return false;
  
  return (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('hsl') ||
    value === 'transparent' ||
    value === 'currentColor' ||
    /^[a-z]+$/i.test(value) // 颜色名称
  );
}

/**
 * 常见颜色名称映射
 */
export const COLOR_NAMES = {
  transparent: 'transparent',
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  green: '#008000',
  blue: '#0000ff',
  yellow: '#ffff00',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  gray: '#808080',
  grey: '#808080',
  silver: '#c0c0c0',
  maroon: '#800000',
  olive: '#808000',
  lime: '#00ff00',
  aqua: '#00ffff',
  teal: '#008080',
  navy: '#000080',
  fuchsia: '#ff00ff',
  purple: '#800080',
  orange: '#ffa500',
  pink: '#ffc0cb',
};

/**
 * 标准化颜色值
 * @param {*} value
 * @returns {string}
 */
export function normalizeColorValue(value) {
  if (!value) return 'transparent';
  if (!isString(value)) return String(value);
  
  const lowerValue = value.toLowerCase();
  return COLOR_NAMES[lowerValue] || value;
}

export default {
  // 命名转换
  camelize,
  hyphenate,
  capitalize,
  normalizeCSSPropName,
  
  // 样式处理
  parseStringStyle,
  normalizeStyle,
  stringifyStyle,
  convertVueStyleToCSS,
  mergeStyles,
  
  // 类型检查
  isValidCSSProperty,
  isColorValue,
  
  // 值解析
  parseDimensionValue,
  normalizeColorValue,
  
  // 工具函数
  isArray,
  isString,
  isNumber,
  isObject,
  isPlainObject,
};
