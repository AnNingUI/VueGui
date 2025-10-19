// import { CanvasWindow } from "../../src/IWindow.ts";
// const canvas = document.getElementById('window') as HTMLCanvasElement | null;
// const ctx = canvas?.getContext('2d');

// // 国旗绘制流程：
// // 1. 国旗宽高为3:2，背景为红色, 绘制600x400的红色矩形即可。
// // 2. 实现绘制五角星函数， 支持旋转。
// // 3. 根据五角星数据， 计算旋转角度， 依次绘制五角星即可。

// // 绘制单个五角星
// // 内角点与外角点共10个， 相邻点间角度为 2 * Math.PI / 10
// // 起始点为正上方点, 程序默认角度从X轴正向顺时针转动， 所以角度相差90度(Math.PI / 2)
// // 依次计算10个顶点， 填充路径即可
// function drawStar(cx, cy, radius, rotation, color) {
//     ctx.save();
//     ctx.translate(cx, cy);
//     ctx.rotate(rotation);
//     ctx.fillStyle = color;
//     ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
//     ctx.shadowBlur = 5;
//     ctx.beginPath();

//     // 起始点为正上方点
//     // 每次循环计算外点的角度： 外角点与起始点间角度减90度得标准角度
//     for (let i = 0; i < 5; i++) {
//         const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;  // 默认从X轴顺时针转动， -Math.PI / 2 则从Y轴开始
//         const x = radius * Math.cos(angle);
//         const y = radius * Math.sin(angle);

//         if (i === 0) {
//             ctx.moveTo(x, y);
//         } else {
//             ctx.lineTo(x, y);
//         }

//         // 内角点与外角点相差 2 * Math.PI / 10 总共10个点
//         const innerAngle = angle + Math.PI / 5;  // 外角点加相邻角度得下个内角点角度
//         const innerX = (radius * 0.38) * Math.cos(innerAngle);
//         const innerY = (radius * 0.38) * Math.sin(innerAngle);
//         ctx.lineTo(innerX, innerY);
//     }

//     ctx.closePath();
//     ctx.fill();
//     ctx.restore();
// }

// // 计算角ABC的角度， 用来获取小五角星的旋转角度
// // 计算向量 BA 和 BC
// // BA = A - B
// // BC = C - B
// // 计算点积
// // dotProduct = BA·BC
// // 计算向量长度
// // |BA| = √(BA.x² + BA.y²)
// // |BC| = √(BC.x² + BC.y²)
// // 计算角度
// // cosθ = (BA·BC) / (|BA| × |BC|)
// // θ = acos(cosθ)
// function calculateAngle(ax, ay, bx, by, cx, cy) {
//     const ba_x = ax - bx;
//     const ba_y = ay - by;
//     const bc_x = cx - bx;
//     const bc_y = cy - by;
//     const dotProduct = (ba_x * bc_x) + (ba_y * bc_y);
//     const magnitudeBA = Math.sqrt(ba_x * ba_x + ba_y * ba_y);
//     const magnitudeBC = Math.sqrt(bc_x * bc_x + bc_y * bc_y);
//     const cosAngle = dotProduct / (magnitudeBA * magnitudeBC);
//     const deg = Math.acos(cosAngle);
//     return deg;
// }

// // 绘制国旗
// function DrawNationalFlag(ctx) {
//     // 绘制国旗宽高
//     const width = 600;
//     const height = 400;

//     // 左上角 宽15高10
//     const half_width = width / 2;
//     const half_height = height / 2;

//     // 绘制红色背景
//     ctx.fillStyle = 'red';
//     ctx.fillRect(0, 0, width, height);

//     // 绘制大五角星
//     let big_star_x = half_width * 5 / 15; // 左5右10
//     let big_star_y = half_height * 5 / 10; // 上5下5
//     let big_star_radius = half_height * 3 / 10; // 半径为3

//     // 绘制大五角星
//     drawStar(big_star_x, big_star_y, big_star_radius, 0, 'yellow');

//     // 绘制小五角星 （10，2）
//     let small_star_1_x = half_width * 10 / 15;
//     let small_star_1_y = half_height * 2 / 10;
//     let small_star_1_radius = half_height * 1 / 10;

//     // 大五角星第四个外角点， 大五角星中心点， 小五角星中心点形成角的补角为小五角星旋转角
//     let big_star_4_x = big_star_x + big_star_radius * Math.cos(2 * Math.PI * 3 / 5 - Math.PI / 2);
//     let big_star_4_y = big_star_y + big_star_radius * Math.sin(2 * Math.PI * 3 / 5 - Math.PI / 2);
//     let rotate_deg = - calculateAngle(small_star_1_x, small_star_1_y, big_star_x, big_star_y, big_star_4_x, big_star_4_y) + Math.PI;
//     drawStar(small_star_1_x, small_star_1_y, small_star_1_radius, rotate_deg, 'yellow');

//     // 绘制小五角星 （12，4）
//     let small_star_2_x = half_width * 12 / 15;
//     let small_star_2_y = half_height * 4 / 10;
//     let small_star_2_radius = half_height * 1 / 10;

//     // 旋转角度同上
//     let big_star_5_x = big_star_x + big_star_radius * Math.cos(2 * Math.PI * 4 / 5 - Math.PI / 2);
//     let big_star_5_y = big_star_y + big_star_radius * Math.sin(2 * Math.PI * 4 / 5 - Math.PI / 2);
//     rotate_deg = calculateAngle(small_star_2_x, small_star_2_y, big_star_x, big_star_y, big_star_5_x, big_star_5_y) - Math.PI;
//     drawStar(small_star_2_x, small_star_2_y, small_star_2_radius, rotate_deg, 'yellow');

//     // 绘制小五角星 （12，7）
//     let small_star_3_x = half_width * 12 / 15;
//     let small_star_3_y = half_height * 7 / 10;
//     let small_star_3_radius = half_height * 1 / 10;
//     // 旋转角度同上
//     rotate_deg = calculateAngle(small_star_3_x, small_star_3_y, big_star_x, big_star_y, big_star_5_x, big_star_5_y) - Math.PI;
//     drawStar(small_star_3_x, small_star_3_y, small_star_3_radius, rotate_deg, 'yellow');

//     // 绘制小五角星 （10，9）
//     let small_star_4_x = half_width * 10 / 15;
//     let small_star_4_y = half_height * 9 / 10;
//     let small_star_4_radius = half_height * 1 / 10;
//     // 旋转角度同上
//     rotate_deg = - calculateAngle(small_star_4_x, small_star_4_y, big_star_x, big_star_y, big_star_5_x, big_star_5_y) + Math.PI;
//     drawStar(small_star_4_x, small_star_4_y, small_star_4_radius, rotate_deg, 'yellow');
// }

// DrawNationalFlag(ctx);

// // const canvas_window = new CanvasWindow(canvas);
// // canvas_window.GetWindowPainter().Test();
