classdef Bullet < handle

    properties
        size
        position
        live = 3
        body
        spd = [0, 0]
    end

    methods

        function obj = Bullet(s, p)
            % constructor
            obj.size = s;
            obj.position = p;
            obj.body = rectangle('edgecolor', 'k', 'facecolor', 'k');
        end

        function move(obj)
            obj.position = obj.position + obj.spd;
        end

        function res = crash(obj, obj2)
            distance = abs(norm(obj.position - obj2.position));

            if distance < (obj.size + obj2.size) / 2
                obj.live = obj.live - 1;
                res = true;
            else
                res = false;
            end

        end

        function draw(obj)
            obj.body.Position = [obj.position, obj.size, obj.size];
        end

    end

end
