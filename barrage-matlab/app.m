function app()
    % this is the launch file, you could input 'app' on Command Window to run it
    % it's a barrage game, the red square is player, the black squares are enemies
    % you can move the red square by pressing the direction keys
    % be careful don't let the red square touches the black squares
    % you will win after these black squares though you
    clear;close all;clc;
    %% Initialize
    suf = figure('name', 'Barrage', 'color', [1, 0.9, 0.79], 'position', [0, 0, 500, 500]);
    set(suf, 'windowkeypressfcn', @keypress);
    set(suf, 'windowkeyreleasefcn', @keyrelease);
    fps_txt = text(500, 0, 'loading...');
    FPS = 30;
    % create objects
    p = Player(20, [300, 50]); p.body.FaceColor = 'r';
    args = [pi / 2, pi / 2, 0, 600];
    rotate_rand = (rand(1, 2) * pi - pi / 2) * 0.01; % random rotation speed
    global bs;
    % delete other timers
    if ~isempty(timerfind)
        stop(timerfind);
        delete(timerfind);
    end

    % create timer
    Timer = timer( ...
        'StartDelay', 0, ...
        'executionmode', 'fixedrate', ...
        'Period', round(1 / FPS, 3), ...
        'TasksToExecute', inf);
    Timer.TimerFcn = @loop;
    Timer.ErrorFcn = @loop_error;
    %% Timer start
    begin_ = clock;
    start(Timer);
    % err => stop
    function loop_error(obj, ~)
        stop(obj)
    end

    % callback func
    function loop(obj, ~)
        % print real FPS
        freq = 30; % printing lag time

        if mod(obj.TasksExecuted, freq) == 0
            fps_txt.String = sprintf('fps: %.2f \n', freq / etime(clock, begin_));
        elseif mod(obj.TasksExecuted, freq) == 1
            begin_ = clock;
        end

        % draw
        main()
        % run_time==* => stop
        if obj.TasksExecuted >= inf
            stop(obj)
        end

    end

    %% draw + generate bs
    % draw
    function main()
        args(1) = args(1) + rotate_rand(1);
        args(2) = args(2) + rotate_rand(2);
        args(4) = args(4) - 3;
        p.move(); p.draw();
        % clean b's image
        for b = bs
            delete(b.body)
        end

        bs = generate_ball(args(1), args(2), [args(3), args(4)]);

        for b = bs
            b.move();
            b.draw();
            % crash detect
            % bad end
            if p.crash(b)
                text(300, 300, 'dead');
                stop(Timer)
            end

            % happy end
            if b.position(2) <- 600
                text(300, 300, 'win');
                stop(Timer)
            end

        end

        %
        axis([0, 600, 0, 600]);
        drawnow
    end

    % generate bs
    function bs = generate_ball(alpha, beta, offset)
        % alpha; absolute Z
        % beta; relative X
        % offset; relative displacement
        n = 8;
        bs = repmat(Bullet(15, [0, 100]), 1, n ^ 2); i = 1; % allocate stroage to array
        basic = [
               cos(alpha) * cos(beta), -sin(alpha), -cos(alpha) * sin(beta);
               sin(alpha) * cos(beta), cos(alpha), -sin(alpha) * sin(beta);
               sin(beta), 0, cos(beta)
               ];

        for zi = linspace(-pi / 2, pi / 2, n)

            for deg = linspace(2 * pi / n, 2 * pi, n)
                px = cos(deg) * cos(zi);
                py = sin(deg) * cos(zi);
                pz = sin(zi);
                chg = basic * [px; py; pz];
                [px, py] = deal(chg(2), chg(3)); % 3D to 2D
                b = Bullet(15, [px + 1, py + 1] * 300 + offset);
                bs(i) = b; i = i + 1;
            end

        end

    end

    %% Keyboard Event
    function keypress(~, e)

        switch e.Key
            case 'leftarrow'
                p.dl = 1;
            case 'rightarrow'
                p.dr = 1;
            case 'uparrow'
                p.du = 1;
            case 'downarrow'
                p.dd = 1;
            case 'space'
                % start game / resume game
                if strcmp(Timer.Running, 'on')
                    stop(Timer)
                else
                    start(Timer)
                end

            otherwise
        end

    end

    function keyrelease(~, e)

        switch e.Key
            case 'leftarrow'
                p.dl = 0;
            case 'rightarrow'
                p.dr = 0;
            case 'uparrow'
                p.du = 0;
            case 'downarrow'
                p.dd = 0;
            otherwise
        end

    end

end
