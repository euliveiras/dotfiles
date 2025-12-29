vim.g.mapleader = " "
vim.opt.clipboard = "unnamedplus"
vim.keymap.set("n", "gd",  vim.lsp.buf.definition)
vim.keymap.set("n", "K", vim.lsp.buf.hover)
