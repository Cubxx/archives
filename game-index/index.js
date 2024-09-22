class Unit {
    constructor(elm) {
        this.elm = elm;
        //初始
        this.elm.style.fontSize = Math.random() * 30 + 30 + 'px';
        this.width = parseFloat(window.getComputedStyle(elm)['width']);
        this.height = parseFloat(window.getComputedStyle(elm)['height']);
        this.elm.style.top =
            (Math.random() * (body_height - this.height) * 2) / 3 + 50 + 'px';
        this.elm.style.left = Math.random() * (body_width - this.width) + 'px';
        this.spd = [0, 0];
        this.stop = false;
        this.url = this.elm.dataset.url || './index.html';
    }
    position() {
        this.left = parseFloat(window.getComputedStyle(this.elm)['left']);
        this.right = this.left + this.width;
        this.top = parseFloat(window.getComputedStyle(this.elm)['top']);
        this.bottom = this.top + this.height;
    }
    achieve() {
        //运动
        var obj = this,
            spd = this.spd,
            elm = this.elm,
            width = this.width,
            height = this.height;
        var between = function (x, min, max) {
            return x > min && x < max;
        };
        var move = function () {
            var left = parseFloat(window.getComputedStyle(elm)['left']),
                right = left + width,
                top = parseFloat(window.getComputedStyle(elm)['top']),
                bottom = top + height;
            //elm碰撞...
            for (var i of Units) {
                if (i.elm != elm && !obj.stop) {
                    var to_top = () => {
                        if (i.stop) spd[1] = -spd[1] * damp;
                        else {
                            if (spd[1] - i.spd[1] < 0) {
                                var vh = spd[1];
                                spd[1] = i.spd[1] * damp;
                                i.spd[1] = vh * damp;
                            }
                            i.elm.style.top =
                                i.top - (i.bottom - top) * 1 + 'px'; //向上
                        }
                        elm.style.top = top + (i.bottom - top) * 1 + 'px'; //向下
                    };
                    var to_bottom = () => {
                        if (i.stop) spd[1] = -spd[1] * damp;
                        else {
                            if (spd[1] - i.spd[1] > 0) {
                                var vh = spd[1];
                                spd[1] = i.spd[1] * damp;
                                i.spd[1] = vh * damp;
                            }
                            i.elm.style.top =
                                i.top + (bottom - i.top) * 1 + 'px';
                        }
                        elm.style.top = top - (bottom - i.top) * 1 + 'px';
                    };
                    var to_left = () => {
                        if (i.stop) spd[0] = -spd[0] * damp;
                        else {
                            if (spd[0] - i.spd[0] < 0) {
                                var vw = spd[0];
                                spd[0] = i.spd[0] * damp;
                                i.spd[0] = vw * damp;
                            }
                            i.elm.style.left =
                                i.left - (i.right - left) * 1 + 'px'; //向左
                        }
                        elm.style.left = left + (i.right - left) * 1 + 'px'; //向右
                    };
                    var to_right = () => {
                        if (i.stop) spd[0] = -spd[0] * damp;
                        else {
                            if (spd[0] - i.spd[0] > 0) {
                                var vw = spd[0];
                                spd[0] = i.spd[0] * damp;
                                i.spd[0] = vw * damp;
                            }
                            i.elm.style.left =
                                i.left + (right - i.left) * 1 + 'px';
                        }
                        elm.style.left = left - (right - i.left) * 1 + 'px';
                    };

                    i.position();
                    var crs_left = between(left, i.left, i.right),
                        crs_right = between(right, i.left, i.right),
                        crs_top = between(top, i.top, i.bottom),
                        crs_bottom = between(bottom, i.top, i.bottom);
                    if (
                        between(i.left, left, right) &&
                        between(i.right, left, right)
                    ) {
                        if (crs_bottom) to_bottom(); //下包含
                        if (crs_top) to_top(); //上包含
                    }
                    if (
                        between(i.top, top, bottom) &&
                        between(i.bottom, top, bottom)
                    ) {
                        if (crs_left) to_left(); //左包含
                        if (crs_right) to_right(); //右包含
                    }
                    if (crs_left && crs_top) {
                        //左上角重合
                        if (crs_bottom) undefined; //左被包含
                        else if (i.right - left > i.bottom - top) to_top();
                        else to_left();
                    }
                    if (crs_right && crs_top) {
                        //右上角重合
                        if (crs_left) undefined; //上被包含
                        else if (right - i.left > i.bottom - top) to_top();
                        else to_right();
                    }
                    if (crs_left && crs_bottom) {
                        //左下角重合
                        if (crs_right) undefined; //下被包含
                        else if (i.right - left > bottom - i.top) to_bottom();
                        else to_left();
                    }
                    if (crs_right && crs_bottom) {
                        //右下角重合
                        if (crs_top) undefined; //右被包含
                        else if (right - i.left > bottom - i.top) to_bottom();
                        else to_right();
                    }
                }
            }
            //摩擦
            if (!obj.stop) {
                spd[0] -= (spd[0] > 0 ? 1 : -1) * f_air * spd[0] ** 2;
                spd[1] -= (spd[1] > 0 ? 1 : -1) * f_air * spd[1] ** 2;
                if (bottom > body_height - 20 && spd[0] != 0) {
                    var F_grd = f_ground * gravity * width * height;
                    if (Math.abs(F_grd) > Math.abs(spd[0])) spd[0] = 0;
                    else spd[0] -= F_grd * (spd[0] > 0 ? 1 : -1);
                }
            }
            //body碰撞
            if (left < 10 && spd[0] <= 0) {
                spd[0] = -spd[0] * damp;
                elm.style.left = '10px';
            }
            if (right > body_width - 10 && spd[0] >= 0) {
                spd[0] = -spd[0] * damp;
                elm.style.left = body_width - width - 10 + 'px';
            }
            if (top < -200 && spd[1] <= 0) {
                elm.style.top = body_height - height - 0 + 'px';
            }
            if (bottom > body_height - 20) {
                if (spd[1] >= 0) spd[1] = -spd[1] * damp;
                if (Math.abs(spd[1]) < 0.1) {
                    elm.style.top = body_height - height - 20 + 'px';
                    spd[1] = 0;
                }
            } else if (!obj.stop) spd[1] += gravity; //下坠

            //运动
            if (!obj.stop) {
                elm.style.left = parseFloat(elm.style.left) + spd[0] + 'px';
                elm.style.top = parseFloat(elm.style.top) + spd[1] + 'px';
            }
            // debugger;
            if (url_lic) obj.stop = true;
            requestAnimationFrame(move);
        };
        requestAnimationFrame(move);
        //事件
        var url = this.url;
        this.elm.onmousedown = function (e) {
            //拖拽事件
            var ismove = false;
            obj.stop = true;
            spd[0] = 0;
            spd[1] = 0;
            var ex = e.clientX || e.touches[0].clientX,
                ey = e.clientY || e.touches[0].clientY;
            var px = parseFloat(elm.style.left),
                py = parseFloat(elm.style.top);
            var dx = px - ex,
                dy = py - ey;
            document.onmousemove = function (e) {
                var ex = e.clientX || e.touches[0].clientX,
                    ey = e.clientY || e.touches[0].clientY;
                var vx = e.movementX,
                    v_limit = 10,
                    vy = e.movementY;
                if (vx === undefined) vx = Math.random() * 20 - 10;
                else if (vx > v_limit) vx = v_limit;
                else if (vx < -v_limit) vx = -v_limit;
                if (vy === undefined) vy = Math.random() * 20 - 10;
                else if (vy > v_limit) vy = v_limit;
                else if (vy < -v_limit) vy = -v_limit;
                spd[0] = vx;
                spd[1] = vy;
                if (ex + dx > 10 && ex + dx < body_width - width - 10)
                    elm.style.left = dx + ex + 'px';
                if (ey + dy < body_height - height - 20)
                    elm.style.top = dy + ey + 'px';
                ismove = true;
            };
            elm.onmouseup = function () {
                document.onmousemove = null;
                document.ontouchmove = function () {
                    return false;
                };
                obj.stop = !obj.stop;
                if (url_lic && !ismove) window.open(url, '_self');
            };
            document.ontouchmove = document.onmousemove;
            elm.ontouchend = elm.onmouseup;
        };
        this.elm.oncontextmenu = function () {
            obj.stop = true;
        };
        this.elm.ontouchstart = this.elm.onmousedown;
    }
}

//说明
var info = document.getElementById('info');
info.onclick = () => {
    info.style.display = 'none';
};
info.ontouchstart = info.onclick;
// info.onclick(); //debug
//环境参数
var body = document.getElementById('body');
var body_width = parseFloat(window.getComputedStyle(body)['width']),
    body_height = parseFloat(window.getComputedStyle(body)['height']);
var elms = document.getElementsByClassName('unit'),
    Units = [];
var gravity,
    f_air,
    f_ground,
    damp,
    vmax = 2;
var url_lic = true;
//设置面板
var btn = document.getElementById('btn');
var option = document.getElementById('option');
option.children[1].children[2].onchange = function () {
    this.previousElementSibling.innerHTML = (this.value * 100).toFixed(2);
    gravity = parseFloat(this.value);
};
option.children[2].children[2].onchange = function () {
    this.previousElementSibling.innerHTML = (this.value * 1e2).toFixed(2);
    f_air = parseFloat(this.value);
};
option.children[3].children[2].onchange = function () {
    this.previousElementSibling.innerHTML = (this.value * 1e3).toFixed(2);
    f_ground = parseFloat(this.value);
};
option.children[4].children[2].onchange = function () {
    this.previousElementSibling.innerHTML = (this.value * 1).toFixed(2);
    damp = parseFloat(this.value);
};
for (var child of option.children)
    if (child.children[2]) child.children[2].onchange();
option.children[0].children[1].onclick = function () {
    url_lic = !url_lic;
    if (this.value == 'OFF') {
        this.style.backgroundColor = '#fbb';
        this.style.color = '#fff';
        this.value = 'ON';
    } else {
        this.style.backgroundColor = '#fff';
        this.style.color = '#fbb';
        this.value = 'OFF';
    }
};
option.onanimationend = function () {
    if (this.style.animationDirection == 'reverse') this.style.display = 'none';
    this.style.animation = '';
};
btn.onclick = function () {
    if (option.style.display == 'flex') {
        option.style.animation = 'slide 0.4s ease-out';
        option.style.animationDirection = 'reverse';
        body.onclick = null;
    } else {
        option.style.display = 'flex';
        option.style.animation = 'slide 0.4s ease-out';
        body.onclick = btn.onclick;
    }
};
// option.children[0].children[1].onclick(); //debug
//功能
for (var elm of elms) Units.push(new Unit(elm));
for (var unit of Units) unit.achieve();
document.oncontextmenu = function () {
    return false;
};
//egg
var egg_key = setInterval(() => {
    var reserve = [];
    for (var unit of Units) {
        if (parseFloat(unit.elm.style.top) > body_height - 10 && true)
            unit.elm.remove();
        else reserve.push(unit);
    }
    Units = reserve;
    if (body.childElementCount <= 1) {
        info.innerText = '如果你看到这句话\n说明你发现了\n...';
        info.style.display = 'flex';
        info.style.animation = 'slide 4s cubic-bezier(0, 0.3, 0.2, 1)';
        info.onanimationend = function () {
            info.innerText = info.innerText.replace('...', 'BUG');
        };
        clearInterval(egg_key);
    }
}, 5000);
