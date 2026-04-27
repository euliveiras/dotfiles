return {
  {
    "nvim-neotest/nvim-nio",
  },

  {
    "williamboman/mason.nvim",
    opts = {},
  },

  {
    "jay-babu/mason-nvim-dap.nvim",
    dependencies = {
      "williamboman/mason.nvim",
      "mfussenegger/nvim-dap",
    },
    opts = {
      ensure_installed = {
        "js-debug-adapter",
        "python",
      },
      automatic_installation = true,
    },
  },

  {
    "theHamsta/nvim-dap-virtual-text",
    dependencies = {
      "mfussenegger/nvim-dap",
    },
    opts = {},
  },

  {
    "mfussenegger/nvim-dap-python",
    dependencies = {
      "mfussenegger/nvim-dap",
    },
  },

  {
    "rcarriga/nvim-dap-ui",
    dependencies = {
      "mfussenegger/nvim-dap",
      "nvim-neotest/nvim-nio",
    },
    opts = {},
  },

  {
    "mfussenegger/nvim-dap",
    event = "VeryLazy",
    dependencies = {
      "rcarriga/nvim-dap-ui",
      "nvim-neotest/nvim-nio",
      "jay-babu/mason-nvim-dap.nvim",
      "theHamsta/nvim-dap-virtual-text",
      "mfussenegger/nvim-dap-python",
    },
    config = function()
      local dap = require("dap")
      local dapui = require("dapui")

      require("nvim-dap-virtual-text").setup({})

      -- Python DAP
      require("dap-python").setup(
        vim.fn.stdpath("data") .. "/mason/packages/debugpy/venv/bin/python"
      )

      -- DAP UI
      dapui.setup({})

      dap.listeners.before.attach.dapui_config = function()
        dapui.open()
      end

      dap.listeners.before.launch.dapui_config = function()
        dapui.open()
      end

      dap.listeners.after.event_terminated.dapui_config = function()
        dapui.close()
      end

      dap.listeners.after.event_exited.dapui_config = function()
        dapui.close()
      end

      -- Signs
      vim.fn.sign_define("DapBreakpoint", {
        text = "●",
        texthl = "DiagnosticError",
        linehl = "",
        numhl = "",
      })

      vim.fn.sign_define("DapStopped", {
        text = "▶",
        texthl = "DiagnosticWarn",
        linehl = "",
        numhl = "",
      })

      -- JavaScript / TypeScript Adapter via Mason
      dap.adapters["pwa-node"] = {
        type = "server",
        host = "127.0.0.1",
        port = "${port}",
        executable = {
          command = "node",
          args = {
            vim.fn.stdpath("data")
              .. "/mason/packages/js-debug-adapter/js-debug/src/dapDebugServer.js",
            "${port}",
          },
        },
      }

      for _, language in ipairs({
        "javascript",
        "typescript",
        "javascriptreact",
        "typescriptreact",
      }) do
        dap.configurations[language] = {
          {
            type = "pwa-node",
            request = "launch",
            name = "Launch current JS file",
            program = "${file}",
            cwd = "${workspaceFolder}",
            runtimeExecutable = "node",
            runtimeArgs = {
              "--inspect-brk",
            },
            sourceMaps = true,
            protocol = "inspector",
            console = "integratedTerminal",
          },

          {
            type = "pwa-node",
            request = "launch",
            name = "Launch current TS file with ts-node",
            runtimeExecutable = "node",
            runtimeArgs = {
              "--inspect-brk",
              "-r",
              "ts-node/register",
              "-r",
              "tsconfig-paths/register",
            },
            args = {
              "${file}",
            },
            cwd = "${workspaceFolder}",
            sourceMaps = true,
            protocol = "inspector",
            console = "integratedTerminal",
          },

          {
            type = "pwa-node",
            request = "attach",
            name = "Attach to Node process",
            processId = require("dap.utils").pick_process,
            cwd = "${workspaceFolder}",
            sourceMaps = true,
            protocol = "inspector",
          },
        }
      end
    end,

    keys = {
      {
        "<leader>d",
        group = "Debugger",
        nowait = true,
        remap = false,
      },
      {
        "<leader>dt",
        function()
          require("dap").toggle_breakpoint()
        end,
        desc = "Toggle Breakpoint",
      },
      {
        "<leader>dc",
        function()
          require("dap").continue()
        end,
        desc = "Continue",
      },
      {
        "<leader>di",
        function()
          require("dap").step_into()
        end,
        desc = "Step Into",
      },
      {
        "<leader>do",
        function()
          require("dap").step_over()
        end,
        desc = "Step Over",
      },
      {
        "<leader>du",
        function()
          require("dap").step_out()
        end,
        desc = "Step Out",
      },
      {
        "<leader>dr",
        function()
          require("dap").repl.open()
        end,
        desc = "Open REPL",
      },
      {
        "<leader>dl",
        function()
          require("dap").run_last()
        end,
        desc = "Run Last",
      },
      {
        "<leader>dq",
        function()
          require("dap").terminate()
          require("dapui").close()
        end,
        desc = "Terminate",
      },
      {
        "<leader>db",
        function()
          require("dap").list_breakpoints()
        end,
        desc = "List Breakpoints",
      },
      {
        "<leader>de",
        function()
          require("dap").set_exception_breakpoints({ "all" })
        end,
        desc = "Set Exception Breakpoints",
      },
    },
  },
}
