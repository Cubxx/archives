function Player(x, y) {
    this.element = document.createElement('div');
    this.lives = 3;
    this.score = 0;
    this.bombs = 0;
    this.invincible_time = 0;
    this.generate_time = 0;
    this.no_died;
    var bomb_time = 180,
        res_time,
        wipe_time,
        lives = this.lives,
        score = this.score,
        bombs = this.bombs;
    this.event = function () {
        //修改属性值 lives score bombs //闭包
        if (arguments[0] || arguments[0] === 0) {
            lives += arguments[0];
            this.lives = lives;
            if (arguments[3]) {
                return this.lives;
            }
        }
        if (arguments[1] || arguments[1] === 0) {
            score += arguments[1];
            this.score = score;
            if (arguments[3]) {
                return this.score;
            }
        }
        if (arguments[2] || arguments[2] === 0) {
            bombs += arguments[2];
            this.bombs = bombs;
            if (arguments[3]) {
                return this.bombs;
            }
        }
    };
    this.move = function (dr, dl, dd, dt) {
        var elm_sl = parseFloat(this.element.style.left),
            elm_st = parseFloat(this.element.style.top);
        if (elm_st < 0) {
            dt = 0;
        } //上
        else if (elm_st > body_ch - 20) {
            dd = 0;
        } //下
        if (elm_sl < 0) {
            dl = 0;
        } //左
        else if (elm_sl > body_cw - 20) {
            dr = 0;
        } //右
        this.element.style.left = parseFloat(this.element.style.left) + spd * (dr - dl) + 'px';
        this.element.style.top = parseFloat(this.element.style.top) + spd * (dd - dt) + 'px';
    };
    this.fire = function (isfire) {
        if (isfire && bomb_time >= 180) {
            //15帧 4 bullet => 1秒 16 bullet
            fast = () => {
                player.multi_generator(
                    15,
                    [
                        [7, 0],
                        [-7, 0],
                    ],
                    [
                        [0, -10],
                        [0, -10],
                    ],
                    [['fire']],
                    [],
                    '',
                    2,
                );
                player.multi_generator(
                    15,
                    [
                        [14, 0],
                        [-14, 0],
                    ],
                    [
                        [1, -5],
                        [-1, -5],
                    ],
                    [['fire', true]],
                    [],
                    '',
                    2,
                );
            };
            slow = () => {
                player.multi_generator(
                    15,
                    [
                        [7, 0],
                        [-7, 0],
                    ],
                    [
                        [0, -10],
                        [0, -10],
                    ],
                    [['fire']],
                    [],
                    '',
                    2,
                );
                player.multi_generator(
                    15,
                    [
                        [14, 0],
                        [-14, 0],
                    ],
                    [
                        [0, -10],
                        [0, -10],
                    ],
                    [['fire']],
                    [],
                    '',
                    2,
                );
            };
            spd == 2 ? slow() : fast();
        }
    };
    this.fire_bomb = function (isbomb) {
        //bomb 144伤害
        if (bomb_time < 180) {
            //恢复bomb
            bomb_time++;
            bombs_elm.children[1].style.width = (bomb_time / 180) * 530 + 'px ';
            this.multi_generator(
                5,
                [
                    [14, 0],
                    [-14, 0],
                    [7, 0],
                    [-7, 0],
                ],
                [
                    [1, -5],
                    [-1, -5],
                    [0, -10],
                    [0, -10],
                ],
                [['fire', true]],
                [],
                '',
                4,
            );
            if (bomb_time == parseInt(res_time) && res_switch) {
                res_maker.obj_type = 'res_bomb';
                res_maker.generator(1, [Math.random() * 530, -25], [0, 1]);
                res_switch = false;
            }
        } else if (isbomb && this.bombs > 0) {
            //用bomb
            this.event('', '', -1);
            bomb_time = 0;
            this.invincible_time = 0;
            bullet_decrease = true;
            res_time = Math.random() * 180;
            for (i of res_list) {
                i.move_type = ['absorb', 500];
            } //回收资源
        } else {
            bullet_decrease = false;
        }
    };
    this.crash = function (i) {
        if (distance(this.element, i.element) < i.size[0] / 2 + 2) {
            //判定点 4*4
            if (i.type == 'bullet_boss') i.lives--;
            if (this.invincible_time == 180) {
                //被撞
                if (this.lives > 0) {
                    this.event(-1);
                    this.no_died = false;
                    this.invincible_time = 60;
                    res_time = Math.random() * 120 + 60;
                }
                this.event('', '', 2 - this.event('', '', 0, 1)); //bombs = 2
            }
        }
        if (this.invincible_time == parseInt(res_time) && res_switch) {
            res_maker.obj_type = 'res_live';
            res_maker.generator(1, [Math.random() * 530, -25], [0, 1]);
            res_switch = false;
        }
    };
    this.wipe = function (i) {
        //擦弹事件
        var dis = distance(this.element, i.element);
        if (dis < i.size[0] / 2 + 10) {
            //身体 20*20
            switch (i.type) {
                case 'boss':
                    break;
                case 'bullet_boss':
                    this.event('', 1);
                    break;
                case 'res_live':
                    i.lives = 0;
                    if (this.lives < 5) this.event(1);
                    break;
                case 'res_bomb':
                    i.lives = 0;
                    if (this.bombs < 5) this.event('', '', 1);
                    break;
                case 'res_score':
                    this.event('', i.lives);
                    i.lives = 0;
                    break;
            }
        } else if (dis < i.size[0] / 2 + 30) {
            //身体 往外20
            if (i.type.includes('boss') && i.generate_num < 10) {
                i.obj_type = 'res_score';
                i.generator(30, [], [0.2, 0], [['gravity', 0.005]], [], ['ring', 4]);
                i.obj_type = 'bullet_boss';
            }
        }
    };
    this.draw = function () {
        //判定点
        var hit_point_elm = document.createElement('div');
        hit_point_elm.style.left = '8px';
        hit_point_elm.style.top = '8px';
        hit_point_elm.style.width = '4px';
        hit_point_elm.style.height = '4px';
        hit_point_elm.style.backgroundColor = '#fff8dc';
        this.element.appendChild(hit_point_elm);

        this.element.id = 'player';
        this.element.style.left = x - 20 / 2 + 'px';
        this.element.style.top = y - 20 / 2 + 'px';
        this.element.style.width = '20px';
        this.element.style.height = '20px';
        this.element.style.backgroundColor = '#cc0000cc';
        document.body.insertBefore(this.element, document.querySelector('script'));
    };
}
Player.prototype = new Maker();
