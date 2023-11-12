import os

path = os.path.expanduser("~") + "/" + ".bash_aliases"
file = open(path)
aliases = dict()

for alias in file:
    if "alias" in alias:
        (key, _, value) = alias.partition("=")
        (_, label) = key.split(" ")
        aliases[label] = value.rstrip().replace("'", "")
