# Code Quest turtle shim: real Python's `turtle` module needs tkinter, which
# isn't available in Pyodide. This installs a drop-in replacement into
# sys.modules BEFORE the learner's code runs, so `import turtle` "just works"
# and draws onto an HTML canvas instead of a tkinter window.
import sys
import types
import math
from js import CodeQuestTurtleAPI as _api


class _Turtle:
    def __init__(self, api, fresh=True):
        self._api = api
        self.x = 0.0
        self.y = 0.0
        self.heading_deg = 0.0
        self.is_down = True
        self.pen_color = "#2b6cff"
        self.pen_width = 3
        self.visible = True
        if fresh:
            self._api.clear()
        self._api.drawTurtleIcon(self.x, self.y, self.heading_deg, self.visible)

    def forward(self, distance):
        rad = math.radians(self.heading_deg)
        nx = self.x + distance * math.cos(rad)
        ny = self.y + distance * math.sin(rad)
        if self.is_down:
            self._api.line(self.x, self.y, nx, ny, self.pen_color, self.pen_width)
        self.x, self.y = nx, ny
        self._api.drawTurtleIcon(self.x, self.y, self.heading_deg, self.visible)

    fd = forward

    def backward(self, distance):
        self.forward(-distance)

    bk = backward
    back = backward

    def right(self, angle):
        self.heading_deg = (self.heading_deg - angle) % 360
        self._api.drawTurtleIcon(self.x, self.y, self.heading_deg, self.visible)

    rt = right

    def left(self, angle):
        self.heading_deg = (self.heading_deg + angle) % 360
        self._api.drawTurtleIcon(self.x, self.y, self.heading_deg, self.visible)

    lt = left

    def penup(self):
        self.is_down = False

    pu = penup
    up = penup

    def pendown(self):
        self.is_down = True

    pd = pendown
    down = pendown

    def goto(self, x, y=None):
        if y is None:
            x, y = x[0], x[1]
        if self.is_down:
            self._api.line(self.x, self.y, x, y, self.pen_color, self.pen_width)
        self.x, self.y = float(x), float(y)
        self._api.drawTurtleIcon(self.x, self.y, self.heading_deg, self.visible)

    setpos = goto
    setposition = goto

    def setheading(self, angle):
        self.heading_deg = angle % 360
        self._api.drawTurtleIcon(self.x, self.y, self.heading_deg, self.visible)

    seth = setheading

    def home(self):
        self.goto(0, 0)
        self.setheading(0)

    def position(self):
        return (self.x, self.y)

    pos = position

    def color(self, c, *_ignored):
        self.pen_color = c

    pencolor = color

    def pensize(self, w):
        self.pen_width = w

    width = pensize

    def speed(self, s=None):
        # Drawing is instant in this canvas shim; speed is accepted for
        # compatibility with real turtle code but has no visual effect.
        pass

    def hideturtle(self):
        self.visible = False
        self._api.drawTurtleIcon(self.x, self.y, self.heading_deg, self.visible)

    ht = hideturtle

    def showturtle(self):
        self.visible = True
        self._api.drawTurtleIcon(self.x, self.y, self.heading_deg, self.visible)

    st = showturtle

    def circle(self, radius, extent=360, steps=None):
        if steps is None:
            steps = max(12, int(abs(extent) / 6))
        step_angle = extent / steps
        step_len = 2 * math.pi * abs(radius) * (step_angle / 360.0)
        turn = step_angle if radius >= 0 else -step_angle
        for _ in range(steps):
            self.forward(step_len)
            self.left(turn)

    def write(self, text, **kwargs):
        self._api.writeText(self.x, self.y, str(text))

    def reset(self):
        # Real turtle's reset() restores pen defaults too, not just position.
        self.x = 0.0
        self.y = 0.0
        self.heading_deg = 0.0
        self.is_down = True
        self.pen_color = "#2b6cff"
        self.pen_width = 3
        self.visible = True
        self._api.clear()
        self._api.drawTurtleIcon(0, 0, 0, self.visible)

    def bgcolor(self, c):
        self._api.setBg(c)

    def dot(self, size=8, color=None):
        self._api.line(self.x, self.y, self.x + 0.01, self.y, color or self.pen_color, size)

    def done(self):
        pass

    mainloop = done


class _Screen:
    def __init__(self, api):
        self._api = api

    def bgcolor(self, c):
        self._api.setBg(c)

    def title(self, t):
        pass

    def setup(self, *a, **k):
        pass

    def tracer(self, *a, **k):
        pass

    def update(self):
        pass

    def exitonclick(self):
        pass

    def clear(self):
        self._api.clear()

    def done(self):
        pass


def _install_turtle_module():
    mod = types.ModuleType("turtle")
    default_turtle = _Turtle(_api, fresh=True)

    proc_names = [
        "forward", "fd", "backward", "bk", "back", "right", "rt", "left", "lt",
        "penup", "pu", "up", "pendown", "pd", "down", "goto", "setpos", "setposition",
        "setheading", "seth", "home", "position", "pos", "color", "pencolor",
        "pensize", "width", "speed", "hideturtle", "ht", "showturtle", "st",
        "circle", "write", "reset", "bgcolor", "dot", "done", "mainloop",
    ]
    for name in proc_names:
        setattr(mod, name, getattr(default_turtle, name))

    mod.Turtle = lambda: _Turtle(_api, fresh=False)
    mod.Screen = lambda: _Screen(_api)
    mod.Vec2D = tuple

    sys.modules["turtle"] = mod
    return mod


_install_turtle_module()
