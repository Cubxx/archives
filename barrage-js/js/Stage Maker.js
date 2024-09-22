'use strict';
function Stage(level) {
    this.level = level;
    this.boss_lives = 20;
    this.blank_t = 0;
    this.end_conditions = false;
    this.bullet_generate = function () { }
    this.boss_generate = function () { this.end_conditions = (exe_time / 60 == 2); }
    Array.prototype.create = function (num, code) { for (let i = 0; i < num; i++) { this[i] = eval(code) } return this; }
    var obj, obj_list = [];
    switch (level) {
        case 10: //beta 定向移动
            this.boss_generate = function () {
                var obj1, obj2, obj3;
                if (boss_list.length >= 0) {
                    obj1 = boss_maker.generator(60, [265, 100], [3, 0], [['toward', [265, 400], 120], 'bigger'], [this.boss_lives, '', [10, 10]]);
                }
            }
            break;
        case 1: //有序跟踪
            this.boss_lives = 8;
            this.boss_generate = function () {
                if (boss_maker.generate_num < 24) {
                    var p_list = [].create(4, '[Math.random() * 530, -40]'), obj_list,
                        v_list = [].create(4, '[0, Math.random()+2]');
                    obj_list = boss_maker.multi_generator(60, p_list, v_list, [], [this.boss_lives, '', [40, 40]], [], 4);
                    for (let i of obj_list) { i.fire = function () { this.generator(120, [], [0, 3], [], [], ['locate']); } }
                }
                boss_maker.generate_num == 24 ? this.blank_t++ : undefined;
                this.end_conditions = (this.blank_t / 60 == 2);
            }
            break;
        case 2: //混乱跟踪
            this.boss_lives = 8;
            this.boss_generate = function () {
                if (boss_maker.generate_num < 24) {
                    var p_list = [].create(4, '[Math.random() * 530, -40]'), obj_list,
                        v_list = [].create(4, '[Math.random() * 2-1, Math.random()+2]');
                    obj_list = boss_maker.multi_generator(60, p_list, v_list, [], [this.boss_lives, '', [40, 40]], '', 4);
                    for (let i of obj_list) { i.fire = function () { this.generator(120, [], [0, 3], [], [], ['locate']); } }
                }
                this.end_conditions = (boss_maker.generate_num == 24 && position(boss_list.slice(-1)[0].element)[1] > 200);
            }
            break;
        case 3: //下压炸弹
            this.boss_lives = 4;
            this.boss_generate = function () {
                if (boss_maker.generate_num < 6 * 11 && (boss_list.length == 0 || position(boss_list.slice(-1)[0].element)[1] > 200)) {
                    var r = parseInt(Math.random() * 10), obj;
                    for (let o = 0; o < 1; o += 1 / 11) {
                        obj = boss_maker.generator(1, [o * 530 + Math.random() * 10 + 20, - 40], [], [['gravity', 0.01, (Math.random() * 0.5 + 5)]]
                            , parseInt(o * 11) == r ? [this.boss_lives, '#ff7f00', [40, 40]] : [800, '', [40, 40]]);
                        obj.dead = function () {
                            this.generator(1, [], [0, 1], [], [1, '#ff7f00', [4, 4]], ['ring', 40, 7, 3]);
                        }
                    }
                }
                this.end_conditions = (boss_maker.generate_num == 6 * 11 && boss_list.length == 0);
            }
            break;
        case 4: //虚晃一枪
            this.boss_lives = 50;
            this.boss_generate = function () {
                if (boss_maker.generate_num < 1) {
                    obj = boss_maker.generator(1, [265, -40], [0, 5], [['toward', [265, 265], '', 0, '', () => { obj.move_type = [] }]], [this.boss_lives, '', [20, 20]]);
                    obj.hit = function () {
                        this.element.style.backgroundColor = 'rgb(' + (255 * (1 - this.lives / this.int_lives)) + ',0,0)';
                        this.move_type = ['shake', (10 * (1 - this.lives / this.int_lives))];
                        this.situation = 'reflect';
                        this.situation_num = 999;
                    }
                    obj.dead = function () {
                        this.generator(1, [], [0, 1], [], [1, '#f00', [4, 4]], ['ring', 100, 12, 3]);
                        this.generator(1, [], [0, 1], ['', 'reflect', 2], [20, '', [10, 10]], ['ring', 100]);
                        this.obj_type = 'res_score';
                        this.generator(1, [], [0, 0.2], [['gravity', 0.005]], [10, '#00885866', [15, 15]], ['ring', 8]);
                    }
                }
                if (boss_list.length == 1) { //有一个boss
                    if (boss_list[0].lives == this.boss_lives) { //boss没掉血
                        if (this.blank_t / 60 == 5) { //时间到5秒
                            this.blank_t = 0;
                            boss_list.pop().element.remove();
                        } else { this.blank_t++; }
                    }
                } else if (boss_bullets.length == 0) { //没bullet
                    this.blank_t++;
                    this.end_conditions = (this.blank_t / 60 == 2);
                } else { this.blank_t = 0; }
            }
            break;
        case 5: //旋转跟踪
            this.boss_lives = 144 * 2;
            this.boss_generate = function () {
                if (boss_maker.generate_num < 3) {
                    obj_list.push(boss_maker.generator(1, [265, -65], [-5, 0], [['circle', 300, 0], 'bigger'], [this.boss_lives / 2, '', [20, 20]]));
                    obj_list.push(boss_maker.generator(1, [570, 65], [-1.5, 6], [['toward', [265, 465], 0, '', '', () => { obj_list[1].move_type = ['circle', 200, 1] }], 'bigger'], [this.boss_lives / 2, '', [20, 20]]));
                    obj_list.push(boss_maker.generator(1, [570, 465], [-1.1, -3], [['toward', [265, 165], 0, '', '', () => { obj_list[2].move_type = ['circle', 100, 0] }], 'bigger'], [this.boss_lives, '', [40, 40]]));
                    for (let obj of obj_list) {
                        obj.fire = function () {
                            boss_list.length > 1
                                ? this.generator(81, [], [0, 1], [['track', 60], 'bigger'], [1, '#0022ff'], ['locate'])
                                : this.generator(15, [], [0, 1], [['track', 60], 'bigger'], [1, '#0022ff'], ['locate']);
                        }
                    }
                }
                if (boss_list.length == 0) { bullet_clean = true; }
                if (boss_bullets.length == 0) { bullet_clean = false; }
                boss_list.length == 0 && !bullet_clean ? this.blank_t++ : undefined;
                this.end_conditions = (this.blank_t / 60 == 2);
            }
            break;
        case 6: //转圈圈
            this.boss_lives = 144 * 2.5;
            this.bullet_generate = function () {
                if (boss_bullets.length < 180 && !bullet_clean) {
                    bullet_boss_maker.generator(4, [260, 260], [0, Math.PI / 2], [['circle', 180], 'bigger'], [999], ['ring', 1]);
                } else { //win_bullets 生成完后再生成boss
                    this.boss_generate = function () {
                        if (boss_maker.generate_num < 1) {
                            obj = boss_maker.generator(1, [570, -40], [-1, 1.8], [['toward', [265, 100], 0, '', '', () => { obj.move_type = ['circle', 180, 0] }], 'bigger'], [this.boss_lives, '', [40, 40]]);
                            obj.dead = function () { bullet_clean = true; player.event('', this.int_lives); }
                            obj.fire = function () { this.generator(60, [], [0, 1], [], [1, '#0022ff'], ['locate', '', Math.random() > 0.5 ? 0.15 : -0.15]); }
                        }
                    }
                }
                if (boss_bullets.length == 0) { bullet_clean = false; }
                this.end_conditions = (boss_list.length == 0 && boss_bullets.length == 0);
            }
            break;
    }
}


function Maker(obj_type) {
    this.obj_type = obj_type; //Bullet类型
    this.generate_time = 999;
    this.multi_generate_time = 999;
    this.generate_num = 0;
    this.result; //返回值
    this.element = document.createElement('maker');
    this.element.style.left = '0px'; this.element.style.top = '0px'; this.element.style.width = '0px'; this.element.style.height = '0px';
    var generate_count = 0;
    var format = function (arg, res, ...n) {// str num arr
        let str_n = n[0], num_n = n[1], arr_n = n[2];
        if (!arg || arg == false) { return res } else if (res instanceof Array && !(arg instanceof Array)) { throw '参数错误 Array ' + arg }
        else if (arg instanceof Array) {
            if (typeof str_n == 'number' && (!arg[str_n] || typeof arg[str_n] != 'string')) if (!arg[str_n] || arg[str_n] == false) { arg[str_n] = res[str_n] } else { throw '参数错误 String ' + arg[str_n] }
            if (typeof num_n == 'number' && (typeof arg[num_n] != 'number')) if (!arg[num_n] || arg[num_n] == false) { arg[num_n] = res[num_n] } else { throw '参数错误 Number ' + arg[num_n] }
            if (typeof arr_n == 'number' && (!(arg[arr_n] instanceof Array))) if (!arg[arr_n] || arg[arr_n] == false) { arg[arr_n] = res[arr_n] } else { throw '参数错误 Array ' + arg[arr_n] }
            return arg;
        };
    }

    //move = [['func_name', args], 'situation', situation_num], obj_prop = [lives, 'color', [size]], generate_type = ['func_name', args]
    this.generator = function (t_lag, p, v, move, obj_prop, generate_type) { //ring返回数组 locate、general返回对象
        //定时发生
        this.generate_time++;
        if (this.generate_time >= t_lag) {
            this.generate_time = 0;
            //obj_prop 默认值
            if (!obj_prop || obj_prop == false) {
                switch (this.obj_type || 'bullet_boss') {
                    case 'bullet_boss': break;
                    case 'bullet_player': obj_prop = [1, '#cc000050', [10, 10]]; break;
                    case 'boss': obj_prop = [20, '#000', [40, 40]]; break;
                    case 'res_live': obj_prop = [1, '#0000', [22, 22]]; break;
                    case 'res_score': obj_prop = [1, '#00885845', [5, 5]]; break;
                    case 'res_bomb': obj_prop = [1, '#0000', [22, 22]]; break;
                    default: throw 'obj_type错误' + this.obj_type;
                }
            }
            //参数初始化
            p = format(p, [0, 0]);
            v = format(v, [0, 0]);
            move = format(move, [undefined, 'general', 1], 1, 2, 0);
            move[0] = format(move[0], ''), 0;
            obj_prop = format(obj_prop, [1, '#000', [10, 10]], 1, 0, 2);
            generate_type = format(generate_type, ['general'], 0);
            var obj, obj_list = [],
                p = position(this.element, p), //Maker绝对位置 Bullet相对位置
                size = obj_prop[2] || [10, 10],
                v_value = Math.sqrt(v[0] ** 2 + v[1] ** 2),
                elm = this.element,
                obj_type = this.obj_type || 'bullet_boss';
            check_err([p, v]);
            if (!(this instanceof Player)) this.generate_num++; //发生次数
            //构建器
            var creator = function (v, p) {
                check_err([p, v]);
                obj = new Bullet(p, v, obj_type, move, obj_prop);
                obj.super_elm = elm
                obj.draw(p);
                switch (obj_type) {
                    case 'bullet_boss': ; boss_bullets.push(obj); break;
                    case 'bullet_player': player_bullets.push(obj); break;
                    case 'boss': boss_list.push(obj); break;
                    default: if (obj_type.includes('res')) res_list.push(obj); break;
                }
                return obj;
            }
            //发生方式
            var generate_libs = {
                ring: function (num, v_rand, s_rand) {
                    generate_count += Math.PI / 30;
                    var c = generate_count;// ** 1.85;//+ Math.random() * Math.PI * 2; //相位
                    for (let i = c; i < Math.PI * 2 + c; i += Math.PI * 2 / num) {
                        let v_rate = Math.random() * (v_rand || 0) + 1,
                            s_rate = Math.random() * (s_rand || 0) + 1;
                        if (s_rand) { obj_prop[2] = [size[0] * s_rate, size[1] * s_rate]; }
                        v = [v_value * v_rate * Math.cos(i + c), v_value * v_rate * Math.sin(i + c)];
                        obj_list.push(creator(v, p));
                    }
                    return obj_list;
                },
                locate: function (pos, angle) { //偏离位移
                    var pos = pos == false ? undefined : pos,
                        angle = angle || 0;
                    angle += degree(player.element, elm, pos);
                    v = [v_value * Math.cos(angle), v_value * Math.sin(angle)];
                    return creator(v, p);
                },
                general: function () {
                    return creator(v, p);
                }
            }
            this.result = (function (name, ...args) { return this[name](...args) }).apply(generate_libs, generate_type);
            check_err([this.result]);
        }
        return this.result;
    }

    this.multi_generator = function (t_lag, p_list, v_list, move, obj_prop, generate, num) { //返回数组、嵌套数组
        var obj_list = [], obj_this = this, obj;
        this.multi_generate_time++;
        if (this.multi_generate_time >= t_lag) {
            this.multi_generate_time = 0;
            for (let o = 0; o < num; o++) {
                obj = obj_this.generator(1, p_list[o], v_list[o], move, obj_prop, generate);
                obj ? obj_list.push(obj) : undefined;
            }
        }
        return obj_list;
    }
}