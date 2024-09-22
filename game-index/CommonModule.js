function between(x, min, max) { return x >= min && x <= max; }
function between_matrix(p, range) { range = Normalize_args(range); return between(p[0], range[0], range[2]) && between(p[1], range[1], range[3]); }
function Normalize_args(list, deft) {
    if (!list) { list = []; list[0] = deft; }
    list[1] = list[1] || list[0];
    list[2] = list[2] || list[0];
    list[3] = list[3] || list[1];
    return list;
} function Move_Range(obj, range, funcs, func_else) { //range[l,t,r,d]
    funcs = Normalize_args(funcs, function () { });
    func_else = func_else || function () { };
    if (obj.left <= range[0]) funcs[0]();
    else if (obj.top <= range[1]) funcs[1]();
    else if (obj.left + obj.width >= range[2]) funcs[2]();
    else if (obj.top + obj.height >= range[3]) funcs[3]();
    else func_else();
}
function Move_Ctrl(obj, vel, ctrl, type) {
    switch (type) {
        case 'grivity':
            obj.spd[0] = vel * (ctrl[2] - ctrl[0]);
            if (obj.spd[1] >= 0 && (ctrl[3] - ctrl[1]) != 0 && obj.skip_num < 2 && obj.isskip) { obj.spd[1] = 2.5 * vel * (ctrl[3] - ctrl[1]); obj.skip_num++; }
            if (obj.spd[1] == 0) obj.skip_num = 0;
            break;
        default:
            obj.spd[0] = vel * (ctrl[2] - ctrl[0]);
            obj.spd[1] = vel * (ctrl[3] - ctrl[1]);
            break;
    }
}
function Obj_Crash(obj, other, funcs, func_else) {
    funcs = Normalize_args(funcs);
    var to_left = funcs[0], to_top = funcs[1], to_right = funcs[2], to_bottom = funcs[3];
    var crs_left = between(obj.left, other.left, other.left + other.width),
        crs_right = between(obj.left + obj.width, other.left, other.left + other.width),
        crs_top = between(obj.top, other.top, other.top + other.height),
        crs_bottom = between(obj.top + obj.height, other.top, other.top + other.height);
    if (crs_left && crs_top) { //左上角重合
        if (crs_bottom) undefined; //左被包含
        else if (other.left + other.width - obj.left > other.top + other.height - obj.top) to_top(); else to_left();
    }
    if (crs_right && crs_top) { //右上角重合
        if (crs_left) undefined; //上被包含
        else if (obj.left + obj.width - other.left > other.top + other.height - obj.top) to_top(); else to_right();
    }
    if (crs_left && crs_bottom) {  //左下角重合
        if (crs_right) undefined; //下被包含
        else if (other.left + other.width - obj.left > obj.top + obj.height - other.top) to_bottom(); else to_left();
    }
    if (crs_right && crs_bottom) { //右下角重合
        if (crs_top) undefined; //右被包含
        else if (obj.left + obj.width - other.left > obj.top + obj.height - other.top) to_bottom(); else to_right();
    }
    /* if (between(other.left, obj.left, obj.left + obj.width) && between(other.left + other.width, obj.left, obj.left + obj.width)) {
        if (crs_bottom) to_bottom(); //下包含
        if (crs_top) to_top(); //上包含
    }
    if (between(other.top, obj.top, obj.top + obj.height) && between(other.top + other.height, obj.top, obj.top + obj.height)) {
        if (crs_left) to_left(); //左包含
        if (crs_right) to_right(); //右包含
    } */
}

// export { Motion_Range, Move_Ctrl, Obj_Crash }