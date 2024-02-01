from libqtile import bar, widget
from colors import colors

groupBoxFont = "JetBrainsMonoNLNerdFontPropo"


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
            inactive=colors["white"],
            font=groupBoxFont,
            fontsize=14,
            highlight_method='line',
        ),
        widget.Sep(
            lineWidth=5,
            foreground=colors["purple"],
        ),
        widget.Mpris2(width=300),
        widget.Prompt(prompt="> ", padding=8, scroll=True, width=250),
        widget.Spacer(length=bar.STRETCH),
        widget.StatusNotifier(),
        widget.PulseVolume(
            background=colors["dark"]["background"], fmt="volume: {}"),
        widget.ThermalSensor(
            tag_sensor="Tctl", background=colors["cyan"], format='{temp:.0f}{unit}', fmt="cpu {}"),
        widget.Sep(
            padding=1, foreground=colors["white"], background=colors["white"]),
        widget.ThermalSensor(
            tag_sensor="mem", background=colors["cyan"], format='{temp:.0f}{unit}', fmt="mem {}"),
        widget.Sep(
            padding=1, foreground=colors["white"], background=colors["white"]),
        widget.ThermalSensor(
            tag_sensor="edge", background=colors["cyan"], format='{temp:.0f}{unit}', fmt="gpu {}"),
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
