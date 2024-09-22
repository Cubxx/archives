// (function () {
'use strict';
// import * as Mod from './Game-Lib/CommonModule.js';
{
    //mobile 横屏适配
    var ctrl = document.getElementById('ctrl');
    var ctrl_div = ctrl.getElementsByTagName('div'),
        ctrl_div = Array.prototype.slice.call(ctrl_div);
    var check = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                a,
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4),
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    let rotate = function () {
        let width = window.visualViewport.width,
            height = window.visualViewport.height,
            body = document.body,
            style = '';
        if (width >= height) {
            // 横屏
            style += 'width:' + width + 'px;';
            style += 'height:' + height + 'px;';
            style += '-webkit-transform: rotate(0); transform: rotate(0);';
            style += '-webkit-transform-origin: 0 0;';
            style += 'transform-origin: 0 0;';
        } else {
            // 竖屏
            style += 'width:' + height + 'px;';
            style += 'height:' + width + 'px;';
            style += '-webkit-transform: rotate(90deg); transform: rotate(90deg);';
            style += '-webkit-transform-origin: ' + width / 2 + 'px ' + width / 2 + 'px;';
            style += 'transform-origin: ' + width / 2 + 'px ' + width / 2 + 'px;';
            check = true;
            ctrl_div.forEach((div, i) => {
                let _w = window.getComputedStyle(div)['width'],
                    _h = window.getComputedStyle(div)['height'];
                if (width < height) {
                    (div.style.width = '10vh'), (div.style.height = '6vw');
                    if (i > 4) (div.style.width = '6vw'), (div.style.height = '10vh');
                }
            });
        }
        body.style.cssText = style;
        if (check) ctrl.style.display = 'flex';
    };
    rotate();
    let _full = document.body.requestFullscreen || (() => {});
    document.body.requestFullscreen = function () {
        _full.call(document.body);
        screen.orientation.lock('natural');
    };
}
{
    var pause_panel = document.getElementById('pause');
    var scale_c = 4;
    var canvas = document.getElementsByTagName('canvas')[0],
        ctx = canvas.getContext('2d');
    canvas.width = document.body.clientWidth * scale_c;
    canvas.height = document.body.clientHeight * scale_c;
    var profile = document.getElementsByTagName('canvas')[1],
        ptx = profile.getContext('2d');
    profile.width = document.body.clientWidth;
    profile.height = document.body.clientHeight;
    ptx.scale(1 / scale_c, 1 / scale_c);
    var view = document.getElementsByTagName('canvas')[2],
        vtx = view.getContext('2d');
    view.width = profile.width;
    view.height = profile.height;
    console.log('绘制区域 ', canvas.width, canvas.height);
    console.log('视图区域 ', view.width, view.height);
}
const pi = Math.PI,
    sin = Math.sin,
    cos = Math.cos,
    rand = Math.random,
    max_abs = (a, b) => {
        Math.max(Math.abs(a), Math.abs(b));
    };

class Cell {
    constructor(pos = [0, 0], size = [10, 10], spd = [0, 0, 0, 0], color = '#000') {
        this.left = pos[0];
        this.top = pos[1];
        this.width = size[0];
        this.height = size[1];
        this.spd = spd;
        this.color = color;
        this.isskip = true;
        this.skip_num = 0;
    }
    pathStyle(lineWidth = 5, lineCap = 'butt') {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = lineCap; //末端样式
    }
    textStyle(size = 10, family = '微软雅黑', textAlign = 'center') {
        ctx.fillStyle = this.color;
        ctx.font = size + 'px ' + family;
        ctx.textAlign = textAlign;
    }
    rect() {
        ctx.fillRect(this.left, this.top, this.width, this.height);
    }
    arc(r, angle = [0, 2 * pi], anticlosewise) {
        var c0 = cos(angle[0]),
            c1 = cos(angle[1]),
            s0 = sin(angle[0]),
            s1 = sin(angle[1]);
        this.width = c0 * c1 >= 0 ? r * max_abs(c0, c1) : r * abs(c0 - c1);
        this.height = s0 * s1 >= 0 ? r * max_abs(s0, s1) : r * abs(s0 - s1);
        ctx.arc(this.left, this.top, r, angle[0], angle[1], anticlosewise);
        ctx.fill();
    }
    path(point_begin, point_end) {
        this.width = abs(point_begin[0] - point_end[0]) + ctx.lineWidth * 2;
        this.height = abs(point_begin[1] - point_end[1]) + ctx.lineWidth * 2;
        ctx.beginPath();
        ctx.moveTo(point_begin[0], point_begin[1]);
        ctx.lineTo(point_end[0], point_end[1]);
        ctx.stroke(); //描边
    }
    shape(points) {
        var max_l = 0,
            min_l = 0,
            max_t = 0,
            min_t = 0;
        ctx.beginPath();
        for (let i of points) {
            if (i[0] > max_l) max_l = i[0];
            if (i[0] < min_l) min_l = i[0];
            if (i[1] > max_t) max_t = i[1];
            if (i[1] < min_t) min_t = i[1];
            if (i.toString() === points[0].toString()) ctx.moveTo(i[0], i[1]);
            else ctx.lineTo(i[0], i[1]);
        }
        this.width = max_l - min_l;
        this.height = max_t - min_t;
        ctx.closePath(); //闭合路径, ctx指向context
        ctx.fill(); //填充
    }
    text(str, maxWidth) {
        ctx.fillText(str, this.left, this.top, maxWidth);
    }
    img(img, scale) {
        this.width = img.width * scale;
        this.height = img.height * scale;
        img.onload = function () {
            ctx.drawImage(img, this.left, this.top, this.width, this.height);
        };
    }
    move() {
        this.left += this.spd[0];
        this.top += this.spd[1];
    }
    crash(wall) {
        let obj = this;
        Obj_Crash(obj, wall, [
            function () {
                obj.spd[0] = 0;
                obj.left = wall.left + wall.width;
            },
            function () {
                obj.spd[1] = 0;
                obj.top = wall.top + wall.height;
                obj.isskip = false;
            },
            function () {
                obj.spd[0] = 0;
                obj.left = wall.left - obj.width;
            },
            function () {
                obj.spd[1] = 0;
                obj.top = wall.top - obj.height;
                obj.isskip = true;
            },
        ]);
    }
    draw(rang_args, ctrl_args) {
        this.pathStyle();
        this.rect();
        Move_Range(this, ...rang_args);
        Move_Ctrl(this, ...ctrl_args);
        this.spd[1] += grivity;
        this.move();
    }
}
{
    //构建场景
    const size = [40 * scale_c, 40 * scale_c],
        space = [30 * scale_c, 30 * scale_c];
    var offset = [10 * scale_c, 10 * scale_c];
    var angle = 1,
        cells = [],
        poss = [];
    Array.prototype.in = function (elm) {
        for (let i of this) if (Math.abs(i[0] - elm[0]) < 2) return true;
    };
    var construct_cell = function (pos) {
        let c = angle;
        for (let i = c; i < 2 * pi + c; i += (2 * pi) / 4) {
            var x = Math.round(pos[0] - cos(i) * (size[0] + space[0])),
                y = Math.round(pos[1] + sin(i) * (size[1] + space[1]));
            if (
                !poss.in([x, y]) &&
                between_matrix([x, y], [-size[0], -size[1], canvas.width, canvas.height])
            ) {
                poss.push([x, y]);
                if (poss.length > 1000) throw 'cells exceed';
                let cell = new Cell(
                    [x, y],
                    [size[0] * (rand() + 0.3) + 10 * scale_c, size[1] * (rand() + 0.1)],
                    undefined,
                    '#000',
                );
                // cell.pathStyle();
                // cell.rect();
                cells.push(cell);
                construct_cell([x, y]);
            }
        }
    };
    construct_cell([canvas.width / 2 + offset[0], canvas.height / 2 + offset[1]]);
    /*var construct = function (pos) {
        pos;
        var x = Math.round(rand() * (canvas.width - size[0])),
            y = Math.round(rand() * (canvas.height - size[1]));
        if (poss.length < 50) {
            poss.push([x, y]); if (poss.length > 1000) throw 'cells exceed';
            let cell = new Cell([x, y], size, undefined, '#0003');
            cell.rect();
            cells.push(cell);
            construct([x, y]);
        }
    }//*/
    console.log('cell数量 ', poss.length);
}
var player_init_pos = [poss[0][0], poss[0][1] - 20 * scale_c];
var player = new Cell(player_init_pos, [10 * scale_c, 10 * scale_c], undefined, '#f88');
var exit = new Cell(
    [Math.round(rand() * (canvas.width - 10)), 0],
    [10 * scale_c, 10 * scale_c],
    undefined,
    '#090',
);
init();
{
    //添加boss
    var bosses = [],
        boss_num = Math.round(5e-5 * view.width * view.height);
    const size = [10 * scale_c, 10 * scale_c];
    var construct_boss = function () {
        if (bosses.length < boss_num) {
            let ward;
            let boss = new Cell(
                rand() > 0.5
                    ? ((ward = 1),
                      rand() > 0.5
                          ? [Math.round(rand() * (canvas.width - size[0])), 0]
                          : [size[0] * 2, Math.round(rand() * (canvas.height - size[1]))])
                    : ((ward = -1),
                      rand() > 0.5
                          ? [Math.round(rand() * (canvas.width - size[0])), 0]
                          : [
                                canvas.width - size[0] * 2,
                                Math.round(rand() * (canvas.height - size[1])),
                            ]),
                size,
                undefined,
                '#fa0',
            );
            boss.ward = ward;
            bosses.push(boss);
        }
    };
    console.log('boss数量 ', boss_num);
}
{
    //主程序
    var dl = 0,
        dt = 0,
        dr = 0,
        dd = 0;
    var grivity = 0.1 * scale_c;
    let expend = 0,
        scale_v =
            (1 / window.devicePixelRatio) *
            (vtx.backingStorePixelRatio || vtx.webkitBackingStorePixelRatio || 1); //视角缩放
    var draw = function () {
        // try {
        n++;
        if (n >= 1 * 60 * 60) boss_num = 400;

        vtx.clearRect(0, 0, canvas.width, canvas.height);
        vtx.setTransform(
            scale_v,
            0,
            0,
            scale_v,
            canvas.width / 2 / scale_c - (player.left + player.width / 2) * scale_v,
            canvas.height / 2 / scale_c - (player.top + player.height / 2) * scale_v,
        );
        vtx.drawImage(canvas, 0, 0);
        ptx.clearRect(0, 0, canvas.width, canvas.height);
        ptx.drawImage(canvas, 0, 0);
        ctx.clearRect(-expend, -expend, canvas.width + 2 * expend, canvas.height + 2 * expend);

        // if (n % 300 == 0) angle += pi / 180 * 10;
        // poss = [], cells = [];
        // construct_cell([canvas.width / 2 + offset[0], canvas.height / 2 + offset[1]]);
        ctx.save();
        ctx.globalAlpha = 0.2;
        cells.forEach((cell) => {
            //cell碰撞检测
            cell.pathStyle();
            cell.rect();
            player.crash(cell);
            exit.crash(cell);
            bosses.forEach((boss) => boss.crash(cell));
        });
        ctx.restore();

        let boss_sur = [],
            boss_sur_str = [];
        construct_boss();
        bosses.forEach((boss) => {
            //boss碰撞检测
            Obj_Crash(player, boss, [dead]);
            exit.crash(boss);
            boss.draw(
                [
                    [0, -100, canvas.width, canvas.height],
                    undefined,
                    function () {
                        if (!boss_sur_str.in(JSON.stringify(boss))) {
                            boss_sur_str.push(JSON.stringify(boss));
                            boss_sur.push(boss);
                        }
                    },
                ],
                [scale_c, [0, 1, boss.ward, 0], 'grivity'],
            );
        });
        bosses = boss_sur;

        Obj_Crash(player, exit, [nice]);
        exit.draw(
            [
                [0, 0, canvas.width, canvas.height],
                [
                    function () {
                        exit.spd[0] = 0;
                        exit.left = 0;
                    },
                    function () {
                        exit.spd[1] = 0;
                        exit.top = 0;
                        exit.isskip = false;
                    },
                    function () {
                        exit.spd[0] = 0;
                        exit.left = canvas.width - exit.width;
                    },
                    function () {
                        exit.spd[1] = 0;
                        exit.top = canvas.height - exit.height;
                        exit.isskip = true;
                    },
                ],
            ],
            [scale_c, [0, 0, 0, 0], 'grivity'],
        );

        player.draw(
            [
                [0, 0, canvas.width, canvas.height],
                [
                    function () {
                        player.spd[0] = 0;
                        player.left = 0;
                    },
                    function () {
                        player.spd[1] = 0;
                        player.top = 0;
                        player.isskip = false;
                    },
                    function () {
                        player.spd[0] = 0;
                        player.left = canvas.width - player.width;
                    },
                    function () {
                        player.spd[1] = 0;
                        player.top = canvas.height - player.height;
                        player.isskip = true;
                        dead();
                    },
                ],
            ],
            [scale_c, [dl, dt, dr, 0], 'grivity'],
        );

        if (ispause) clearInterval(Stop);
        // } catch (error) { clearInterval(Stop); throw error; }
    };
    var n = 0,
        ispause = false;
    var Stop = setInterval(draw, 1000 / 60);
    pause();
}

//功能组
function init() {
    if (ispause || ispause === undefined)
        (player.left = player_init_pos[0]),
            (player.top = player_init_pos[1]),
            (player.lives = 1),
            (bosses = []),
            (pause_panel.innerText =
                '\
            Esc - 主界面\n\
            Again - 新游戏\n\
            R - 重开\n\
            Space - 暂停\n'),
            (n = 0),
            pause();
}
function pause() {
    ispause = !ispause;
    if (player.lives == 0) ispause = true;
    if (ispause) {
        pause_panel.style.display = 'flex';
        profile.style.display = 'block';
        ctrl.style.filter = 'opacity(0.3)';
    } else {
        pause_panel.style.display = 'none';
        profile.style.display = 'none';
        ctrl.style.filter = 'opacity(1)';
        Stop = setInterval(draw, 1000 / 60);
        // if (check) document.body.requestFullscreen();
    }
}
function nice() {
    pause();
    pause = () => {};
    let str = 'nice\n';
    if (boss_num < 100) {
        if (player.deads > 1) str += '花了点时间\n死亡次数: ' + player.deads;
        else if (player.deads == 1) str += 'w失误了一次\n死亡次数: ' + player.deads;
        else str += '一次性通关\n太雄了';
    } else str += '卧槽, 这也能过关?';
    pause_panel.innerText = str;
}
function dead() {
    pause();
    pause_panel.innerText = 'dead\n再来一次吧';
    player.lives = 0;
    player.deads = player.deads === undefined ? 1 : player.deads + 1;
}
function esc() {
    // if (check) document.exitFullscreen();
}
// dead = () => { };
var dbg = {
    //计算代码块运行时间
    t: 0,
    b: () => {
        this.t = new Date().getTime();
    },
    e: () => {
        if (new Date().getTime() - t > 1) console.log(new Date().getTime() - t);
        if (new Date().getTime() - t > 2000) pause();
    },
    check: function (func) {
        this.b(), func(), this.e();
    },
};

{
    //事件
    document.onkeydown = function (e) {
        // console.log(e)
        switch (e.keyCode) {
            case 37:
                dl = 1;
                break;
            case 39:
                dr = 1;
                break;
            case 38:
                dt = 1;
                break;
            case 40:
                dd = 1;
                break;
            // case 16: spd = 2; break; //shift
            // case 90: isfire = true; break; //z
            // case 88: isbomb = true; break; //x
            case 32:
                pause();
                break; //space
            case 65:
                dl = 1;
                break; //a
            case 68:
                dr = 1;
                break; //d
            case 87:
                dt = 1;
                break; //w
            case 83:
                dd = 1;
                break; //s
            case 82:
                break; //r
            case 27:
                esc();
                break; //Esc
        }
    };
    document.onkeyup = function (e) {
        switch (e.keyCode) {
            case 37:
                dl = 0;
                break;
            case 39:
                dr = 0;
                break;
            case 38:
                dt = 0;
                break;
            case 40:
                dd = 0;
                break;
            // case 16: spd = 4.5; break;
            // case 90: isfire = false; break;
            // case 88: isbomb = false; break;
            case 32:
                break;
            case 65:
                dl = 0;
                break;
            case 68:
                dr = 0;
                break;
            case 87:
                dt = 0;
                break;
            case 83:
                dd = 0;
                break;
            case 82:
                init();
                break;
        }
    };
    document.oncontextmenu = function () {
        return false;
    };
}
// })();
