import { parse, compileTemplate, compileScript, compileStyle } from '../lib/compiler-sfc.esm-browser.js';

const vue_path = new URL("../lib/vue.esm-browser.js", import.meta.url).href;

// 字符串哈希
function djb2Hash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        // 更好的混合：加入位旋转和额外乘法
        hash = (hash << 5) + hash + char; // hash * 33 + char
        hash = Math.imul(hash, 0x9e3779b9); // 黄金比例乘数
        hash ^= hash >>> 16; // 增加扩散
    }
    return hash >>> 0; // 确保无符号32位整数
}

async function GetFileText(filepath) {
    try {
        const response = await fetch(filepath);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        console.log('File text:', text);
        return text;
    } catch (error) {
        console.error('Error fetching file:', error);
    }
}

async function ExecuteModuleCode(code) {
    const blob = new Blob([code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    try {
        const module = await import(url);
        return module;
    } finally {
        URL.revokeObjectURL(url);
    }
}

async function CompileVueSFC(filepath, source) {
    const fileid = String(djb2Hash(filepath));

    // 1. 读取 SFC 文件内容
    if (!source) {
        source = await GetFileText(filepath);
        if (!source) {
            console.error('Failed to read file:', filepath);
            return false;
        }
    }

    // 2. 解析 SFC 字符串
    const { descriptor, errors } = parse(source, { filename: filepath });
    if (errors && errors.length) {
        console.error('Parse errors:', errors);
        if (callback) {
            callback(false);
        }
        return false;
    }

    // 3. 编译脚本
    const inlineTemplate = !!descriptor.scriptSetup && !descriptor.template?.src;
    if (!descriptor.scriptSetup && !descriptor.script) {
        console.warn('No script or script setup found in SFC.');
        source = source + `
<script>
    export default {}
</script>        
        `;
        return await CompileVueSFC(filepath, source);
    }
    const scriptResult = compileScript(descriptor, {
        id: fileid,
        genDefaultAs: "sfc_main",
        isProd: true,
        inlineTemplate: inlineTemplate,
    });
    if (scriptResult.errors && scriptResult.errors.length) {
        console.error('Script errors:', scriptResult.errors);
        return false;
    }
    const script_code = scriptResult.content;

    // 4. 编译模板
    const hasScoped = descriptor.styles.some((s) => s.scoped);
    const templateResult = compileTemplate({
        source: descriptor.template.content,
        filename: filepath,
        id: fileid, // 使用文件路径作为唯一 ID
        scoped: hasScoped,
        slotted: descriptor.slotted,
        ssrCssVars: descriptor.cssVars,
        isProd: true,
        compilerOptions: {
            // mode: 'module',
            scopeId: hasScoped ? `data-v-${fileid}` : undefined,
            bindingMetadata: scriptResult.bindings,
            isCustomElement: (tag) => {
                return tag.startsWith('cpp-') || (tag.length > 3 && tag.startsWith('Cpp') && tag.charCodeAt(3) >= 65 && tag.charCodeAt(3) <= 90);
            }
        }
    });
    if (templateResult.errors && templateResult.errors.length) {
        console.error('Template errors:', templateResult.errors);
        return false;
    }
    const template_code = templateResult.code.replace(/\nexport (function|const) (render|ssrRender)/, "\n$1 sfc_$2");

    // 5. 编译样式（如果存在）
    const styleResults = [];
    for (const style of descriptor.styles) {
        const styleResult = compileStyle({
            source: style.content,
            filename: filepath,
            id: fileid,
            scoped: style.scoped
        });
        if (styleResult.errors && styleResult.errors.length) {
            console.error('Style errors:', styleResult.errors);
            return false;
        }
        styleResults.push(styleResult);
    }
    // const style_code = "sfc_main.styles = `[" + styleResults.map(result => result.code).join('\n') + "]`;";
    // const style_code = "document.AppendStyleSheet(`" + styleResults.map(result => result.code).join('\n') + "`);";
    const css_code = styleResults.map(result => result.code).join('\n');
    const style_code = "root.AppendStyleSheet(`" + css_code + "`);";

    // 6. 合并编译结果为一个 JavaScript 文件内容
    let component_code = `
// 脚本部分
${script_code}

// 模板部分
${inlineTemplate ? "" : (template_code + "\nsfc_main.render = sfc_render;")}

sfc_main.__scopeId = '${"data-v-" + fileid}';

// 样式不分
${styleResults.length > 0 ? style_code : ""}

// 默认导出
export default sfc_main;`;
    component_code = component_code.replace(/from "vue"/, `from "${vue_path}"`);
    console.log(component_code);
    return (await ExecuteModuleCode(component_code)).default;
}

export default CompileVueSFC;