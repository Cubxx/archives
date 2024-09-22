classdef Player < Bullet

    properties
        dl = 0
        dr = 0
        du = 0
        dd = 0
    end

    methods

        function obj = Player(s, p)
            obj = obj@Bullet(s, p);
            obj.live = 5;
        end

        function move(obj)
            [px, py] = deal(obj.position(1), obj.position(2));
            % edge detect
            if px < 0
                obj.dl = 0;
                % obj.position(1)=0;
            end

            if px > 600 - obj.size
                obj.dr = 0;
                % obj.position(1)=600-obj.size;
            end

            if py < 0
                obj.dd = 0;
                % obj.position(2)=0;
            end

            if py > 600 - obj.size
                obj.du = 0;
                % obj.position(2)=600-obj.size;
            end

            x = obj.dr - obj.dl; y = obj.du - obj.dd;
            obj.spd = [x, y] * 4 * 2;
            move@Bullet(obj);
        end

    end

end
