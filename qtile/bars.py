from libqtile import bar, widget
from colors import colors

topBar = bar.Bar(
    [
        widget.Image(
            filename="~/.local/share/icons/endeavour-os.png", margin=3),
        widget.Sep(
            lineWidth=5,
            foreground=colors["purple"]
        ),
        widget.CurrentLayout(),
        widget.Sep(
            lineWidth=5,
            foreground=colors["purple"]
        ),
        widget.GroupBox(
            this_current_screen_border=colors["cyan"],
            padding_y=2,
            inactive="#ffffff"
        ),
        widget.Sep(
            lineWidth=5,
            foreground=colors["purple"]
        ),
        widget.Mpris2(width=400),
        widget.Prompt(prompt="> ", padding=8),
        widget.Spacer(length=bar.STRETCH),
        widget.StatusNotifier(),
        widget.PulseVolume(
            background=colors["dark"]["background"], fmt="volume: {}"),
        widget.ThermalSensor(
            tag_sensor="edge", background=colors["cyan"]),
        widget.Memory(background=colors["orange"],
                      format="{MemUsed: .0f}{mm} -{MemTotal: .0f}{mm}"
                      ),
        widget.CPU(background=colors["green"]),
        # widget.Sep(lineWidth=5,foreground=colors["purple"]),
        widget.Chord(
            chords_colors={
                "launch": ("#ff0000", "#ffffff"),
            },
            name_transform=lambda name: name.upper(),
        ),
        # NB Systray is incompatible with Wayland, consider using StatusNotifier instead
        widget.Net(
            prefix="M", background=colors["yellow"]["background"]),
        # widget.Sep(lineWidth= 5, foreground= colors["purple"]),
        # widget.Systray(icon_size=16),
        widget.Clock(format="%d/%m/%Y - %A, %H:%M %p",
                     background=colors["pink"]),
    ],
    24,
    background=colors["background"],
    border_width=4,  # Draw top and bottom borders
    border_color=colors["purple"],
    margin=2
)
