return {
  "nvim-treesitter/nvim-treesitter",
  branch = "main",
  version = false, -- last release is way too old and doesn't work on Windows
build = ':TSUpdate',
lazy = false,
    indent = { enable = true }, ---@type lazyvim.TSFeat
    highlight = { enable = true }, ---@type lazyvim.TSFeat
    folds = { enable = true }, ---@type lazyvim.TSFeat
    ensure_installed = {
      "c_sharp",
      "fsharp",
      "bash",
      "c",
      "ninja",
      "rst",
      "dart",
      "diff",
      "html",
      "javascript",
      "jsdoc",
      "json",
      "jsonc",
      "lua",
      "luadoc",
      "luap",
      "markdown",
      "markdown_inline",
      "printf",
      "python",
      "query",
      "regex",
      "toml",
      "tsx",
      "typescript",
      "vim",
      "vimdoc",
      "xml",
      "yaml",
    },
  
}
