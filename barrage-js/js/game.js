var boss_list_elm = document.createElement('div');
boss_list_elm.id = 'boss';
document.body.insertBefore(boss_list_elm, document.querySelector('script'));
var boss_bullets_elm = document.createElement('div');
boss_bullets_elm.id = 'bullet_boss';
document.body.insertBefore(boss_bullets_elm, document.querySelector('script'));
var player_bullets_elm = document.createElement('div');
player_bullets_elm.id = 'bullet_player';
document.body.insertBefore(player_bullets_elm, document.querySelector('script'));
var res_elm = document.createElement('div'),
    res_live_elm = document.createElement('div'),
    res_score_elm = document.createElement('div'),
    res_bomb_elm = document.createElement('div');
res_elm.id = 'resource';
res_elm.append(res_live_elm, res_score_elm, res_bomb_elm);
document.body.insertBefore(res_elm, document.querySelector('script'));

{
    //全局函数
    var position = function (obj_elm, p) {
        //obj.element []位移
        var pos = p || [0, 0];
        return [
            parseFloat(obj_elm.style.left) + parseFloat(obj_elm.style.width) / 2 + pos[0],
            parseFloat(obj_elm.style.top) + parseFloat(obj_elm.style.height) / 2 + pos[1],
        ];
    };
    var distance = function (elm_1, elm_2) {
        var pos_1 = position(elm_1),
            pos_2 = position(elm_2),
            x = pos_1[0] - pos_2[0],
            y = pos_1[1] - pos_2[1];
        return Math.sqrt(x * x + y * y);
    };
    var degree = function (elm_1, elm_2, p_1, p_2) {
        var pos_1 = position(elm_1, p_1),
            pos_2 = position(elm_2, p_2),
            x = pos_1[0] - pos_2[0],
            y = pos_1[1] - pos_2[1];
        return Math.atan2(y, x);
    };
    var update = function (list, func1, func2) {
        //list func1有生命i func2所有i
        let survive = [];
        for (var i of list) {
            if (func2 != undefined) {
                func2(i);
            }
            if (i.lives > 0) {
                survive.push(i);
                func1(i);
            } else {
                i.element.remove();
            }
        }
        return survive;
    };
    var timer = function (int_time, time_lag, func) {
        //定时执行 每time_lag帧执行一次
        int_time++;
        if (int_time >= time_lag) {
            int_time = 0;
            func();
        }
        return int_time;
    };
    var check_err = function (vars) {
        // '' [] undefined NaN null
        if (!Array.isArray(vars)) throw 'check_err参数不是数组 ' + vars;
        for (let i = 0; i < vars.length; i++) {
            if (vars[i] == null || vars[i] === '' || Object.is(vars[i], NaN))
                throw '序号 ' + (i + 1) + ' 值错误 ' + vars[i];
            if (Array.isArray(vars[i])) {
                if (vars[i].length != 0) {
                    check_err(vars[i]);
                } else {
                    throw '序号 ' + (i + 1) + ' 值错误 []' + vars[i];
                }
            }
        }
    };
    var print_log = function () {
        //输出数组信息
        var str = 'fps,bb,pb,b\n';
        for (let i of log_list) {
            str += i.toString() + '\n';
        }
        console.log(str);
    };
    var input = () => {
        var name = prompt(
            '输入最能代表你的词 => 开启内卷模式🤏🏻\n\t\t❗仅可包含中英字母、数字、下划线、减号, 1-16位',
        );
        if (/^[\u4E00-\u9FA5a-zA-Z0-9_-]{1,16}$/.test(name)) {
            return name;
        } else {
            alert('兄啊这名不行👻换个名吧');
            return input();
        }
    };
    var upload = function (name) {
        axios
            .post('http://127.0.0.1:8080/cube_game/player/commit', {
                //上传数据 已替换debug
                username: name,
                score: player.score,
            })
            .then((respond) => {
                console.log('上传成功👍🏻好雄！');
                alert('🙉排行榜将在下一次游戏中更新');
            })
            .catch((err) => {
                console.log('上传失败捏🤡\n', err);
                alert('💨请按F12查看控制台输出');
            });
    };
    var download = function () {
        axios
            .get('http://127.0.0.1:8080/cube_game/player/top5', {
                //请求数据
            })
            .then((respond) => {
                console.log('请求成功💪🏻开始内卷👊🏻\n');
                for (let user of respond.data) {
                    rank_elm.children[1].innerHTML += user.username + '<br>';
                    rank_elm.children[2].innerHTML += user.score + '<br>';
                }
            })
            .catch((err) => {
                console.log('请求失败捏\n可能是服务器🐔了\n', err);
            });
    };
}

{
    //定义变量
    var Stop,
        stage = new Stage(0),
        exe_time = 0,
        start_t,
        end_t,
        fps = 60.0, //实时帧率
        spd = 4.5,
        dl = 0,
        dr = 0,
        dt = 0,
        dd = 0,
        isfire = false,
        isbomb = false,
        bullet_clean = false,
        bullet_decrease = false,
        res_switch = true,
        ispause = true,
        player_bullets = [],
        boss_bullets = [],
        boss_list = [],
        res_list = [],
        log_list = [['fps', 'bb', 'pb', 'b', 'r']], //记录内存bullet数 帧率
        body_ch = document.body.clientHeight,
        body_cw = document.body.clientWidth,
        pause_elm = document.getElementById('pause'),
        score_elm = document.getElementById('panel').children[0],
        lives_elm = document.getElementById('panel').children[1],
        bombs_elm = document.getElementById('panel').children[2],
        fps_elm = document.getElementById('panel').children[3],
        level_elm = document.getElementById('panel').children[4],
        rank_elm = document.getElementById('rank'),
        img_elm = document.getElementById('img'),
        audio_elm = document.getElementById('audio');
    var player = new Player(265, 450),
        bullet_boss_maker = new Maker('bullet_boss'),
        boss_maker = new Maker('boss'),
        res_maker = new Maker();
}
player.obj_type = 'bullet_player';
player.draw();
document.body.style.zoom = (1.3 * 1.25) / window.devicePixelRatio; //设置缩放

//音效加载
if (/* confirm('是否打开音效？') */ 0) {
}
var audio_end_bad = audio_elm.children[0],
    audio_end_happy = audio_elm.children[1];
for (let i of audio_elm.children) {
    i.volume = 0.1;
}

//循环体
var main = function () {
    {
        //信息面版
        if (exe_time % 60 == 0) {
            start_t = Date.now();
        } else if (exe_time % 60 == 59) {
            end_t = Date.now();
            fps = (59 * 1000) / (end_t - start_t);
            log_list.push([
                fps,
                boss_bullets.length,
                player_bullets.length,
                boss_list.length,
                res_list.length,
            ]);
        }
        exe_time++;
        if (player.invincible_time < 180) {
            //恢复判定
            player.invincible_time++;
            player.element.style.opacity = player.invincible_time % 20 < 10 ? 0.6 : 0.2;
        }
        player.event(0, 0, 0); //实时更新属性
        score_elm.innerHTML = '' + parseInt(player.score);
        lives_elm.children[0].innerHTML = '🧡'.repeat(player.lives);
        bombs_elm.children[0].innerHTML = '💣'.repeat(player.bombs);
        fps_elm.innerHTML = fps.toFixed(3);
        level_elm.innerHTML = stage.level ? 'Level ' + stage.level : 'Loading...';
        lives_elm.children[1].style.width = (player.invincible_time / 180) * 530 + 'px ';
    }
    //BAD END
    if (player.lives < 1) {
        pause_elm.innerHTML = 'BAD END';
        ispause = !ispause;
        img_elm.children[0].style.display = 'block';
        rank_elm.style.display = 'block';
        audio_end_bad.play();
        //if (typeof axios != 'undefined') { download(); } else { rank_elm.children[0].innerHTML = '💻😴'; console.log('🤡网络错误\n导入axios失败') }
    }
    // HAPPY END
    if (stage.level == 6 && stage.end_conditions) {
        //debug
        player.event('', player.lives * 50 + player.bombs * 20); //🧡+100 💣+50
        pause_elm.innerHTML = 'HAPPY END';
        ispause = !ispause;
        img_elm.children[1].style.display = 'block';
        rank_elm.style.display = 'block';
        audio_end_happy.play();
        /* if (typeof axios != 'undefined') {
            var name = input();
            if (name != null) upload(name);
            download();
        } else { rank_elm.children[0].innerHTML = '💻😪'; console.log('你好雄👍🏻但是网络寄了🤡\n导入axios失败') } */
    }
    //关卡逻辑
    if (stage.end_conditions) {
        stage = new Stage(stage.level + 1);
        boss_maker.generate_num = 0;
        res_switch = true;
        if (player.lives == 1) {
            res_maker.obj_type = 'res_live';
            res_maker.generator(1, [Math.random() * 530, -25], [0, 1]);
        }
        if (player.no_died) {
            res_maker.obj_type = 'res_live';
            res_maker.generator(1, [Math.random() * 530, -25], [0, 1]);
            res_maker.obj_type = 'res_bomb';
            res_maker.generator(1, [Math.random() * 530, -25], [0, 1]);
        } else {
            player.no_died = true;
        }
    }
    //player方法
    player.move(dr, dl, dd, dt);
    player.fire(isfire);
    player.fire_bomb(isbomb);
    //player_bullets方法
    player_bullets = update(player_bullets, (i) => {
        i.move();
    });
    //boss bullet生成
    stage.boss_generate();
    stage.bullet_generate();
    //boss方法
    boss_list = update(boss_list, (i) => {
        i.fire();
        i.move();
        player.wipe(i);
        player.crash(i);
    });
    //boss_bullets方法
    boss_bullets = update(
        boss_bullets,
        (i) => {
            i.fire();
            i.move();
            player.wipe(i);
            player.crash(i);
        },
        () => {
            if (bullet_clean) {
                boss_bullets.slice(-1)[0].lives -= 0.05 * boss_bullets.slice(-1)[0].int_lives;
            } //boss_dead
            if (bullet_decrease) {
                if (Math.random() > 0.9) {
                    i.lives -= 0.5;
                }
            } //bomb
        },
    );
    //res方法
    res_list = update(res_list, (i) => {
        i.fire();
        i.move();
        player.wipe(i);
    });
    //暂停
    if (ispause) {
        clearInterval(Stop);
    }
    pause_elm.style.display = ispause ? 'block' : 'none'; //debug
};

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
        case 16:
            spd = 2;
            break; //shift
        case 90:
            isfire = true;
            break; //z
        case 88:
            isbomb = true;
            break; //x
        case 32:
            ispause = !ispause;
            document.documentElement.requestFullscreen
                ? document.documentElement.requestFullscreen()
                : undefined; //W3C
            document.documentElement.mozRequestFullScreen
                ? document.documentElement.mozRequestFullScreen()
                : undefined; //FireFox
            document.documentElement.webkitRequestFullScreen
                ? document.documentElement.webkitRequestFullScreen()
                : undefined; //Chrome等
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
        case 16:
            spd = 4.5;
            break;
        case 90:
            isfire = false;
            break;
        case 88:
            isbomb = false;
            break;
        case 32:
            Stop = ispause ? Stop : setInterval(main, 1000 / 60);
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
    }
};
/* var box = player.element;
box.onmousedown = function (e) { //拖拽事件
    var dx = box.offsetLeft - e.clientX - 10;
    var dy = box.offsetTop - e.clientY - 10;
    document.onmousemove = function (e) {
        box.style.left = dx + e.clientX + 'px';
        box.style.top = dy + e.clientY + 'px';
    }
    document.onmouseup = function () {
        document.onmousemove = null;
    }
} */
document.oncontextmenu = function () {
    return false;
};
document.onselectstart = function () {
    return false;
};
