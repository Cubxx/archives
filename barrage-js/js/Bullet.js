//move = [['func_name', args], 'situation', situation_num], obj_prop = [lives, 'color', [size]]
function Bullet(pos_initial, v_initial, type, move, obj_prop) {
    this.element = document.createElement('div');
    this.super_elm;
    this.type = type;
    this.lives = obj_prop[0];
    this.color = obj_prop[1];
    this.size = obj_prop[2];
    this.int_lives = this.lives;
    this.move_type = move[0];
    this.situation = move[1];
    this.situation_num = move[2];
    this.move_num = 0;
    var this_obj = this,
        elm = this.element, //引用传递
        [...dxy] = v_initial; //数组拷贝

    check_err([
        pos_initial,
        v_initial,
        this.type,
        this.lives,
        this.color,
        this.size,
        this.situation,
        this.situation_num,
    ]); //检查变量
    this.move = function () {
        this.move_func(this_obj, elm, pos_initial, v_initial, dxy);
    }; //实参为引用类型数据，可通过形参改变实参
}

Bullet.prototype = new Maker();
Bullet.prototype.fire = function () {};
Bullet.prototype.hit = function () {
    this.element.style.opacity = this.lives / this.int_lives;
};
Bullet.prototype.dead = function () {};
Bullet.prototype.move_func = function (this_obj, elm, pos_initial, v_initial, dxy) {
    if (this.type.includes('res') && position(player.element)[1] < 150) {
        this.move_type = ['absorb', 500];
    } //回收线
    //运动函数
    var libs_func,
        move_num = this.move_num;
    if (this.move_type && this.move_type != false) {
        switch (this.move_type[0]) {
            case 'absorb':
                libs_func = function (r) {
                    //res专用
                    var angle = degree(player.element, elm),
                        dis = distance(player.element, elm);
                    if (dis < r) {
                        dxy[0] = 7 * Math.cos(angle);
                        dxy[1] = 7 * Math.sin(angle);
                    }
                };
                break;
            case 'fire':
                libs_func = function (b = false) {
                    //player_bullet专用
                    boss_list = update(
                        boss_list,
                        (i) => {
                            var angle = degree(i.element, elm),
                                dis = distance(i.element, elm),
                                a = 30000 / dis ** 2; //合加速度
                            if (b) {
                                if (dis < 60) {
                                    dxy[0] = 10 * Math.cos(angle);
                                    dxy[1] = 10 * Math.sin(angle);
                                } else {
                                    dxy[0] += a * Math.cos(angle);
                                    dxy[1] += a * Math.sin(angle);
                                }
                            }
                        },
                        (i) => {
                            i.crash(this_obj);
                        },
                    );
                };
                break;
            case 'accelerate':
                libs_func = function (ax, ay) {
                    dxy[0] += ax;
                    dxy[1] += ay;
                };
                break;
            case 'shake':
                libs_func = function (a) {
                    a = a || 0;
                    a = Math.random() > 0.5 ? a : -a;
                    dxy[0] = a * Math.cos(Math.random() * Math.PI * 2);
                    dxy[1] = a * Math.sin(Math.random() * Math.PI * 2);
                };
                break;
            case 'circle':
                libs_func = function (r, orient, p) {
                    //半径 旋转方向:1顺时针 位移
                    p = p || [0, 0];
                    var v_int = Math.sqrt(v_initial[1] ** 2 + v_initial[0] ** 2),
                        phase = Math.atan2(v_initial[1], v_initial[0]);
                    move_num += orient ? v_int / r : -v_int / r;
                    dxy[0] = v_int * Math.cos(move_num + phase) + p[0];
                    dxy[1] = v_int * Math.sin(move_num + phase) + p[1];
                };
                break;
            case 'gravity':
                libs_func = function (g, v_end) {
                    var v_int = Math.sqrt(v_initial[1] ** 2 + v_initial[0] ** 2),
                        s = 530 - pos_initial[1],
                        g = g || 0.01;
                    if (v_end) {
                        g = (v_end ** 2 - v_int ** 2) / 2 / s;
                    }
                    dxy[1] += g;
                };
                break;
            case 'track':
                libs_func = function (a) {
                    var v_int = Math.sqrt(v_initial[1] ** 2 + v_initial[0] ** 2),
                        // dis = distance(player.element, elm),
                        angle = degree(player.element, elm);
                    dxy[0] += (v_int * Math.cos(angle)) / a;
                    dxy[1] += (v_int * Math.sin(angle)) / a;
                };
                break;
            case 'toward':
                libs_func = function (p_end, deg, v_end_value, t, func = () => {}) {
                    p_end = p_end || [265, 265];
                    var vx = v_initial[0],
                        vy = v_initial[1], //初速度
                        sx = p_end[0] - pos_initial[0],
                        sy = p_end[1] - pos_initial[1]; //末位置
                    if (deg || deg === 0) {
                        /*通过初速度 [vx,vy]、末位移 [sx,sy]、末速度角度 deg 
                        求所需加速度 [ax,ay]、时间 t*/
                        var tan = Math.tan((deg / 180) * Math.PI),
                            v1x = (sy * vx - sx * vy) / (sx * tan - sy),
                            v1y = v1x * tan;
                        t = (2 * sx) / (vx + v1x) || (2 * sy) / (vy + v1y);
                        var ax = (v1x - vx) / t,
                            ay = (v1y - vy) / t;
                        // move_num++;
                    } else if (v_end_value || v_end_value === 0) {
                        /*通过初速度 [vx,vy]、末位移 [sx,sy]、末速率 v_end_value
                        求所需加速度 [ax,ay]、时间 t*/
                        var a = sy ** 2 + sx ** 2,
                            b = 2 * sx * sy * (vx - vy),
                            c =
                                (sy * vx) ** 2 +
                                (sx * vy) ** 2 -
                                (sx * v_end_value) ** 2 -
                                2 * vx * vy * sx * sy;
                        if (b ** 2 >= 4 * a * c) {
                            var v1x = (-b + (b ** 2 - 4 * a * c) ** 0.5) / 2 / a,
                                v1y;
                            if (v_end_value >= Math.abs(v1x)) {
                                v1y = (v_end_value ** 2 - v1x ** 2) ** 0.5;
                            } else {
                                throw '运动函数错误 v1x > v_end_value\n' + v1x + '\n' + v_end_value;
                            }
                            t = (2 * sx) / (vx + v1x) || (2 * sy) / (vy + v1y);
                            var ax = (v1x - vx) / t,
                                ay = (v1y - vy) / t;
                        } else {
                            throw '运动函数错误 v1x无解';
                        }
                    } else if (t) {
                        var ax = (2 * (sx - vx * t)) / t ** 2,
                            ay = (2 * (sy - vy * t)) / t ** 2;
                    }
                    if (t < 0)
                        throw (
                            '运动函数错误 时间值t不属于(0, +∞)区间 ' +
                            t +
                            '\n参见 "../toward运动函数.xlsm"'
                        );
                    else if (move_num < Math.floor(t)) {
                        dxy[0] += ax;
                        dxy[1] += ay;
                        move_num++;
                    } else {
                        v_initial[0] = dxy[0];
                        v_initial[1] = dxy[1];
                        move_num = 0;
                        func();
                    }
                };
                break;
            default:
                throw 'libs未包含 ' + this.move_type[0];
        }
    }
    // debugger; //加密
    if (libs_func) {
        libs_func(...this.move_type.slice(1));
    } //执行运动函数
    this.move_num = move_num;
    //环境类型
    var elm_sl = parseFloat(this.element.style.left),
        elm_st = parseFloat(this.element.style.top);
    var limit_l = -10,
        limit_t = -10, //接触外边界
        limit_r = body_cw - this.size[0] + 10,
        limit_d = body_ch - this.size[1] + 10;
    switch (this.situation) {
        case 'transfer':
            if (elm_st < limit_t || elm_st > limit_d) {
                elm.style.top = elm_st < limit_t ? limit_d + 'px' : limit_t + 'px';
                dxy[1] = -dxy[1];
                this.situation_num--;
            }
            if (elm_sl < limit_l || elm_sl > limit_r) {
                elm.style.left = elm_sl < limit_l ? limit_r + 'px' : limit_l + 'px';
                dxy[0] = -dxy[0];
                this.situation_num--;
            }
            if (this.situation_num < 0) {
                this.lives = 0;
            }
            break;
        case 'reflect':
            if (elm_st < limit_t || elm_st > limit_d) {
                elm.style.top = elm_st < limit_t ? limit_t + 'px' : limit_d + 'px';
                dxy[1] = -dxy[1];
                this.situation_num--;
            }
            if (elm_sl < limit_l || elm_sl > limit_r) {
                elm.style.left = elm_sl < limit_l ? limit_l + 'px' : limit_r + 'px';
                dxy[0] = -dxy[0];
                this.situation_num--;
            }
            if (this.situation_num < 0) {
                this.lives = 0;
            }
            break;
        case 'gravity':
            dxy[1] += 0.05;
            if (elm_st > limit_d && dxy[1] > 0) {
                elm.style.top = '530px';
                dxy[1] = -dxy[1];
                dxy[1] += 0.5;
                this.situation_num--;
            }
            if (elm_st < limit_t || this.situation_num < 0) {
                this.lives = 0;
            }
            if (elm_sl < limit_l || elm_sl >= limit_r) {
                elm.style.left = elm_sl < limit_l ? limit_l + 'px' : limit_r + 'px';
                dxy[0] = -dxy[0];
                this.situation_num--;
            }
            break;
        case 'bigger': //接触外边界+100
            if (
                elm_st < limit_t - 100 ||
                elm_st > limit_d + 100 ||
                elm_sl < limit_l - 100 ||
                elm_sl > limit_r + 100
            ) {
                this.lives = 0;
            }
            if (
                elm_st < -this.size[1] ||
                elm_st > body_ch ||
                elm_sl < -this.size[0] ||
                elm_sl > body_cw
            ) {
                //超出内边界
                if (document.body.contains(this.element)) {
                    this.element.remove();
                }
                // this.element.style.backgroundColor = '#0ff';
            } else {
                if (!document.body.contains(this.element)) {
                    this.draw(position(this.element));
                }
                // this.element.style.backgroundColor = '#000';
            }
            break;
        case 'general': //移出内边界
            if (
                elm_st < limit_t - 70 ||
                elm_st > body_ch ||
                elm_sl < -this.size[0] ||
                elm_sl > body_cw
            ) {
                this.lives = 0;
            }
            break;
        case 'none':
            break;
        default:
            throw 'situation 错误 ' + this.situation;
    }
    //移动
    this.element.style.left = parseFloat(this.element.style.left) + dxy[0] + 'px';
    this.element.style.top = parseFloat(this.element.style.top) + dxy[1] + 'px';
};
Bullet.prototype.crash = function (i) {
    //boss被撞 遍历player_bullets
    if (distance(this.element, i.element) < this.size[0] / 2 + 5) {
        this.lives--;
        i.lives = 0;
        player.event('', 1);
        this.hit();
        if (this.lives <= 0) {
            player.event('', this.int_lives);
            this.dead();
        }
    }
};
Bullet.prototype.draw = function (p) {
    this.element.style.left = p[0] - this.size[0] / 2 + 'px';
    this.element.style.top = p[1] - this.size[1] / 2 + 'px';
    this.element.style.width = this.size[0] + 'px';
    this.element.style.height = this.size[1] + 'px';
    this.element.style.backgroundColor = this.color;
    switch (this.type) {
        case 'bullet_player':
            this.element.className = 'bullet_player';
            player_bullets_elm.appendChild(this.element);
            break;
        case 'bullet_boss':
            this.element.className = 'bullet_boss';
            boss_bullets_elm.appendChild(this.element);
            break;
        case 'boss':
            this.element.className = 'boss';
            boss_list_elm.appendChild(this.element);
            break;
        case 'res_live':
            this.element.className = 'res';
            this.element.innerHTML = '🧡';
            res_live_elm.appendChild(this.element);
            break;
        case 'res_score':
            this.element.className = 'res';
            res_score_elm.appendChild(this.element);
            break;
        case 'res_bomb':
            this.element.className = 'res';
            this.element.innerHTML = '💣';
            res_bomb_elm.appendChild(this.element);
            break;
        default:
            throw 'bullet绘制错误:' + this.type;
    }
};
