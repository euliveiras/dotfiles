import subprocess

from libqtile import hook, bar
from config import topBar

@hook.subscribe.startup
def run_every_startup():
    try:
        subprocess.run(["compfy", "-b"])
        topBar.window.window.set_property("QTILE_BAR", 1, "CARDINAL", 32)
    except Exception as e:
        print("Something went wrong", e)
