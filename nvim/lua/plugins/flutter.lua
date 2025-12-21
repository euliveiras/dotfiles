return {
  "nvim-flutter/flutter-tools.nvim",
  lazy = false, -- Load on startup for mobile development
  dependencies = {
    "nvim-lua/plenary.nvim",
    "stevearc/dressing.nvim", -- optional for better UI
  },
  config = function()
    require("flutter-tools").setup({
      -- Using the absolute path you confirmed earlier
      flutter_path = "/Users/euliveiras/.flutter/bin/flutter",
    })
  end,
}
